import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, Target, Award } from 'lucide-react';
import QuizEngine from './QuizEngine';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';

export default function Challenge() {
  const { progress, saveChallengeScore } = useProgress();
  const { t } = useLanguage();
  const [isStarted, setIsStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  const handleComplete = (score: number, total: number) => {
    saveChallengeScore(score, total);
  };

  if (isStarted) {
    return <QuizEngine mode="challenge" count={questionCount} onComplete={handleComplete} onStop={() => setIsStarted(false)} />;
  }

  const bestScore = progress.challengeScores.length > 0 
    ? Math.max(...progress.challengeScores.map(s => Math.round((s.score / s.total) * 100))) 
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100">{t.challenge.title}</h1>
        <p className="text-stone-500 text-lg">{t.challenge.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm text-center space-y-2">
          <Trophy className="mx-auto text-amber-500 mb-4" size={32} />
          <p className="text-stone-500 text-sm font-medium">{t.challenge.bestScore}</p>
          <p className="text-3xl font-bold text-stone-800 dark:text-stone-100">{bestScore}%</p>
        </div>
        <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm text-center space-y-2">
          <Target className="mx-auto text-primary mb-4" size={32} />
          <p className="text-stone-500 text-sm font-medium">{t.challenge.completed}</p>
          <p className="text-3xl font-bold text-stone-800 dark:text-stone-100">{progress.challengeScores.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-100 dark:border-stone-800 shadow-sm space-y-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t.challenge.chooseCount}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[10, 20, 30, 50, 99].map(count => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`p-4 rounded-2xl font-bold transition-all ${
                  questionCount === count
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsStarted(true)}
          className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all flex items-center justify-center gap-3"
        >
          <Play fill="currentColor" size={24} />
          <span>{t.challenge.start}</span>
        </button>
      </div>
    </div>
  );
}
