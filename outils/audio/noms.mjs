/**
 * Les 99 Noms dans l'ordre de la liste de Tirmidhî, lus directement dans les fichiers de l'app
 * (src/data/names.ts, nameLists.ts, namesVocalized.ts) : les outils audio utilisent toujours
 * exactement les mêmes Noms, la même écriture arabe et les mêmes sens que l'app.
 *
 * Utilisé par decouper.mjs et integrer.mjs. esbuild (installé avec Vite) lit les fichiers TypeScript.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Dossier racine du projet (deux niveaux au-dessus de outils/audio) */
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Nombre de Noms par bloc d'enregistrement (feuille d'enregistrement : 9 blocs de 11) */
export const NAMES_PER_BLOCK = 11;

async function loadEsbuild() {
  try {
    return await import('esbuild');
  } catch {
    // Hors du projet (ex. chez Claude) : chemin donné par ESBUILD_PATH
    if (process.env.ESBUILD_PATH) return import(process.env.ESBUILD_PATH);
    throw new Error("esbuild introuvable : lancez d'abord « npm install » à la racine du projet.");
  }
}

/**
 * @returns {Promise<{ n: number, id: number, arabic: string, transliteration: string, fr: string }[]>}
 *   n = numéro dans la liste de Tirmidhî (1 à 99), id = id du Nom dans names.ts
 */
export async function loadNames() {
  const esbuild = await loadEsbuild();
  const build = esbuild.build ?? esbuild.default?.build;
  const result = await build({
    stdin: {
      contents: [
        "export { namesOfAllah } from './src/data/names.ts';",
        "export { TIRMIDHI_ORDER } from './src/data/nameLists.ts';",
        "export { namesVocalized } from './src/data/namesVocalized.ts';",
      ].join('\n'),
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  const { namesOfAllah, TIRMIDHI_ORDER, namesVocalized } = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  );
  const byId = new Map(namesOfAllah.map(name => [name.id, name]));
  return TIRMIDHI_ORDER.map((id, index) => {
    const name = byId.get(id);
    if (!name) throw new Error(`Nom introuvable dans names.ts : id ${id}`);
    return {
      n: index + 1,
      id,
      arabic: namesVocalized[id] ?? name.arabic,
      transliteration: name.transliteration,
      fr: name.meaning.fr,
    };
  });
}

/** « 12,45, 3-5 » → [3, 4, 5, 12, 45] (numéros de la liste de Tirmidhî) */
export function parseNumbers(text) {
  const numbers = new Set();
  for (const part of String(text).split(',').map(s => s.trim()).filter(Boolean)) {
    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      for (let n = Number(range[1]); n <= Number(range[2]); n++) numbers.add(n);
    } else if (/^\d+$/.test(part)) {
      numbers.add(Number(part));
    } else {
      throw new Error(`Numéro illisible : « ${part} »`);
    }
  }
  for (const n of numbers) if (n < 1 || n > 99) throw new Error(`Numéro hors de la liste (1 à 99) : ${n}`);
  return [...numbers].sort((a, b) => a - b);
}

/** 7 → « 07 » : nom des fichiers découpés (audio-travail/clips/07.mp3) */
export const pad = n => String(n).padStart(2, '0');

/** [1, 2, 3, 5, 7, 8] → « 1 à 3, 5, 7, 8 » */
export function formatNumbers(numbers) {
  const parts = [];
  const sorted = [...numbers].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(j - i >= 2 ? `${sorted[i]} à ${sorted[j]}` : sorted.slice(i, j + 1).join(', '));
    i = j;
  }
  return parts.join(', ');
}
