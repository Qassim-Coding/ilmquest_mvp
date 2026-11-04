import { DivineName } from '../types';
import { stripHarakat } from './arabic';

/**
 * Recherche tolérante de l'écran Liste.
 * Elle ne modifie aucune donnée : elle compare des versions simplifiées du texte tapé
 * et des champs de names.ts (translittération, signification, arabe).
 *
 * Exemples qui trouvent Ar-Rahîm : « Rahîm », « rahim », « Ar-Rahim », « ar rahim »,
 * « arrahim », « al rahim », « raheem », « الرحيم », « الرَّحِيمُ ».
 */

// Lettres arabes présentes dans le texte tapé
const ARABIC_LETTER = /[؀-ۿ]/;

// Article en début de recherche : « al », « el », « ar », « ach », « ash »… suivi d'un espace
const LEADING_ARTICLE = /^(al|el|ar|as|ach|ash|at|ath|ad|adh|az|azh|an)\s+/;

/**
 * Version simple d'un texte latin : minuscules, sans accents (î → i, é → e),
 * sans apostrophes ni signes du ‘ayn ou de la hamza, tirets et ponctuation remplacés par des espaces.
 */
function simplify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[‘’'`´ʿʾʼ"“”«»]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Version « à l'oreille », pour les orthographes courantes qui diffèrent de la translittération :
 * ee → i (Raheem), oo et ou → u (Ghafour), sh → ch (Shafi), lettres doublées réduites (Qahar),
 * espaces retirés (arrahim), e muet final retiré (Rahmane).
 */
function byEar(simplified: string): string {
  return simplified
    .replace(/ee/g, 'i')
    .replace(/oo|ou/g, 'u')
    .replace(/sh/g, 'ch')
    .replace(/ /g, '')
    .replace(/([a-z])\1+/g, '$1')
    .replace(/([^aeiouy])e$/, '$1');
}

// En dessous de 3 lettres, la comparaison « à l'oreille » trouverait presque tout (ex. « zzzz » → « z »)
const MIN_EAR_LENGTH = 3;

/** Arabe sans voyelles, avec les formes d'alif ramenées à ا, ى à ي et ة à ه */
function simplifyArabic(text: string): string {
  return stripHarakat(text)
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Vrai si un champ latin (translittération ou signification) contient la recherche */
function fieldMatches(field: string, variants: string[]): boolean {
  const simple = simplify(field);
  const compact = simple.replace(/ /g, '');
  const heard = byEar(simple);
  return variants.some(v => {
    if (simple.includes(v) || compact.includes(v.replace(/ /g, ''))) return true;
    const heardQuery = byEar(v);
    return heardQuery.length >= MIN_EAR_LENGTH && heard.includes(heardQuery);
  });
}

/**
 * Vrai si le nom correspond à la recherche.
 * Une recherche vide (ou faite uniquement de signes) garde tous les noms.
 */
export function matchesSearch(name: DivineName, rawQuery: string, language: 'fr' | 'en'): boolean {
  const query = rawQuery.trim();
  if (query === '') return true;

  // Recherche en arabe : sans voyelles ni hamza, sur le champ arabe uniquement
  if (ARABIC_LETTER.test(query)) {
    const arabicQuery = simplifyArabic(query);
    return arabicQuery === '' || simplifyArabic(name.arabic).includes(arabicQuery);
  }

  const simpleQuery = simplify(query);
  if (simpleQuery === '') return true;

  // On essaie aussi sans l'article tapé : « al rahim » trouve Ar-Rahîm
  const withoutArticle = simpleQuery.replace(LEADING_ARTICLE, '');
  const variants = withoutArticle !== '' && withoutArticle !== simpleQuery ? [simpleQuery, withoutArticle] : [simpleQuery];

  return fieldMatches(name.transliteration, variants) || fieldMatches(name.meaning[language], variants);
}
