// Logique d'apprentissage partagée par les écrans :
// révision espacée, niveaux de maîtrise, choix des questions, badges et objectifs.
// Aucune donnée n'est modifiée ici : ce ne sont que des fonctions de calcul.
import { namesOfAllah } from '../data/names';
import { DivineName, MasteryLevel, NameStat, ReviewMode, UserProgress } from '../types';
import { Language } from '../i18n/translations';

export const TOTAL_NAMES = 99;

/** À partir de cette boîte, un nom compte comme « acquis » */
export const MASTERED_BOX = 4;
const MAX_BOX = 6;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Délai avant la prochaine révision, en jours, selon la boîte (index = boîte) */
const INTERVAL_DAYS = [0, 1, 2, 4, 7, 15, 30];

export const XP_PER_CORRECT = 10;
export const XP_PER_CARD = 5;
export const QUESTION_COUNTS = [10, 20, 30, 50, 99];

/** Mélange une copie du tableau (Fisher-Yates) */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Date du jour au format AAAA-MM-JJ, en heure locale */
export function dayKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getNameById(id: number): DivineName | undefined {
  return namesOfAllah.find(name => name.id === id);
}

/** Nom du jour : change chaque jour, identique pour tous les utilisateurs */
export function getNameOfTheDay(date: Date = new Date()): DivineName {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNumber = Math.floor((localMidnight.getTime() - localMidnight.getTimezoneOffset() * 60000) / DAY_MS);
  return namesOfAllah[dayNumber % namesOfAllah.length];
}

export function emptyStat(): NameStat {
  return { box: 0, correct: 0, wrong: 0, lastSeen: 0, nextReview: 0, history: [] };
}

/**
 * Met à jour le suivi d'un nom après une réponse (juste : la boîte monte, faux : elle descend).
 * Un nom acquis ne perd pas ce statut sur une seule erreur : il redescend à la limite « acquis »
 * et revient en révision. Il faut deux erreurs de suite pour qu'il repasse « en cours ».
 */
export function applyAnswer(stat: NameStat | undefined, correct: boolean, now: number = Date.now()): NameStat {
  const previous = stat ?? emptyStat();
  const lastAnswerWasCorrect = previous.history.length === 0 || previous.history[previous.history.length - 1];
  let box: number;
  if (correct) box = Math.min(previous.box + 1, MAX_BOX);
  else if (previous.box >= MASTERED_BOX && lastAnswerWasCorrect) box = MASTERED_BOX;
  else box = Math.max(1, previous.box - 2);
  return {
    box,
    correct: previous.correct + (correct ? 1 : 0),
    wrong: previous.wrong + (correct ? 0 : 1),
    lastSeen: now,
    // Une erreur rend le nom à revoir tout de suite ; une bonne réponse l'espace dans le temps
    nextReview: correct ? now + INTERVAL_DAYS[box] * DAY_MS : now,
    history: [...previous.history, correct].slice(-10),
  };
}

export function getLevel(progress: UserProgress, id: number): MasteryLevel {
  if (progress.masteredNames.includes(id)) return 'mastered';
  const stat = progress.nameStats[id];
  if (!stat || stat.box <= 0) return 'new';
  if (stat.box >= MASTERED_BOX) return 'mastered';
  if (stat.box === 3) return 'familiar';
  return 'learning';
}

export const LEVEL_ORDER: MasteryLevel[] = ['new', 'learning', 'familiar', 'mastered'];

/** Répartition des 99 noms : acquis, en cours (en cours + familier), à découvrir */
export function countByLevel(progress: UserProgress) {
  let mastered = 0;
  let learning = 0;
  for (const name of namesOfAllah) {
    const level = getLevel(progress, name.id);
    if (level === 'mastered') mastered++;
    else if (level !== 'new') learning++;
  }
  return { mastered, learning, toDiscover: TOTAL_NAMES - mastered - learning };
}

/** Noms dont la date de révision est passée, les plus urgents d'abord */
export function getDueIds(progress: UserProgress, now: number = Date.now()): number[] {
  return Object.entries(progress.nameStats)
    .filter(([, stat]) => stat.box > 0 && stat.nextReview <= now)
    .sort((a, b) => a[1].nextReview - b[1].nextReview)
    .map(([id]) => Number(id))
    .filter(id => getNameById(id) !== undefined);
}

/** Nombre de jours avant la prochaine révision (0 = aujourd'hui), ou null si jamais révisé */
export function daysUntilReview(stat: NameStat | undefined, now: number = Date.now()): number | null {
  if (!stat || stat.box <= 0) return null;
  return Math.max(0, Math.ceil((stat.nextReview - now) / DAY_MS));
}

