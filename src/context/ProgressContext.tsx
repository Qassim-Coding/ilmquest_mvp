import React, { createContext, useContext, useState, useEffect } from 'react';
import { NameStat, UserProgress } from '../types';
import { applyAnswer, computeEarnedBadges, dayKey, MASTERED_BOX } from '../lib/learning';

interface ProgressContextType {
  progress: UserProgress;
  markAsMastered: (id: number) => void;
  unmarkAsMastered: (id: number) => void;
  saveChallengeScore: (score: number, total: number, timed?: boolean) => void;
  resetProgress: () => void;
  /** Enregistre une réponse (QCM, Défi, Cartes) : maîtrise, erreurs, XP et jour d'étude */
  recordAnswer: (id: number, correct: boolean, xp?: number) => void;
  toggleFavorite: (id: number) => void;
  setNote: (id: number, text: string) => void;
}

// Même clé qu'avant : les progressions existantes sont conservées
const STORAGE_KEY = '99names_progress';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const defaultProgress: UserProgress = {
  masteredNames: [],
  challengeScores: [],
  nameStats: {},
  favorites: [],
  mistakes: [],
  notes: {},
  xp: 0,
  studyDays: [],
  earnedBadges: [],
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

function idList(value: unknown): number[] {
  return Array.isArray(value) ? value.filter((item): item is number => typeof item === 'number') : [];
}

/**
 * Complète une sauvegarde (ancienne ou nouvelle) avec les champs ajoutés par la refonte.
 * `masteredNames` et `challengeScores` sont repris tels quels.
 */
function normalizeProgress(raw: unknown): UserProgress {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Partial<UserProgress>;
  const masteredNames = idList(data.masteredNames);
  const nameStats: Record<number, NameStat> =
    data.nameStats && typeof data.nameStats === 'object' ? { ...data.nameStats } : {};

  // Un nom marqué « acquis » dans l'ancienne version entre directement dans la boîte « acquis »
  const now = Date.now();
  for (const id of masteredNames) {
    if (!nameStats[id]) {
      nameStats[id] = { box: MASTERED_BOX, correct: 0, wrong: 0, lastSeen: now, nextReview: now + WEEK_MS, history: [] };
    }
  }

  return {
    masteredNames,
    challengeScores: Array.isArray(data.challengeScores) ? data.challengeScores : [],
    nameStats,
    favorites: idList(data.favorites),
    mistakes: idList(data.mistakes),
    notes: data.notes && typeof data.notes === 'object' ? { ...data.notes } : {},
    xp: typeof data.xp === 'number' ? data.xp : 0,
    studyDays: Array.isArray(data.studyDays) ? data.studyDays.filter((d): d is string => typeof d === 'string') : [],
    earnedBadges: Array.isArray(data.earnedBadges) ? data.earnedBadges.filter((b): b is string => typeof b === 'string') : [],
  };
}

/** Ajoute les badges nouvellement mérités. Un badge déjà gagné n'est jamais retiré. */
function withBadges(progress: UserProgress): UserProgress {
  const earned = computeEarnedBadges(progress).filter(id => !progress.earnedBadges.includes(id));
  return earned.length === 0 ? progress : { ...progress, earnedBadges: [...progress.earnedBadges, ...earned] };
}

function addId(list: number[], id: number): number[] {
  return list.includes(id) ? list : [...list, id];
}

function removeId(list: number[], id: number): number[] {
  return list.filter(item => item !== id);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return withBadges(normalizeProgress(saved ? JSON.parse(saved) : null));
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const update = (change: (previous: UserProgress) => UserProgress) => {
    setProgress(previous => withBadges(change(previous)));
  };

  const markAsMastered = (id: number) => {
    update(prev => {
      const stat = prev.nameStats[id];
      const now = Date.now();
      return {
        ...prev,
        masteredNames: addId(prev.masteredNames, id),
        nameStats: {
          ...prev.nameStats,
          [id]: stat
            ? { ...stat, box: Math.max(stat.box, MASTERED_BOX) }
            : { box: MASTERED_BOX, correct: 0, wrong: 0, lastSeen: now, nextReview: now + WEEK_MS, history: [] },
        },
      };
    });
  };

  const unmarkAsMastered = (id: number) => {
    update(prev => {
      const stat = prev.nameStats[id];
      return {
        ...prev,
        masteredNames: removeId(prev.masteredNames, id),
        nameStats: stat ? { ...prev.nameStats, [id]: { ...stat, box: Math.min(stat.box, MASTERED_BOX - 2) } } : prev.nameStats,
      };
    });
  };

  const recordAnswer = (id: number, correct: boolean, xp: number = 0) => {
    update(prev => {
      const stat = applyAnswer(prev.nameStats[id], correct);
      const isMastered = stat.box >= MASTERED_BOX;
      const today = dayKey();
      return {
        ...prev,
        nameStats: { ...prev.nameStats, [id]: stat },
        masteredNames: isMastered ? addId(prev.masteredNames, id) : removeId(prev.masteredNames, id),
        mistakes: correct ? removeId(prev.mistakes, id) : addId(prev.mistakes, id),
        studyDays: prev.studyDays.includes(today) ? prev.studyDays : [...prev.studyDays, today],
        xp: prev.xp + (correct ? xp : 0),
      };
    });
  };

  const saveChallengeScore = (score: number, total: number, timed: boolean = false) => {
    update(prev => ({
      ...prev,
      // timed est toujours écrit (true ou false) : il distingue aussi les scores corrigés des anciens
      challengeScores: [...prev.challengeScores, { date: Date.now(), score, total, timed }],
    }));
  };

  const toggleFavorite = (id: number) => {
    update(prev => ({
      ...prev,
      favorites: prev.favorites.includes(id) ? removeId(prev.favorites, id) : [...prev.favorites, id],
    }));
  };

  const setNote = (id: number, text: string) => {
    update(prev => {
      const notes = { ...prev.notes };
      if (text.trim() === '') delete notes[id];
      else notes[id] = text;
      return { ...prev, notes };
    });
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return (
    <ProgressContext.Provider
      value={{ progress, markAsMastered, unmarkAsMastered, saveChallengeScore, resetProgress, recordAnswer, toggleFavorite, setNote }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
