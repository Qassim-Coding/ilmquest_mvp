export interface DivineName {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: {
    fr: string;
    en: string;
  };
}

/** Suivi d'un nom pour la révision espacée. */
export interface NameStat {
  /** Boîte de révision : 0 = jamais vu, 1-2 = en cours, 3 = familier, 4 et plus = acquis */
  box: number;
  correct: number;
  wrong: number;
  /** Date de la dernière réponse (timestamp en ms) */
  lastSeen: number;
  /** Date à partir de laquelle le nom est à revoir (timestamp en ms) */
  nextReview: number;
  /** Dernières réponses, la plus récente à la fin (true = juste). 10 au maximum. */
  history: boolean[];
}

export interface ChallengeScore {
  date: number;
  score: number;
  total: number;
  /**
   * true pour le défi « Contre la montre », false pour le défi classique.
   * Absent dans les scores enregistrés avant la refonte.
   */
  timed?: boolean;
}

/**
 * Contenu de la clé localStorage `99names_progress`.
 * `masteredNames` et `challengeScores` existaient déjà : leur format ne change pas.
 * Les autres champs sont ajoutés par la refonte ; une ancienne sauvegarde qui ne les
 * contient pas reçoit des valeurs par défaut au chargement (voir ProgressContext).
 */
export interface UserProgress {
  masteredNames: number[]; // Array of IDs
  challengeScores: ChallengeScore[];
  nameStats: Record<number, NameStat>;
  favorites: number[];
  mistakes: number[];
  notes: Record<number, string>;
  xp: number;
  /** Jours où l'utilisateur a révisé, au format AAAA-MM-JJ (cumulés, pas forcément consécutifs) */
  studyDays: string[];
  /** Badges gagnés : un badge gagné n'est jamais retiré */
  earnedBadges: string[];
}

export type QuizMode = 'qcm' | 'flashcard' | 'challenge';
export type FlashcardSide = 'arabic' | 'transliteration' | 'meaning';

export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'mastered';

/** Modes de révision proposés dans l'onglet QCM */
export type ReviewMode = 'classic' | 'reverse' | 'smart' | 'mistakes' | 'favorites';

export type Tab = 'home' | 'list' | 'flashcards' | 'qcm' | 'challenge' | 'settings';

/** Réglages de départ transmis à l'onglet QCM (depuis l'Accueil ou une fiche) */
export interface QcmPreset {
  mode: ReviewMode;
  /** Liste de noms imposée (ex. « Réviser ce nom ») : le QCM démarre directement */
  fixedIds?: number[];
  /** Change à chaque demande pour relancer l'onglet même s'il est déjà ouvert */
  nonce: number;
}

export interface AnswerRecord {
  id: number;
  correct: boolean;
}
