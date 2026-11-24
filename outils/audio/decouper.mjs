/**
 * Découpe les enregistrements des 99 Noms en un fichier par Nom, puis prépare la page d'écoute.
 *
 *   node outils/audio/decouper.mjs <dossier des enregistrements>
 *   node outils/audio/decouper.mjs --noms 12,45 <fichier>       (Noms refaits à part, lus dans l'ordre croissant)
 *
 * Il faut ffmpeg (https://ffmpeg.org). Voir outils/audio/LISEZMOI.md pour tout le déroulé.
 *
 * Pour chaque enregistrement :
 *  1. son en mono, débarrassé des basses inutiles (souffle, vibrations du téléphone) ;
 *  2. volume réglé sur tout le bloc (norme EBU R128, -16 LUFS) : tous les Noms sonnent aussi fort ;
 *  3. repérage des Noms : on mesure le bruit de fond et la voix, puis on cherche les 10 grandes pauses
 *     qui séparent 11 Noms (ou le nombre de --noms). Elles doivent être nettement plus longues que
 *     les petites pauses à l'intérieur d'un Nom (ex. Dhû l-Jalâli / wa l-Ikrâm). Sinon le bloc
 *     n'est pas découpé et le rapport explique pourquoi ;
 *  4. un fichier MP3 par Nom, avec un petit fondu au début et à la fin : audio-travail/clips/NN.mp3
 *     (NN = numéro dans la liste de Tirmidhî, comme sur la feuille d'enregistrement).
 * Ensuite : rapport (audio-travail/rapport.txt) et page d'écoute (audio-travail/ecoute/index.html).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadNames, NAMES_PER_BLOCK, pad, parseNumbers, ROOT } from './noms.mjs';
import { buildListeningPage } from './ecoute.mjs';

const AUDIO_EXTENSIONS = new Set(['.m4a', '.mp3', '.wav', '.ogg', '.opus', '.aac', '.amr', '.flac', '.webm', '.3gp', '.mp4', '.caf']);
// Volume visé : -16 LUFS (habituel pour l'écoute sur téléphone), crêtes sous -1,5 dB
const LOUDNESS = 'I=-16:TP=-1.5:LRA=11';
// Repérage des Noms (durées en secondes)
const FRAME = 0.02; // on mesure le volume toutes les 10 ms, sur 20 ms
const HOP = 0.01;
const MIN_PAUSE_BETWEEN_NAMES = 0.9; // une pause entre deux Noms dure au moins ça (consigne : 2 s)
const CLICK = 0.12; // un son plus court, isolé dans une pause, est un clic ou un souffle
// Marges gardées autour de la voix (s)
const MARGIN_BEFORE = 0.15;
const MARGIN_AFTER = 0.35;

// ------------------------------------------------------------------
// Arguments
// ------------------------------------------------------------------
const args = process.argv.slice(2);
let onlyNames = null;
let workDir = path.join(ROOT, 'audio-travail');
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--noms') onlyNames = parseNumbers(args[++i] ?? '');
  else if (args[i] === '--travail') workDir = path.resolve(args[++i]);
  else positional.push(args[i]);
}
if (positional.length !== 1) {
  console.error('Usage : node outils/audio/decouper.mjs <dossier des enregistrements>');
  console.error('        node outils/audio/decouper.mjs --noms 12,45 <fichier>');
  process.exit(1);
}
const input = path.resolve(positional[0]);

// ------------------------------------------------------------------
// ffmpeg
// ------------------------------------------------------------------
function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (result.error) throw new Error(`${command} introuvable : installez ffmpeg (https://ffmpeg.org).`);
  if (result.status !== 0) throw new Error(`${command} a échoué :\n${result.stderr.slice(-1500)}`);
  return result.stderr;
}
const ffmpeg = argv => run('ffmpeg', ['-hide_banner', '-nostats', ...argv]);

function duration(file) {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return Number(result.stdout.trim());
}

/** Mono 48 kHz, sans les basses sous 70 Hz, puis volume réglé en deux passes (mesure, puis correction) */
function prepare(source, target) {
  const decoded = `${target}.brut.wav`;
  ffmpeg(['-y', '-i', source, '-vn', '-ac', '1', '-ar', '48000', '-af', 'highpass=f=70', '-c:a', 'pcm_s16le', decoded]);
  const measureLog = ffmpeg(['-i', decoded, '-af', `loudnorm=${LOUDNESS}:print_format=json`, '-f', 'null', '-']);
  const measured = JSON.parse(measureLog.slice(measureLog.lastIndexOf('{'), measureLog.lastIndexOf('}') + 1));
  const filter = `loudnorm=${LOUDNESS}:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}` +
    `:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:linear=true`;
  ffmpeg(['-y', '-i', decoded, '-af', filter, '-ar', '48000', '-c:a', 'pcm_s16le', target]);
  fs.rmSync(decoded);
}

