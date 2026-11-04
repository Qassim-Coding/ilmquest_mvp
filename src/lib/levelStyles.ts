import { MasteryLevel, NameListId } from '../types';

/** Couleur de l'étiquette de maîtrise d'un nom (Liste, Cartes) */
export const LEVEL_PILL: Record<MasteryLevel, string> = {
  new: 'bg-track text-muted',
  learning: 'bg-accent-soft text-accent-ink',
  familiar: 'bg-accent-soft text-accent-ink',
  mastered: 'bg-soft text-soft-ink',
};

/** Couleur de la pastille de chaque liste de noms (Fiche, Liste) */
export const LIST_PILL: Record<NameListId, string> = {
  ilmquest: 'bg-soft text-soft-ink',
  tirmidhi: 'bg-info-soft text-info-ink',
};
