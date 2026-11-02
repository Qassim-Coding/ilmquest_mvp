import { usePreferences } from '../context/PreferencesContext';
import { namesVocalized } from '../data/namesVocalized';
import { DivineName } from '../types';

/**
 * Voyelles et signes arabes : tanwin, fatha, damma, kasra, shadda, sukun (U+064B à U+0652)
 * et alif suscrit (U+0670). Les lettres elles-mêmes ne sont jamais touchées.
 */
const HARAKAT = /[ً-ْٰ]/g;

/** Retire les voyelles d'un texte arabe (ex. pour chercher « الرَّحِيمُ » comme « الرحيم »). */
export function stripHarakat(text: string): string {
  return text.replace(HARAKAT, '');
}

type ArabicSource = Pick<DivineName, 'id' | 'arabic'>;

/** Texte arabe à afficher pour un nom : vocalisé si demandé, sinon la forme de names.ts. */
export function arabicFor(name: ArabicSource, withVowels: boolean): string {
  return withVowels ? namesVocalized[name.id] ?? name.arabic : name.arabic;
}

/** Renvoie une fonction qui donne l'arabe d'un nom selon le réglage « Voyelles » de l'utilisateur. */
export function useArabic() {
  const { showVowels } = usePreferences();
  return (name: ArabicSource) => arabicFor(name, showVowels);
}