/** Noms disponibles pour un mode de révision (pour afficher combien il y en a) */
export function getPool(mode: ReviewMode, progress: UserProgress): number[] {
  const exists = (id: number) => getNameById(id) !== undefined;
  if (mode === 'mistakes') return progress.mistakes.filter(exists);
  if (mode === 'favorites') return progress.favorites.filter(exists);
  return namesOfAllah.map(name => name.id);
}

/** Choisit les noms d'un QCM : toujours au hasard, avec les noms à revoir en premier en révision intelligente */
export function pickQuestionIds(mode: ReviewMode, count: number, progress: UserProgress): number[] {
  if (mode === 'smart') {
    const due = getDueIds(progress);
    const dueSet = new Set(due);
    const others = shuffle(namesOfAllah.map(name => name.id).filter(id => !dueSet.has(id)));
    return shuffle([...due, ...others].slice(0, count));
  }
  return shuffle(getPool(mode, progress)).slice(0, count);
}

export interface QuizOption {
  id: number;
  label: string;
  arabic?: string;
}

/**
 * Propose 4 réponses. Les sens identiques (ex. « L’Unique » pour 97 et 98) ne sont jamais
 * proposés deux fois, et jamais comme mauvaise réponse face au même sens.
 * reverse = true : la question donne le sens, les réponses sont des noms.
 */
export function buildOptions(question: DivineName, reverse: boolean, language: Language): QuizOption[] {
  const normalize = (text: string) => text.trim().toLowerCase();
  const usedMeanings = new Set([normalize(question.meaning[language])]);
  const wrongNames: DivineName[] = [];
  for (const name of shuffle(namesOfAllah)) {
    if (name.id === question.id) continue;
    const meaning = normalize(name.meaning[language]);
    if (usedMeanings.has(meaning)) continue;
    usedMeanings.add(meaning);
    wrongNames.push(name);
    if (wrongNames.length === 3) break;
  }
  return shuffle([question, ...wrongNames]).map(name =>
    reverse
      ? { id: name.id, label: name.transliteration, arabic: name.arabic }
      : { id: name.id, label: name.meaning[language] }
  );
}

// ---------------------------------------------------------------------------
// Badges : calculés à partir de la progression, puis conservés pour toujours
// ---------------------------------------------------------------------------

export type BadgeKind = 'names' | 'first-challenge' | 'perfect' | 'study-days';

export interface BadgeDef {
  id: string;
  kind: BadgeKind;
  value: number;
}

export const NAME_BADGE_TIERS = [10, 20, 30, 40, 50, 60, 70, 80, 99];
export const STUDY_DAYS_BADGE = 30;

export const BADGES: BadgeDef[] = [
  ...NAME_BADGE_TIERS.map(value => ({ id: `names-${value}`, kind: 'names' as BadgeKind, value })),
  { id: 'first-challenge', kind: 'first-challenge', value: 1 },
  { id: 'perfect', kind: 'perfect', value: 100 },
  { id: `study-${STUDY_DAYS_BADGE}`, kind: 'study-days', value: STUDY_DAYS_BADGE },
];

/** Badges mérités avec la progression actuelle (sans tenir compte de ceux déjà gagnés) */
export function computeEarnedBadges(progress: UserProgress): string[] {
  const mastered = progress.masteredNames.length;
  return BADGES.filter(badge => {
    switch (badge.kind) {
      case 'names':
        return mastered >= badge.value;
      case 'first-challenge':
        return progress.challengeScores.length > 0;
      case 'perfect':
        // Nouveaux scores (timed: false) : sans faute = score égal au total.
        // Anciens scores (sans timed) : la dernière bonne réponse comptait double,
        // donc un vrai sans-faute a été enregistré avec un score supérieur au total.
        return progress.challengeScores.some(s =>
          s.total > 0 && (s.timed === false ? s.score === s.total : s.timed === undefined && s.score > s.total)
        );
      case 'study-days':
        // Jours cumulés, pas consécutifs : une pause ne fait rien perdre
        return progress.studyDays.length >= badge.value;
      default:
        return false;
    }
  }).map(badge => badge.id);
}

/** Objectifs affichés en fin de QCM : nombre de noms acquis à atteindre */
export const OBJECTIVES = [
  { percent: 25, target: 25 },
  { percent: 50, target: 50 },
  { percent: 80, target: 80 },
  { percent: 100, target: 99 },
];
