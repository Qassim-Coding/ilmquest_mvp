import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress } from '../types';

interface ProgressContextType {
  progress: UserProgress;
  markAsMastered: (id: number) => void;
  unmarkAsMastered: (id: number) => void;
  saveChallengeScore: (score: number, total: number) => void;
  resetProgress: () => void;
}

const defaultProgress: UserProgress = {
  masteredNames: [],
  challengeScores: []
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('99names_progress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('99names_progress', JSON.stringify(progress));
  }, [progress]);

  const markAsMastered = (id: number) => {
    setProgress(prev => ({
      ...prev,
      masteredNames: prev.masteredNames.includes(id) 
        ? prev.masteredNames 
        : [...prev.masteredNames, id]
    }));
  };

  const unmarkAsMastered = (id: number) => {
    setProgress(prev => ({
      ...prev,
      masteredNames: prev.masteredNames.filter(nameId => nameId !== id)
    }));
  };

  const saveChallengeScore = (score: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      challengeScores: [
        ...prev.challengeScores,
        { date: Date.now(), score, total }
      ]
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return (
    <ProgressContext.Provider value={{ progress, markAsMastered, unmarkAsMastered, saveChallengeScore, resetProgress }}>
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
