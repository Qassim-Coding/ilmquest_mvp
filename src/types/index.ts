export interface DivineName {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: {
    fr: string;
    en: string;
  };
}

export interface UserProgress {
  masteredNames: number[]; // Array of IDs
  challengeScores: {
    date: number;
    score: number;
    total: number;
  }[];
}

export type QuizMode = 'qcm' | 'flashcard' | 'challenge';
export type FlashcardSide = 'arabic' | 'transliteration' | 'meaning';
