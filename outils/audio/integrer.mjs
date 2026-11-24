/**
 * Met dans l'app les audios validés à l'écoute.
 *
 *   node outils/audio/integrer.mjs                     (tous les Noms découpés)
 *   node outils/audio/integrer.mjs --sauf 12,45        (sauf les Noms « à refaire » de la page d'écoute)
 *
 * 1. Copie audio-travail/clips/NN.mp3 vers public/audio/noms/<id>.mp3 (id du Nom dans names.ts).
 * 2. Réécrit src/data/nameAudio.ts avec tous les fichiers présents dans public/audio/noms :
 *    chaque Nom qui y figure reçoit son bouton « Écouter » dans l'app.
 * Les Noms de --sauf ne sont pas copiés ; un ancien fichier validé de ce Nom reste en place.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { formatNumbers, loadNames, pad, parseNumbers, ROOT } from './noms.mjs';

const args = process.argv.slice(2);
let except = [];
let workDir = path.join(ROOT, 'audio-travail');
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--sauf') except = parseNumbers(args[++i] ?? '');
  else if (args[i] === '--travail') workDir = path.resolve(args[++i]);
  else {
    console.error(`Argument inconnu : ${args[i]}`);
    process.exit(1);
  }
}

const names = await loadNames();
const clipsDir = path.join(workDir, 'clips');
const audioDir = path.join(ROOT, 'public', 'audio', 'noms');
fs.mkdirSync(audioDir, { recursive: true });

const copied = [];
const skipped = [];
for (const name of names) {
  const clip = path.join(clipsDir, `${pad(name.n)}.mp3`);
  if (!fs.existsSync(clip)) continue;
  if (except.includes(name.n)) {
    skipped.push(name.n);
    continue;
  }
  fs.copyFileSync(clip, path.join(audioDir, `${name.id}.mp3`));
  copied.push(name.n);
}

// nameAudio.ts : tous les fichiers présents, dans l'ordre de la liste de Tirmidhî
const entries = names
  .filter(name => fs.existsSync(path.join(audioDir, `${name.id}.mp3`)))
  .map(name => {
    const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(audioDir, `${name.id}.mp3`))).digest('hex').slice(0, 10);
    return `  ${name.id}: '${hash}', // n° ${name.n} ${name.transliteration}`;
  });

const header = `/**
 * Audios des Noms : un fichier par Nom, dans public/audio/noms/<id>.mp3 (id de names.ts).
 *
 * FICHIER RÉÉCRIT PAR outils/audio/integrer.mjs : ne pas le modifier à la main.
 *
 * Un Nom n'a de bouton « Écouter » que s'il figure ici. Tant que la liste est vide,
 * aucun bouton audio n'apparaît dans l'app (site web et app Android).
 * On n'y ajoute que des audios écoutés et validés (page d'écoute, voir outils/audio/LISEZMOI.md).
 *
 * Clé : id du Nom. Valeur : empreinte du fichier. Elle change quand le fichier change :
 * téléphones et navigateurs chargent alors le nouveau fichier au lieu de garder l'ancien en mémoire.
 */
`;
const body = entries.length ? `{\n${entries.join('\n')}\n}` : '{}';
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'nameAudio.ts'), `${header}export const NAME_AUDIO: Readonly<Record<number, string>> = ${body};\n`);

const sizeKb = fs.readdirSync(audioDir).reduce((sum, f) => sum + fs.statSync(path.join(audioDir, f)).size, 0) / 1024;
console.log(`Copiés dans public/audio/noms : ${copied.length} Noms${copied.length ? ` (n° ${formatNumbers(copied)})` : ''}.`);
if (skipped.length) console.log(`Laissés de côté (à refaire) : n° ${formatNumbers(skipped)}.`);
console.log(`src/data/nameAudio.ts : ${entries.length} Noms ont maintenant un bouton « Écouter » (${Math.round(sizeKb)} Ko d'audio en tout).`);