/** Lit un fichier WAV mono 16 bits (celui préparé par prepare) */
function readWav(file) {
  const buffer = fs.readFileSync(file);
  let offset = 12;
  let rate = 48000;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (id === 'fmt ') rate = buffer.readUInt32LE(offset + 12);
    if (id === 'data') {
      const end = Math.min(buffer.length, offset + 8 + size);
      const samples = new Float32Array(Math.floor((end - offset - 8) / 2));
      for (let i = 0; i < samples.length; i++) samples[i] = buffer.readInt16LE(offset + 8 + i * 2) / 32768;
      return { samples, rate };
    }
    offset += 8 + size + (size % 2);
  }
  throw new Error(`Fichier WAV illisible : ${file}`);
}

const seconds = value => `${value.toFixed(1).replace('.', ',')} s`;
const percentile = (values, p) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
};
const db = value => (20 * Math.log10(value)).toFixed(0);

/**
 * Trouve les Noms d'un enregistrement.
 * 1. Volume toutes les 10 ms ; bruit de fond = les 10 % les plus calmes, voix = les 3 % les plus forts.
 * 2. Seuil entre les deux (plus près du bruit) : au-dessus, on entend la voix.
 * 3. Les passages de voix très courts et isolés (clics, souffles) sont ignorés.
 * 4. Il faut entendre exactement `expected` passages séparés par une vraie pause (0,9 s ou plus) :
 *    ces pauses séparent les Noms, et elles doivent être nettement plus longues que la plus longue
 *    pause restante (pause à l'intérieur d'un Nom, ex. Dhû l-Jalâli / wa l-Ikrâm).
 */
