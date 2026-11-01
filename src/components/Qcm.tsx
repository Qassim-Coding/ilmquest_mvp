import React, { useState } from 'react';
import { Play, BookOpen, ArrowLeftRight, Repeat, XCircle, Heart } from 'lucide-react';
import QuizEngine from './QuizEngine';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { getDueIds, getPool, pickQuestionIds, QUESTION_COUNTS, shuffle } from '../lib/learning';
import { QcmPreset, ReviewMode } from '../types';

interface QcmProps {
  /** Réglages de départ (depuis l'Accueil ou une fiche). Avec fixedIds, le QCM démarre directement. */
  preset?: QcmPreset | null;
}

interface Session {
  key: number;
  mode: ReviewMode;
  ids: number[];
  /** true : liste imposée (ex. « Réviser ce nom »), « Recommencer » reprend la même liste */
  fixed: boolean;
}

const MODE_ICONS: Record<ReviewMode, typeof BookOpen> = {
  classic: BookOpen,
  reverse: ArrowLeftRight,
  smart: Repeat,
  mistakes: XCircle,
  favorites: Heart,
};

const MODES: ReviewMode[] = ['classic', 'reverse', 'smart', 'mistakes', 'favorites'];

export default function Qcm({ preset = null }: QcmProps) {
  const { t } = useLanguage();
  const { progress } = useProgress();
  const [mode, setMode] = useState<ReviewMode>(preset?.mode ?? 'classic');
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<Session | null>(() =>
    preset?.fixedIds && preset.fixedIds.length > 0
      ? { key: Date.now(), mode: preset.mode, ids: preset.fixedIds, fixed: true }
      : null
  );

  const dueCount = getDueIds(progress).length;
  const poolSize = getPool(mode, progress).length;
  const questionCount = Math.min(count, poolSize);

  const startSession = (sessionMode: ReviewMode, ids: number[], fixed: boolean) => {
    if (ids.length === 0) return;
    setSession({ key: Date.now(), mode: sessionMode, ids, fixed });
  };

  if (session) {
    return (
      <QuizEngine
        key={session.key}
        kind="practice"
        mode={session.mode}
        questionIds={session.ids}
        onStop={() => setSession(null)}
        onRestart={() =>
          session.fixed
            ? startSession(session.mode, shuffle(session.ids), true)
            : startSession(session.mode, pickQuestionIds(session.mode, count, progress), false)
        }
        onReviewMistakes={(ids) => startSession('classic', shuffle(ids), true)}
      />
    );
  }

  const subtitleFor = (item: ReviewMode) => {
    switch (item) {
      case 'smart': return t.qcm.modeSub.smart(dueCount);
      case 'mistakes': return t.qcm.modeSub.mistakes(progress.mistakes.length);
      case 'favorites': return t.qcm.modeSub.favorites(progress.favorites.length);
      default: return t.qcm.modeSub[item];
    }
  };

  const helper =
    mode === 'smart' ? t.qcm.helper.smart
      : mode === 'mistakes' ? t.qcm.helper.mistakes(poolSize)
      : mode === 'favorites' ? t.qcm.helper.favorites(poolSize)
      : t.qcm.helper.all;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.qcm.title}</h1>
        <p className="font-medium text-muted">{t.qcm.subtitle}</p>
      </div>

      {/* Modes de révision */}
      <div role="radiogroup" aria-label={t.qcm.subtitle} className="space-y-2">
        {MODES.map(item => {
          const Icon = MODE_ICONS[item];
          const isActive = mode === item;
          return (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setMode(item)}
              className={`w-full flex items-center gap-3 min-h-[3.75rem] py-2 pl-2.5 pr-4 rounded-2xl border-2 text-left transition-colors ${
                isActive ? 'bg-soft/60 border-primary' : 'bg-surface border-line'
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-xl ${
                  isActive ? 'bg-primary text-on-primary' : 'bg-ground text-muted'
                }`}
              >
                <Icon size={20} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-extrabold text-ink">{t.qcm.modes[item].title}</span>
                  {item === 'smart' && (
                    <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent-ink text-xs font-extrabold">{t.qcm.recommended}</span>
                  )}
                  {(item === 'reverse' || item === 'mistakes' || item === 'favorites') && (
                    <span className="px-2 py-0.5 rounded-full bg-soft text-soft-ink text-xs font-extrabold">{t.qcm.isNew}</span>
                  )}
                </span>
                <span className="block text-sm font-medium text-muted">{subtitleFor(item)}</span>
              </span>
              <span
                className={`w-5 h-5 shrink-0 rounded-full ${isActive ? 'border-[6px] border-primary' : 'border-2 border-line'}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {/* Nombre de noms, toujours tirés au hasard */}
      <section className="rounded-3xl bg-surface border border-line p-4 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-extrabold text-ink">{t.qcm.countTitle}</h2>
          <span className="text-xs font-bold text-muted">{t.qcm.random}</span>
        </div>
        <div role="group" aria-label={t.qcm.countTitle} className="grid grid-cols-5 gap-2">
          {QUESTION_COUNTS.map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setCount(value)}
              aria-pressed={count === value}
              className={`h-12 rounded-xl font-extrabold transition-colors ${
                count === value ? 'bg-primary text-on-primary' : 'bg-ground text-ink hover:bg-track'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-muted">{poolSize > 0 ? helper : t.qcm.emptyPool}</p>
      </section>

      <button
        type="button"
        onClick={() => startSession(mode, pickQuestionIds(mode, count, progress), false)}
        disabled={poolSize === 0}
        className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-primary text-on-primary text-lg font-extrabold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Play fill="currentColor" size={20} />
        {t.qcm.startCount(questionCount)}
      </button>
    </div>
  );
}
