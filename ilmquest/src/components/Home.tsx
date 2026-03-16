import React from 'react';
import { motion } from 'motion/react';
import { List, Layers, BookOpen, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';

interface HomeProps {
  onNavigate: (tab: 'list' | 'flashcards' | 'qcm' | 'challenge') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useLanguage();
  const { progress } = useProgress();

  const masteredCount = progress.masteredNames.length;
  const percentage = Math.round((masteredCount / 99) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100">{t.home.welcome}</h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">{t.home.subtitle}</p>
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm flex items-center gap-6 md:gap-8">
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-stone-100 dark:text-stone-800"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-primary transition-all duration-1000 ease-out"
              strokeDasharray={`${percentage}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-100">{percentage}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t.home.progress}</h2>
          <p className="text-stone-500 text-lg">{masteredCount} / 99 {t.home.mastered}</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 px-2">{t.home.features}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => onNavigate('list')} className="flex items-start gap-5 p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-left group">
            <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
              <List size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1">{t.nav.list}</h3>
              <p className="text-stone-500 text-sm">{t.home.goToList}</p>
            </div>
          </button>
          
          <button onClick={() => onNavigate('flashcards')} className="flex items-start gap-5 p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-left group">
            <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
              <Layers size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1">{t.nav.cards}</h3>
              <p className="text-stone-500 text-sm">{t.home.goToCards}</p>
            </div>
          </button>

          <button onClick={() => onNavigate('qcm')} className="flex items-start gap-5 p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-left group">
            <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
              <BookOpen size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1">{t.nav.quiz}</h3>
              <p className="text-stone-500 text-sm">{t.home.goToQuiz}</p>
            </div>
          </button>

          <button onClick={() => onNavigate('challenge')} className="flex items-start gap-5 p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-left group">
            <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
              <Target size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1">{t.nav.challenge}</h3>
              <p className="text-stone-500 text-sm">{t.home.goToChallenge}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
