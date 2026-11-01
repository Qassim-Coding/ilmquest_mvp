import { MasteryLevel } from '../types';

/** Couleur de l'étiquette de maîtrise d'un nom (Liste, Cartes) */
export const LEVEL_PILL: Record<MasteryLevel, string> = {
  new: 'bg-track text-muted',
  learning: 'bg-accent-soft text-accent-ink',
  familiar: 'bg-accent-soft text-accent-ink',
  mastered: 'bg-soft text-soft-ink',
};