function findNames(file, expected) {
  const { samples, rate } = readWav(file);
  const frame = Math.round(FRAME * rate);
  const hop = Math.round(HOP * rate);
  const levels = [];
  for (let start = 0; start + frame <= samples.length; start += hop) {
    let sum = 0;
    for (let i = start; i < start + frame; i++) sum += samples[i] * samples[i];
    levels.push(Math.sqrt(sum / frame) + 1e-6);
  }
  const noise = percentile(levels, 0.1);
  const voice = percentile(levels, 0.97);
  // Seuil à 30 % de l'écart entre bruit et voix (en dB), et au moins 6 dB au-dessus du bruit
  const threshold = Math.max(noise * 2, noise * Math.pow(voice / noise, 0.3));
  const info = { noise: db(noise), voice: db(voice), threshold: db(threshold) };
  if (voice / noise < 4) return { error: `On n'entend presque pas la voix au-dessus du bruit de fond (bruit ${info.noise} dB, voix ${info.voice} dB).`, info };

  // Passages au-dessus du seuil ; des creux de moins de 80 ms ne coupent pas un passage
  let runs = [];
  let current = null;
  levels.forEach((level, i) => {
    const time = i * HOP;
    if (level >= threshold) {
      if (current && time - current.end <= 0.08) current.end = time + FRAME;
      else {
        current = { start: time, end: time + FRAME };
        runs.push(current);
      }
    }
  });
  // Clics et souffles : passage très court, entouré de silence
  runs = runs.filter((run, i) => {
    const before = i === 0 ? Infinity : run.start - runs[i - 1].end;
    const after = i === runs.length - 1 ? Infinity : runs[i + 1].start - run.end;
    return !(run.end - run.start < CLICK && before > 0.3 && after > 0.3);
  });
  const longPauses = runs.slice(1).filter((run, i) => run.start - runs[i].end >= MIN_PAUSE_BETWEEN_NAMES).length;
  info.heard = longPauses + 1;
  if (runs.length < expected) return { error: `Seulement ${runs.length} passages de voix au lieu de ${expected} Noms.`, info };

  // Les plus longues pauses séparent les Noms
  const pauses = runs.slice(1).map((run, i) => ({ index: i + 1, length: run.start - runs[i].end }));
  const byLength = [...pauses].sort((a, b) => b.length - a.length);
  const between = byLength.slice(0, expected - 1);
  const inside = byLength.slice(expected - 1);
  const shortestBetween = between.length ? between[between.length - 1].length : Infinity;
  const longestInside = inside.length ? inside[0].length : 0;
  info.shortestBetween = shortestBetween;
  info.longestInside = longestInside;
  const clear = info.heard === expected && shortestBetween >= MIN_PAUSE_BETWEEN_NAMES &&
    (longestInside <= 0.6 * shortestBetween || shortestBetween - longestInside >= 0.5);
  if (!clear) {
    let error;
    if (info.heard < expected) {
      error = `J'entends ${info.heard} Noms séparés par une vraie pause (0,9 s ou plus), il en faut ${expected} : ` +
        'un Nom manque, ou deux Noms se suivent sans vraie pause.';
    } else if (info.heard > expected) {
      error = `J'entends ${info.heard} passages séparés par une vraie pause, il en faut ${expected} : ` +
        'un Nom lu en trop, ou une parole ou un bruit pendant une pause.';
    } else {
      error = `Les pauses entre deux Noms (la plus courte : ${seconds(shortestBetween)}) ne sont pas assez différentes ` +
        `des pauses à l'intérieur d'un Nom (la plus longue : ${seconds(longestInside)}).`;
    }
    return { error, info };
  }
  const cuts = new Set(between.map(pause => pause.index));
  const segments = [];
  // pause : la plus longue pause à l'intérieur de ce Nom
  let group = { start: runs[0].start, end: runs[0].end, pause: 0 };
  for (let i = 1; i < runs.length; i++) {
    if (cuts.has(i)) {
      segments.push(group);
      group = { start: runs[i].start, end: runs[i].end, pause: 0 };
    } else {
      group.pause = Math.max(group.pause, runs[i].start - group.end);
      group.end = runs[i].end;
    }
  }
  segments.push(group);
  return { segments, info };
}

function cut(file, total, segments, numbers, clipsDir) {
  return segments.map((segment, i) => {
    const previousEnd = i === 0 ? 0 : segments[i - 1].end;
    const nextStart = i === segments.length - 1 ? total : segments[i + 1].start;
    const start = Math.max(0, segment.start - MARGIN_BEFORE, (previousEnd + segment.start) / 2);
    const end = Math.min(total, segment.end + MARGIN_AFTER, (segment.end + nextStart) / 2);
    const length = end - start;
    const fadeOut = Math.min(0.1, length / 4);
    const target = path.join(clipsDir, `${pad(numbers[i])}.mp3`);
    ffmpeg([
      '-y', '-loglevel', 'error', '-ss', start.toFixed(3), '-to', end.toFixed(3), '-i', file,
      '-af', `afade=t=in:st=0:d=0.02,afade=t=out:st=${(length - fadeOut).toFixed(3)}:d=${fadeOut.toFixed(3)}`,
      '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '96k', target,
    ]);
    return {
      n: numbers[i],
      start: Number(start.toFixed(2)),
      end: Number(end.toFixed(2)),
      voice: Number((segment.end - segment.start).toFixed(2)),
      pause: Number(segment.pause.toFixed(2)),
    };
  });
}


