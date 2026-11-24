/**
 * Page d'écoute des Noms découpés : audio-travail/ecoute/index.html (+ ses fichiers dans ecoute/clips/).
 * On y écoute chaque Nom avec la personne choisie et on note ✓ Bon ou ↻ À refaire,
 * puis « Copier le résultat » donne le texte à envoyer à Claude.
 *
 * Créée par decouper.mjs. Pour la refaire seule : node outils/audio/ecoute.mjs
 * Le dossier ecoute/ se suffit à lui-même : on peut l'ouvrir dans un navigateur, le zipper ou le publier.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadNames, pad, ROOT } from './noms.mjs';

const escapeHtml = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function buildListeningPage(names, workDir) {
  const clipsDir = path.join(workDir, 'clips');
  const pageDir = path.join(workDir, 'ecoute');
  fs.rmSync(path.join(pageDir, 'clips'), { recursive: true, force: true });
  fs.mkdirSync(path.join(pageDir, 'clips'), { recursive: true });

  const rows = names.map(name => {
    const file = path.join(clipsDir, `${pad(name.n)}.mp3`);
    if (!fs.existsSync(file)) return { ...name, file: null, v: null };
    const bytes = fs.readFileSync(file);
    fs.writeFileSync(path.join(pageDir, 'clips', `${pad(name.n)}.mp3`), bytes);
    // Empreinte : un Nom refait a une nouvelle empreinte, et son ancienne note est oubliée
    const v = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 10);
    return { ...name, file: `clips/${pad(name.n)}.mp3`, v };
  });

  // Remplacement par une fonction : le texte inséré est pris tel quel
  const data = JSON.stringify(rows).replace(/</g, '\\u003c');
  const html = PAGE
    .replace('__DATA__', () => data)
    .replace('__DATE__', () => escapeHtml(new Date().toLocaleDateString('fr-CH')));
  const target = path.join(pageDir, 'index.html');
  fs.writeFileSync(target, html);
  return target;
}

const PAGE = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IlmQuest · Écoute des 99 Noms</title>
<style>
  :root { --ground:#F3F8F5; --surface:#fff; --line:#DCE9E1; --ink:#0C2A1F; --muted:#4F675C; --primary:#047857; --soft:#D1FAE5; --soft-ink:#065F46; --hero:#064E3B; --danger:#C2410C; --danger-soft:#FFEDD5; --danger-ink:#9A3412; --track:#E2EBE6; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--ground); color: var(--ink); font: 16px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  header { position: sticky; top: 0; z-index: 2; background: var(--hero); color: #fff; padding: 14px 16px 12px; }
  h1 { margin: 0; font-size: 1.15rem; }
  .sub { margin: 2px 0 10px; color: #A7F3D0; font-size: .85rem; }
  .count { font-weight: 800; font-size: .9rem; }
  .bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,.2); overflow: hidden; margin: 6px 0 10px; }
  .bar span { display: block; height: 100%; background: #6EE7B7; width: 0; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  button { font: inherit; cursor: pointer; border: 0; }
  .action { height: 40px; padding: 0 14px; border-radius: 20px; font-weight: 800; font-size: .9rem; background: #0B5E48; color: #fff; }
  .action.main { background: #fff; color: var(--hero); }
  main { max-width: 640px; margin: 0 auto; padding: 12px 12px 40px; }
  .help { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 12px 14px; font-size: .9rem; color: var(--muted); margin-bottom: 12px; }
  .help b { color: var(--ink); }
  ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
  li { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 10px 12px; scroll-margin: 150px 0 80px; }
  li.current { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(4,120,87,.25); }
  li.ok { background: #F0FDF4; }
  li.redo { background: var(--danger-soft); border-color: #FDBA74; }
  .top { display: flex; align-items: center; gap: 10px; }
  .num { width: 38px; height: 38px; flex: none; border-radius: 10px; background: var(--ground); display: grid; place-items: center; font-weight: 800; font-size: .85rem; color: var(--muted); }
  .names { flex: 1; min-width: 0; }
  .tr { font-weight: 800; }
  .fr { color: var(--muted); font-size: .85rem; }
  .ar { font-family: "Noto Naskh Arabic", "Amiri", "Geeza Pro", serif; font-size: 1.7rem; color: var(--primary); direction: rtl; text-align: right; line-height: 1.6; max-width: 45%; }
  .play { width: 44px; height: 44px; flex: none; border-radius: 50%; background: var(--soft); color: var(--soft-ink); display: grid; place-items: center; }
  .play.on { background: var(--primary); color: #fff; }
  .play:disabled { opacity: .35; cursor: default; }
  .verdict { display: flex; gap: 8px; margin-top: 8px; }
  .verdict button { flex: 1; height: 40px; border-radius: 12px; font-weight: 800; font-size: .9rem; background: var(--track); color: var(--ink); }
  .verdict .good[aria-pressed="true"] { background: var(--primary); color: #fff; }
  .verdict .bad[aria-pressed="true"] { background: var(--danger); color: #fff; }
  .note { display: none; width: 100%; margin-top: 8px; padding: 8px 10px; border: 1px solid #FDBA74; border-radius: 10px; font: inherit; font-size: .9rem; }
  li.redo .note { display: block; }
  .missing { margin-top: 6px; font-size: .85rem; color: var(--muted); font-style: italic; }
  .result { display: none; margin-top: 16px; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 12px; }
  .result.show { display: block; }
  .result textarea { width: 100%; min-height: 180px; font: .85rem/1.4 ui-monospace, monospace; border: 1px solid var(--line); border-radius: 10px; padding: 8px; }
  .result p { margin: 0 0 8px; font-weight: 800; }
</style>
</head>
<body>
<header>
  <h1>Écoute des 99 Noms</h1>
  <p class="sub">IlmQuest · page préparée le __DATE__</p>
  <div class="count" id="count"></div>
  <div class="bar"><span id="progress"></span></div>
  <div class="actions">
    <button class="action main" id="all" type="button">▶ Tout écouter</button>
    <button class="action" id="copy" type="button">Copier le résultat</button>
  </div>
</header>
<main>
  <div class="help">
    Écoutez chaque Nom avec la personne qui l'a lu. Il doit être <b>prononcé exactement comme écrit</b>, à la pause (sans voyelle finale), sans hésitation ni coupure.
    Touchez <b>✓ Bon</b> ou <b>↻ À refaire</b> (une remarque est possible). Vos choix restent sur ce téléphone si vous fermez la page.
    À la fin : <b>Copier le résultat</b> et envoyez-le à Claude.
  </div>
  <ol id="list"></ol>
  <div class="result" id="result"><p>Résultat (copié si votre navigateur le permet) :</p><textarea id="resultText" readonly></textarea></div>
</main>
<script>
const ROWS = __DATA__;
const KEY = 'ilmquest-ecoute-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} };
// Une note vaut pour une version précise du fichier (empreinte v) : un Nom refait repart de zéro
const keyOf = row => row.n + ':' + row.v;

const audio = new Audio();
let playing = null, sequence = false, timer = null;
const list = document.getElementById('list');

function render() {
  list.innerHTML = '';
  for (const row of ROWS) {
    const li = document.createElement('li');
    li.id = 'n' + row.n;
    const state = row.v ? saved[keyOf(row)] : null;
    if (state) li.classList.add(state.verdict);
    li.innerHTML =
      '<div class="top"><span class="num">' + row.n + '</span>' +
      '<div class="names"><div class="tr"></div><div class="fr"></div></div>' +
      '<div class="ar" lang="ar"></div>' +
      '<button class="play" type="button" aria-label="Écouter">▶</button></div>' +
      (row.v
        ? '<div class="verdict"><button class="good" type="button" aria-pressed="false">✓ Bon</button><button class="bad" type="button" aria-pressed="false">↻ À refaire</button></div>' +
          '<input class="note" type="text" placeholder="Remarque (ex. la fin est coupée)">'
        : '<div class="missing">Pas encore d\\'audio pour ce Nom</div>');
    li.querySelector('.tr').textContent = row.transliteration;
    li.querySelector('.fr').textContent = row.fr;
    li.querySelector('.ar').textContent = row.arabic;
    const play = li.querySelector('.play');
    play.disabled = !row.v;
    play.addEventListener('click', () => { stopSequence(); playRow(row); });
    if (row.v) {
      const good = li.querySelector('.good'), bad = li.querySelector('.bad'), note = li.querySelector('.note');
      good.setAttribute('aria-pressed', String(state && state.verdict === 'ok'));
      bad.setAttribute('aria-pressed', String(state && state.verdict === 'redo'));
      note.value = (state && state.note) || '';
      const set = verdict => {
        const current = saved[keyOf(row)];
        if (current && current.verdict === verdict) delete saved[keyOf(row)];
        else saved[keyOf(row)] = { verdict, note: note.value };
        save(); render(); updateCount();
        if (verdict === 'redo' && saved[keyOf(row)]) document.querySelector('#n' + row.n + ' .note').focus();
      };
      good.addEventListener('click', () => set('ok'));
      bad.addEventListener('click', () => set('redo'));
      note.addEventListener('input', () => { if (saved[keyOf(row)]) { saved[keyOf(row)].note = note.value; save(); } });
    }
    list.appendChild(li);
  }
  markPlaying();
}

function markPlaying() {
  document.querySelectorAll('li').forEach(li => li.classList.toggle('current', playing !== null && li.id === 'n' + playing));
  document.querySelectorAll('.play').forEach(b => b.classList.remove('on'));
  if (playing !== null) { const b = document.querySelector('#n' + playing + ' .play'); if (b) b.classList.add('on'); }
}

function playRow(row) {
  clearTimeout(timer);
  playing = row.n;
  markPlaying();
  audio.src = row.file + '?v=' + row.v;
  audio.play().catch(() => {});
  if (sequence) document.getElementById('n' + row.n).scrollIntoView({ block: 'center', behavior: 'smooth' });
}

audio.addEventListener('ended', () => {
  const finished = playing;
  const next = sequence ? ROWS.find(r => r.n > finished && r.v) : null;
  // Pendant la pause avant le Nom suivant, le Nom qui vient d'être lu reste surligné
  if (!next) { stopSequence(); playing = null; markPlaying(); return; }
  timer = setTimeout(() => playRow(next), 1500);
});

function stopSequence() {
  sequence = false; clearTimeout(timer);
  document.getElementById('all').textContent = '▶ Tout écouter';
}

document.getElementById('all').addEventListener('click', () => {
  if (sequence) { stopSequence(); audio.pause(); playing = null; markPlaying(); return; }
  audio.pause();
  const first = ROWS.find(r => r.v);
  if (!first) return;
  sequence = true;
  document.getElementById('all').textContent = '■ Arrêter';
  playRow(first);
});

// [1, 2, 3, 5] → « 1 à 3, 5 »
function ranges(numbers) {
  const parts = [];
  for (let i = 0; i < numbers.length; i++) {
    let j = i;
    while (j + 1 < numbers.length && numbers[j + 1] === numbers[j] + 1) j++;
    parts.push(j - i >= 2 ? numbers[i] + ' à ' + numbers[j] : numbers.slice(i, j + 1).join(', '));
    i = j;
  }
  return parts.join(', ');
}

function updateCount() {
  const withAudio = ROWS.filter(r => r.v);
  const ok = withAudio.filter(r => saved[keyOf(r)] && saved[keyOf(r)].verdict === 'ok').length;
  const redo = withAudio.filter(r => saved[keyOf(r)] && saved[keyOf(r)].verdict === 'redo').length;
  document.getElementById('count').textContent =
    (ok + redo) + ' / ' + withAudio.length + ' écoutés · ' + ok + ' bons · ' + redo + ' à refaire' +
    (withAudio.length < 99 ? ' · ' + (99 - withAudio.length) + ' sans audio' : '');
  document.getElementById('progress').style.width = (withAudio.length ? (100 * (ok + redo) / withAudio.length) : 0) + '%';
}

document.getElementById('copy').addEventListener('click', () => {
  const withAudio = ROWS.filter(r => r.v);
  const ok = withAudio.filter(r => saved[keyOf(r)] && saved[keyOf(r)].verdict === 'ok');
  const redo = withAudio.filter(r => saved[keyOf(r)] && saved[keyOf(r)].verdict === 'redo');
  const notHeard = withAudio.filter(r => !saved[keyOf(r)]);
  const noAudio = ROWS.filter(r => !r.v);
  const lines = ['IlmQuest · écoute des Noms (' + new Date().toLocaleDateString('fr-CH') + ')', 'Bons : ' + ok.length + ' / 99'];
  lines.push('À refaire (' + redo.length + ')' + (redo.length ? ' :' : ''));
  for (const r of redo) {
    const note = saved[keyOf(r)].note;
    lines.push('- n° ' + r.n + ' ' + r.transliteration + (note ? ' : ' + note : ''));
  }
  if (notHeard.length) lines.push('Pas encore notés : n° ' + ranges(notHeard.map(r => r.n)));
  if (noAudio.length) lines.push('Sans audio : n° ' + ranges(noAudio.map(r => r.n)));
  lines.push('Empreintes : ' + withAudio.map(r => r.n + '=' + r.v).join(' '));
  const text = lines.join('\\n');
  const box = document.getElementById('resultText');
  box.value = text;
  document.getElementById('result').classList.add('show');
  const fallback = () => { box.focus(); box.select(); try { document.execCommand('copy'); } catch (e) {} };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(fallback); else fallback();
  box.scrollIntoView({ block: 'center' });
});

render();
updateCount();
</script>
</body>
</html>
`;

// Lancé directement : refait la page à partir des fichiers déjà découpés
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const workDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'audio-travail');
  console.log(`Page d'écoute : ${buildListeningPage(await loadNames(), workDir)}`);
}
