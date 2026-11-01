import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { BADGES, getNameById, OBJECTIVES } from '../lib/learning';
import { AnswerRecord } from '../types';
import BadgeIcon, { badgeLabel } from './BadgeIcon';

interface QuizResultsProps {
  label: string;
  timed: boolean;
  answers: AnswerRecord[];
  total: number;
  xpGained: number;
  /** Nombre de noms acquis avant le QCM */
  masteredBefore: number;
  /** Badges gagnés avant le QCM */
  badgesBefore: string[];
  onRestart: () => void;
  onReviewMistakes: (ids: number[]) => void;
  onBack: () => void;
}

const RING_CIRCUMFERENCE = 2 * Math.PI * 44;
const MAX_REVIEW_ROWS = 5;

export default function QuizResults({
  label,
  timed,
  answers,
  total,
  xpGained,
  masteredBefore,
  badgesBefore,
  onRestart,
  onReviewMistakes,
  onBack,
}: QuizResultsProps) {
  const { language, t } = useLanguage();
  const { progress } = useProgress();

  const score = answers.filter(answer => answer.correct).length;
  const ratio = total > 0 ? score / total : 0;
  const accuracy = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0;
  const masteredAfter = progress.masteredNames.length;
  const newlyMastered = Math.max(0, masteredAfter - masteredBefore);
  const wrongIds = Array.from(new Set(answers.filter(answer => !answer.correct).map(answer => answer.id)));
  const newBadges = BADGES.filter(badge => progress.earnedBadges.includes(badge.id) && !badgesBefore.includes(badge.id));
  const heading = ratio >= 0.8 ? t.results.excellent : ratio >= 0.5 ? t.results.good : t.results.keepGoing;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Score */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 104 104" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="52" cy="52" r="44" strokeWidth="10" className="fill-surface stroke-track" />
            <circle
              cx="52"
              cy="52"
              r="44"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${ratio * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
              className="fill-none stroke-primary"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-ink">
            {score}
            <span className="text-base text-muted">/{total}</span>
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">{heading}</h1>
          <p className="text-sm font-semibold text-muted">
            {timed ? t.results.timedSummary(score) : t.results.summary(label, total)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center py-3 rounded-2xl bg-accent-soft text-accent-ink">
          <span className="text-xl font-extrabold">+{xpGained}</span>
          <span className="text-xs font-bold">{t.results.xp}</span>
        </div>
        <div className="flex flex-col items-center py-3 rounded-2xl bg-soft text-soft-ink">
          <span className="text-xl font-extrabold">{accuracy} %</span>
          <span className="text-xs font-bold">{t.results.accuracy}</span>
        </div>
        <div className="flex flex-col items-center py-3 rounded-2xl bg-info-soft text-info-ink">
          <span className="text-xl font-extrabold">+{newlyMastered}</span>
          <span className="text-xs font-bold">{t.results.newMastered}</span>
        </div>
      </div>

      {/* Objectifs : cochés quand ils sont atteints */}
      <section className="rounded-3xl bg-surface border border-line p-4 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-extrabold text-ink">{t.results.objectives}</h2>
          <span className="text-sm font-semibold text-muted">{t.results.masteredCount(masteredAfter)}</span>
        </div>
        {OBJECTIVES.map(objective => {
          const reached = masteredAfter >= objective.target;
          const justReached = reached && masteredBefore < objective.target;
          return (
            <div key={objective.target} className="flex items-center gap-3">
              {reached ? (
                <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-primary text-on-primary">
                  <Check size={16} />
                </span>
              ) : (
                <span className="w-7 h-7 shrink-0 rounded-full border-2 border-line" aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2 text-sm font-bold text-ink">
                  <span>{t.results.objective(objective.percent)}</span>
                  {justReached ? (
                    <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent-ink text-xs font-extrabold">
                      {t.results.reached}
                    </span>
                  ) : (
                    !reached && <span className="text-xs text-muted">{masteredAfter} / {objective.target}</span>
                  )}
                </div>
                {!reached && (
                  <div className="h-1.5 rounded-full bg-track overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((masteredAfter / objective.target) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {newBadges.length > 0 && (
        <section className="rounded-3xl bg-accent-soft p-4 space-y-3">
          <h2 className="font-extrabold text-accent-ink">{t.results.newBadges}</h2>
          <div className="flex flex-wrap gap-4">
            {newBadges.map(badge => (
              <div key={badge.id} className="flex items-center gap-2">
                <BadgeIcon badge={badge} earned className="w-10 h-10" />
                <span className="text-sm font-bold text-accent-ink">{badgeLabel(badge, t)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {wrongIds.length > 0 && (
        <section className="space-y-2">
          <h2 className="px-1 font-extrabold text-ink">{t.results.toReview(wrongIds.length)}</h2>
          {wrongIds.slice(0, MAX_REVIEW_ROWS).map(id => {
            const name = getNameById(id);
            if (!name) return null;
            return (
              <div key={id} className="flex items-center gap-3 py-1.5 pl-2.5 pr-4 rounded-2xl bg-surface border border-line">
                <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-danger-soft text-danger-ink text-xs font-extrabold">
                  #{name.id}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-extrabold text-ink">{name.transliteration}</span>
                  <span className="block text-sm font-medium text-muted">{name.meaning[language]}</span>
                </span>
                <span lang="ar" dir="rtl" className="arabic-text text-2xl font-bold text-arabic">{name.arabic}</span>
              </div>
            );
          })}
          {wrongIds.length > MAX_REVIEW_ROWS && (
            <p className="px-1 text-sm font-semibold text-muted">+{wrongIds.length - MAX_REVIEW_ROWS}</p>
          )}
        </section>
      )}

      <div className="space-y-2 pt-1">
        {wrongIds.length > 0 && (
          <button
            type="button"
            onClick={() => onReviewMistakes(wrongIds)}
            className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-on-primary font-extrabold hover:bg-primary-hover transition-colors"
          >
            <RotateCcw size={18} />
            {t.results.reviewMistakes}
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className={`w-full flex items-center justify-center gap-2 h-14 rounded-2xl font-extrabold transition-colors ${
            wrongIds.length > 0 ? 'bg-surface border-2 border-line text-ink' : 'bg-primary text-on-primary hover:bg-primary-hover'
          }`}
        >
          {t.qcm.restart}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full h-12 rounded-2xl font-extrabold text-soft-ink hover:bg-track"
        >
          {t.results.back}
        </button>
      </div>
    </div>
  );
}
