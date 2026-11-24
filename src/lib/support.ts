/**
 * Encart « Soutenir l'app » : un lien vers la page Buy Me a Coffee de Qassim.
 * Il apparaît à 3 endroits : Paramètres, petite carte refermable de l'Accueil, écran de résultats d'un quiz.
 *
 * - Pour changer de lien : modifier SUPPORT_URL ci-dessous, c'est le seul endroit.
 * - Laisser SUPPORT_URL vide ('') masque l'encart partout.
 *
 * SITE WEB SEULEMENT (décidé le 24.11.2026) : l'encart n'apparaît que sur le site, ouvert dans un navigateur.
 * Dans les apps Android et iPhone, il est masqué : Apple exige l'achat intégré pour les pourboires au développeur
 * (des liens externes ont été refusés) et Google interdit d'envoyer vers un autre moyen de paiement.
 * Plus tard, les apps des stores auront leur propre « Soutenir » par achat intégré.
 */
import { Capacitor } from '@capacitor/core';

export const SUPPORT_URL = 'https://buymeacoffee.com/QassimCoding';

/** Vrai sur le site web quand un lien de soutien est renseigné ; toujours faux dans les apps Android et iPhone */
export function isSupportEnabled(): boolean {
  if (Capacitor.isNativePlatform()) return false;
  return SUPPORT_URL.trim() !== '';
}

// Date (en millisecondes) à laquelle l'utilisateur a fermé la carte de l'Accueil
const HOME_DISMISS_KEY = '99names_support_dismissed';
// Une fois fermée, la carte de l'Accueil reste cachée 30 jours
const HOME_HIDE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Vrai si la carte de l'Accueil peut s'afficher :
 * l'utilisateur a déjà pratiqué au moins une fois (xp > 0), pour ne pas demander de soutien dès la première ouverture,
 * et il ne l'a pas fermée depuis moins de 30 jours.
 */
export function canShowHomeSupport(xp: number, now: number = Date.now()): boolean {
  if (!isSupportEnabled() || xp <= 0) return false;
  try {
    const dismissedAt = Number(localStorage.getItem(HOME_DISMISS_KEY));
    return !dismissedAt || now - dismissedAt > HOME_HIDE_DAYS * DAY_MS;
  } catch {
    return true;
  }
}

/** Ferme la carte de l'Accueil pour 30 jours */
export function dismissHomeSupport(now: number = Date.now()): void {
  try {
    localStorage.setItem(HOME_DISMISS_KEY, String(now));
  } catch {
    // Stockage indisponible (navigation privée stricte) : la carte se refermera seulement jusqu'au rechargement
  }
}