// ------------------------------------------------------------------
// Programme
// ------------------------------------------------------------------
const names = await loadNames();
const byNumber = new Map(names.map(name => [name.n, name]));
const clipsDir = path.join(workDir, 'clips');
const tmpDir = path.join(workDir, 'tmp');
fs.mkdirSync(clipsDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

// Enregistrements à traiter : [{ file, numbers }]
const jobs = [];
const errors = [];
if (onlyNames) {
  if (!fs.statSync(input).isFile()) throw new Error('Avec --noms, donnez un seul fichier.');
  jobs.push({ label: `Noms refaits (n° ${onlyNames.join(', ')})`, file: input, numbers: onlyNames });
} else {
  const files = fs.readdirSync(input)
    .filter(f => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
  const byBlock = new Map();
  for (const f of files) {
    // Numéro du bloc : premier nombre du nom du fichier (« Bloc 3.m4a », « bloc_03 (2).opus »...)
    const match = f.match(/\d+/);
    const block = match ? Number(match[0]) : NaN;
    if (!(block >= 1 && block <= 9)) {
      errors.push(`« ${f} » ignoré : son nom ne contient pas de numéro de bloc de 1 à 9.`);
      continue;
    }
    if (byBlock.has(block)) {
      errors.push(`Bloc ${block} : deux fichiers (« ${byBlock.get(block)} » et « ${f} »). Gardez seulement la bonne prise.`);
      byBlock.set(block, null);
      continue;
    }
    byBlock.set(block, f);
  }
  for (const [block, f] of [...byBlock].sort((a, b) => a[0] - b[0])) {
    if (!f) continue;
    const first = (block - 1) * NAMES_PER_BLOCK + 1;
    const numbers = Array.from({ length: NAMES_PER_BLOCK }, (_, i) => first + i);
    jobs.push({ label: `Bloc ${block} (n° ${first} à ${first + NAMES_PER_BLOCK - 1})`, file: path.join(input, f), numbers });
  }
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(b => !byBlock.has(b));
  if (missing.length) errors.push(`Blocs absents du dossier : ${missing.join(', ')}.`);
}

const reportLines = [`Découpage du ${new Date().toLocaleString('fr-CH')}`, ''];
const jsonPath = path.join(workDir, 'decoupage.json');
const details = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf8')) : {};
let cutCount = 0;

for (const job of jobs) {
  const normalized = path.join(tmpDir, `${path.basename(job.file)}.wav`);
  prepare(job.file, normalized);
  const total = duration(normalized);
  reportLines.push(`${job.label} : « ${path.basename(job.file)} » (${seconds(total)})`);
  const found = findNames(normalized, job.numbers.length);
  const { info } = found;
  if (!found.segments) {
    reportLines.push(`  ✗ Pas découpé. ${found.error}`);
    reportLines.push('    Le plus simple : refaire ce bloc.');
    reportLines.push('');
    continue;
  }
  const clips = cut(normalized, total, found.segments, job.numbers, clipsDir);
  cutCount += clips.length;
  reportLines.push(`  ✓ ${clips.length} Noms trouvés. Bruit de fond ${info.noise} dB, voix ${info.voice} dB ; ` +
    `pause la plus courte entre deux Noms ${seconds(info.shortestBetween)}, pause la plus longue dans un Nom ${seconds(info.longestInside)}.`);
  for (const clip of clips) {
    const name = byNumber.get(clip.n);
    let note = '';
    if (clip.voice < 0.35) note = '  ⚠ très court : à écouter de près';
    if (clip.voice > 3.5) note = '  ⚠ long : une parole en trop ou deux Noms collés ? à écouter de près';
    if (clip.pause > 0.6) note = `  ⚠ pause de ${seconds(clip.pause)} à l'intérieur : une parole en trop ? à écouter de près`;
    reportLines.push(`    n° ${String(clip.n).padStart(2)} ${name.transliteration.padEnd(24)} ${seconds(clip.voice)}${note}`);
    details[clip.n] = { source: path.basename(job.file), ...clip, at: new Date().toISOString() };
  }
  reportLines.push('');
}
fs.rmSync(tmpDir, { recursive: true, force: true });

if (errors.length) reportLines.push('Remarques :', ...errors.map(e => `  - ${e}`), '');
const allClips = fs.readdirSync(clipsDir).filter(f => /^\d\d\.mp3$/.test(f));
reportLines.push(`Fichiers découpés cette fois : ${cutCount}. Noms qui ont un fichier en tout : ${allClips.length} / 99.`);

fs.writeFileSync(jsonPath, JSON.stringify(details, null, 2));
fs.writeFileSync(path.join(workDir, 'rapport.txt'), reportLines.join('\n') + '\n');
const page = buildListeningPage(names, workDir);
console.log(reportLines.join('\n'));
console.log(`\nRapport : ${path.join(workDir, 'rapport.txt')}`);
console.log(`Page d'écoute : ${page}`);
