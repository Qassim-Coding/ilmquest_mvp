import React, { useState } from 'react';
import { Play, Trophy, Target, Timer } from 'lucide-react';
import QuizEngine from './QuizEngine';
import BadgeIcon, { badgeLabel } from './BadgeIcon';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { BADGES, getPool, pickQuestionIds, QUESTION_COUNTS, shuffle } from '../lib/learning';

type ChallengeType = 'classic' | 'timed';

interface Session {
  key: number;
  /** « practice » quand on révise ses erreurs après un défi : ce n'est pas compté comme un défi */
  kind: 'challenge' | 'practice';
  type: ChallengeType;
  ids: number[];
}

export default function Challenge() {
  const { progress, saveChallengeScore } = useProgress();
  const { t } = useLanguage();
  const [type, setType] = useState<ChallengeType>('classic');
  const [questionCount, setQuestionCount] = useState(10);
  const [session, setSession] = useState<Session | null>(null);

  const startChallenge = (challengeType: ChallengeType) => {
    const ids =
      challengeType === 'timed'
        ? shuffle(getPool('classic', progress))
        : pickQuestionIds('classic', questionCount, progress);
    setSession({ key: Date.now(), kind: 'challenge', type: challengeType, ids });
  };

  if (session) {
    const isChallenge = session.kind === 'challenge';
    return (
      <QuizEngine
        key={session.key}
        kind={session.kind}
        mode="classic"
        timed={isChallenge && session.type === 'timed'}
        questionIds={session.ids}
        onComplete={isChallenge ? (score, total) => saveChallengeScore(score, total, session.type === 'timed') : undefined}
        onStop={() => setSession(null)}
        onRestart={() => (isChallenge ? startChallenge(session.type) : setSession({ ...session, key: Date.now(), ids: shuffle(session.ids) }))}
        onReviewMistakes={(ids) => setSession({ key: Date.now(), kind: 'practice', type: 'classic', ids: shuffle(ids) })}
      />
    );
  }

  const classicScores = progress.challengeScores.filter(s => !s.timed && s.total > 0);
  // Math.min plafonne à 100 % les anciens scores gonflés déjà enregistrés chez les users
  const bestScore = classicScores.length > 0
    ? Math.max(...classicScores.map(s => Math.round((Math.min(s.score, s.total) / s.total) * 100)))
    : 0;
  const timedScores = progress.challengeScores.filter(s => s.timed);
  const record = timedScores.length > 0 ? Math.max(...timedScores.map(s => s.score)) : 0;
  const earnedCount = BADGES.filter(badge => progress.earnedBadges.includes(badge.id)).length;

  const stats = [
    { label: t.challenge.bestScore, value: `${bestScore} %`, Icon: Trophy, iconClass: 'text-accent' },
    { label: t.challenge.completed, value: String(progress.challengeScores.length), Icon: Target, iconClass: 'text-hero-muted' },
    { label: t.challenge.record, value: String(record), Icon: Timer, iconClass: 'text-hero-muted' },
  ];

  const segment = (active: boolean) =>
    `h-11 rounded-xl text-sm font-extrabold transition-colors ${active ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'}`;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.challenge.title}</h1>
        <p className="font-medium text-muted">{t.challenge.subtitle}</p>
      </div>

      <section className="relative overflow-hidden grid grid-cols-3 gap-2 p-4 rounded-3xl bg-hero">
        <svg viewBox="0 0 24 24" className="absolute -right-12 -bottom-14 w-40 h-40 fill-hero-soft" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
          <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
        </svg>
        {stats.map(({ label, value, Icon, iconClass }) => (
          <div key={label} className="relative flex flex-col items-center gap-1 text-center">
            <Icon size={22} className={iconClass} />
            <span className="text-xl font-extrabold text-on-hero">{value}</span>
            <span className="text-xs font-semibold text-hero-muted">{label}</span>
          </div>
        ))}
      </section>

      <div role="group" aria-label={t.challenge.typeLabel} className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-track">
        <button type="button" aria-pressed={type === 'classic'} onClick={() => setType('classic')} className={segment(type === 'classic')}>
          {t.challenge.classic}
        </button>
        <button type="button" aria-pressed={type === 'timed'} onClick={() => setType('timed')} className={segment(type === 'timed')}>
          {t.challenge.timed}
        </button>
      </div>

      <section className="rounded-3xl bg-surface border border-line p-4">
        {type === 'classic' ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-extrabold text-ink">{t.qcm.countTitle}</h2>
              <span className="text-xs font-bold text-muted">{t.qcm.random}</span>
            </div>
            <div role="group" aria-label={t.qcm.countTitle} className="grid grid-cols-5 gap-2">
              {QUESTION_COUNTS.map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  aria-pressed={questionCount === count}
                  className={`h-12 rounded-xl font-extrabold transition-colors ${
                    questionCount === count ? 'bg-primary text-on-primary' : 'bg-ground text-ink hover:bg-track'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-accent-soft text-accent-ink">
              <Timer size={24} />
            </span>
            <div>
              <h2 className="font-extrabold text-ink">{t.challenge.timedTitle}</h2>
              <p className="text-sm font-medium text-muted">{t.challenge.timedDesc}</p>
            </div>
          </div>
        )}
      </section>

      {/* Badges : un badge gagné reste acquis */}
      <section className="space-y-2">
        <div className="flex items-baseline justify-between gap-2 px-1">
          <h2 className="font-extrabold text-ink">{t.challenge.badges}</h2>
          <span className="text-sm font-bold text-muted">{t.challenge.badgesCount(earnedCount, BADGES.length)}</span>
        </div>
        <ul className="grid grid-cols-4 sm:grid-cols-6 gap-x-2 gap-y-3">
          {BADGES.map(badge => {
            const earned = progress.earnedBadges.includes(badge.id);
            return (
              <li key={badge.id} className="flex flex-col items-center gap-1 text-center">
                <BadgeIcon badge={badge} earned={earned} />
                <span className={`text-xs font-bold leading-tight ${earned ? 'text-ink' : 'text-muted'}`}>
                  {badgeLabel(badge, t)}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="px-1 text-xs font-semibold text-muted">{t.challenge.badgeNote}</p>
      </section>

      <button
        type="button"
        onClick={() => startChallenge(type)}
        className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-primary text-on-primary text-lg font-extrabold hover:bg-primary-hover transition-colors"
      >
        <Play fill="currentColor" size={20} />
        {type === 'timed' ? t.challenge.startTimed : t.challenge.startClassic}
      </button>
    </div>
  );
}
