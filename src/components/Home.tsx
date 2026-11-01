import React from 'react';
import { List, Layers, BookOpen, Target, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { countByLevel, getDueIds, getNameOfTheDay, TOTAL_NAMES } from '../lib/learning';
import { ReviewMode, Tab } from '../types';

interface HomeProps {
  onNavigate: (tab: Tab) => void;
  onOpenName: (id: number) => void;
  onStartReview: (mode: ReviewMode) => void;
}

export default function Home({ onNavigate, onOpenName, onStartReview }: HomeProps) {
  const { t, language } = useLanguage();
  const { progress } = useProgress();

  const nameOfTheDay = getNameOfTheDay();
  const { mastered, learning, toDiscover } = countByLevel(progress);
  // Le dénominateur reste 99, quoi qu'il arrive
  const percentage = Math.round((mastered / TOTAL_NAMES) * 100);
  const dueCount = getDueIds(progress).length;

  const tiles: { tab: Tab; title: string; subtitle: string; Icon: typeof List; colors: string }[] = [
    { tab: 'list', title: t.nav.list, subtitle: t.home.tileList, Icon: List, colors: 'bg-soft text-soft-ink' },
    { tab: 'flashcards', title: t.nav.cards, subtitle: t.home.tileCards, Icon: Layers, colors: 'bg-accent-soft text-accent-ink' },
    { tab: 'qcm', title: t.nav.quiz, subtitle: t.home.tileQuiz, Icon: BookOpen, colors: 'bg-info-soft text-info-ink' },
    { tab: 'challenge', title: t.nav.challenge, subtitle: t.home.tileChallenge, Icon: Target, colors: 'bg-danger-soft text-danger-ink' },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.home.welcome}</h1>
        <p className="text-muted font-medium">{t.home.subtitle}</p>
      </div>

      {/* Nom du jour */}
      <section className="relative overflow-hidden rounded-3xl bg-hero p-5">
        <svg viewBox="0 0 24 24" className="absolute -right-10 -top-12 w-44 h-44 fill-hero-soft" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
          <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
        </svg>
        <p className="relative text-xs font-extrabold tracking-widest uppercase text-hero-muted">
          {t.home.nameOfTheDay} · #{nameOfTheDay.id}
        </p>
        <div className="relative flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p lang="ar" dir="rtl" className="arabic-text text-5xl font-bold text-on-hero text-left">
              {nameOfTheDay.arabic}
            </p>
            <p className="text-xl font-extrabold text-on-hero">{nameOfTheDay.transliteration}</p>
            <p className="text-sm font-medium text-hero-muted">{nameOfTheDay.meaning[language]}</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenName(nameOfTheDay.id)}
            className="shrink-0 flex items-center gap-1 h-11 px-4 rounded-full bg-on-hero text-hero text-sm font-extrabold"
          >
            {t.home.seeDetail}
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Progression + révision du jour */}
      <section className="rounded-3xl bg-surface border border-line p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
              <path
                className="text-track"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary transition-all duration-1000 ease-out"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-ink">
              {percentage}%
            </span>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-extrabold text-ink">{t.home.progress}</h2>
              <span className="text-sm font-semibold text-muted">{mastered} / {TOTAL_NAMES}</span>
            </div>
            <div className="flex h-2 gap-1" aria-hidden="true">
              {mastered > 0 && <div className="rounded-full bg-primary" style={{ flexGrow: mastered }} />}
              {learning > 0 && <div className="rounded-full bg-accent" style={{ flexGrow: learning }} />}
              {toDiscover > 0 && <div className="rounded-full bg-track" style={{ flexGrow: toDiscover }} />}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" />{mastered} {t.home.legendMastered}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" />{learning} {t.home.legendLearning}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-track" />{toDiscover} {t.home.legendNew}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-line">
          <div className="min-w-0">
            <p className="font-extrabold text-ink">{t.home.dailyReview}</p>
            <p className="text-sm font-medium text-muted">{dueCount > 0 ? t.home.dueNames(dueCount) : t.home.nothingDue}</p>
          </div>
          <button
            type="button"
            onClick={() => onStartReview(dueCount > 0 ? 'smart' : 'classic')}
            className="shrink-0 h-11 px-5 rounded-2xl bg-primary text-on-primary font-extrabold hover:bg-primary-hover transition-colors"
          >
            {dueCount > 0 ? t.home.review : t.home.practice}
          </button>
        </div>
      </section>

      {/* Raccourcis */}
      <div className="space-y-3">
        <h2 className="px-1 text-lg font-extrabold text-ink">{t.home.features}</h2>
        <div className="grid grid-cols-2 gap-3">
          {tiles.map(({ tab, title, subtitle, Icon, colors }) => (
            <button
              key={tab}
              type="button"
              onClick={() => onNavigate(tab)}
              className={`flex flex-col items-start gap-3 p-4 rounded-3xl text-left transition-transform active:scale-[0.98] ${colors}`}
            >
              <Icon size={24} />
              <span>
                <span className="block font-extrabold">{title}</span>
                <span className="block text-xs font-semibold">{subtitle}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
