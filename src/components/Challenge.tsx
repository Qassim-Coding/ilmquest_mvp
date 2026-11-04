import React, { Fragment, useState } from 'react';
import { Play, Trophy, Target, Timer } from 'lucide-react';
import QuizEngine from './QuizEngine';
import BadgeIcon, { badgeLabel } from './BadgeIcon';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BADGES,
  getPool,
  pickQuestionIds,
  QUESTION_COUNTS,
  shuffle,
  TIMED_BONUS,
  TIMED_LEVELS,
  timedRecord,
} from '../lib/learning';
import { useActiveNames } from '../lib/activeNames';
import { TimedLevel } from '../types';

type ChallengeType = 'classic' | 'timed';
/** Sens du « Contre la montre » : arabe → sens (habituel) ou sens → arabe (inverse) */
type Direction = 'classic' | 'reverse';

interface Session {
  key: number;
  /** « practice » quand on révise ses erreurs après un défi : ce n'est pas compté comme un défi */
  kind: 'challenge' | 'practice';
  type: ChallengeType;
  /** Difficulté choisie pour « Contre la montre » */
  level: TimedLevel;
  /** Sens du quiz : seul le « Contre la montre » peut être joué en sens inverse */
  direction: Direction;
  ids: number[];
}

// Les derniers choix du « Contre la montre » sont gardés sur le téléphone
const LEVEL_KEY = '99names_timed_level';
const DIRECTION_KEY = '99names_timed_direction';
const DIRECTIONS: Direction[] = ['classic', 'reverse'];

function loadLevel(): TimedLevel {
  try {
    const saved = localStorage.getItem(LEVEL_KEY);
    return saved === 'easy' || saved === 'medium' || saved === 'hard' ? saved : 'medium';
  } catch {
    return 'medium';
  }
}

function loadDirection(): Direction {
  try {
    return localStorage.getItem(DIRECTION_KEY) === 'reverse' ? 'reverse' : 'classic';
  } catch {
    return 'classic';
  }
}

function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Stockage indisponible : le choix vaut pour cette visite seulement
  }
}

export default function Challenge() {
  const { progress, saveChallengeScore } = useProgress();
  const { t } = useLanguage();
  // Les questions sont tirées dans la liste choisie dans Paramètres
  const { names } = useActiveNames();
  const [type, setType] = useState<ChallengeType>('classic');
  const [level, setLevel] = useState<TimedLevel>(loadLevel);
  const [direction, setDirection] = useState<Direction>(loadDirection);
  const [questionCount, setQuestionCount] = useState(10);
  const [session, setSession] = useState<Session | null>(null);

  const chooseLevel = (next: TimedLevel) => {
    setLevel(next);
    remember(LEVEL_KEY, next);
  };

  const chooseDirection = (next: Direction) => {
    setDirection(next);
    remember(DIRECTION_KEY, next);
  };

  const startChallenge = (challengeType: ChallengeType, challengeLevel: TimedLevel, challengeDirection: Direction) => {
    const ids =
      challengeType === 'timed'
        ? shuffle(getPool('classic', progress, names))
        : pickQuestionIds('classic', questionCount, progress, names);
    setSession({
      key: Date.now(),
      kind: 'challenge',
      type: challengeType,
      level: challengeLevel,
      // Le défi classique reste toujours arabe → sens
      direction: challengeType === 'timed' ? challengeDirection : 'classic',
      ids,
    });
  };

  if (session) {
    const isChallenge = session.kind === 'challenge';
    const isTimed = isChallenge && session.type === 'timed';
    const isReverse = session.direction === 'reverse';
    // Nouvelle clé = nouvelle partie : le Fragment remet le quiz à zéro
    return (
      <Fragment key={session.key}>
        <QuizEngine
          kind={session.kind}
          mode={isReverse ? 'reverse' : 'classic'}
          timed={isTimed}
          timedLevel={session.level}
          questionIds={session.ids}
          onComplete={
            isChallenge ? (score, total) => saveChallengeScore(score, total, isTimed, session.level, isReverse) : undefined
          }
          onStop={() => setSession(null)}
          onRestart={() =>
            isChallenge
              ? startChallenge(session.type, session.level, session.direction)
              : setSession({ ...session, key: Date.now(), ids: shuffle(session.ids) })
          }
          // Les erreurs se révisent dans le même sens que la partie
          onReviewMistakes={(ids) =>
            setSession({
              key: Date.now(),
              kind: 'practice',
              type: 'classic',
              level: session.level,
              direction: session.direction,
              ids: shuffle(ids),
            })
          }
        />
      </Fragment>
    );
  }

  const classicScores = progress.challengeScores.filter(s => !s.timed && s.total > 0);
  // Math.min plafonne à 100 % les anciens scores gonflés déjà enregistrés chez les users
  const bestScore = classicScores.length > 0
    ? Math.max(...classicScores.map(s => Math.round((Math.min(s.score, s.total) / s.total) * 100)))
    : 0;
  // Un record par difficulté et par sens : +6 s et +2 s, ou arabe → sens et sens → arabe, ne se comparent pas
  const isReverse = direction === 'reverse';
  const record = timedRecord(progress.challengeScores, level, isReverse);
  const earnedCount = BADGES.filter(badge => progress.earnedBadges.includes(badge.id)).length;

  const stats = [
    { label: t.challenge.bestScore, sub: null, value: `${bestScore} %`, Icon: Trophy, iconClass: 'text-accent' },
    { label: t.challenge.completed, sub: null, value: String(progress.challengeScores.length), Icon: Target, iconClass: 'text-hero-muted' },
    {
      label: t.challenge.record(t.challenge.levels[level]),
      sub: t.challenge.directions[direction].title,
      value: String(record),
      Icon: Timer,
      iconClass: 'text-hero-muted',
    },
  ];

  const segment = (active: boolean) =>
    `h-11 rounded-xl text-sm font-extrabold transition-colors ${active ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'}`;

  // Bouton de choix (sens ou difficulté) : un titre et une ligne d'explication
  const choice = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 h-16 px-2 rounded-xl text-center transition-colors ${
      active ? 'bg-primary text-on-primary' : 'bg-ground text-ink hover:bg-track'
    }`;
  // La couleur du sous-titre suit celle du fond (même transition), pour rester lisible pendant le changement
  const choiceSub = (active: boolean) => `text-xs font-bold transition-colors ${active ? 'text-on-primary' : 'text-muted'}`;

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
        {stats.map(({ label, sub, value, Icon, iconClass }) => (
          <div key={label} className="relative flex flex-col items-center gap-1 text-center">
            <Icon size={22} className={iconClass} />
            <span className="text-xl font-extrabold text-on-hero">{value}</span>
            <span className="text-xs font-semibold text-hero-muted">{label}</span>
            {sub && <span className="-mt-1 text-xs font-medium text-hero-muted">{sub}</span>}
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
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-accent-soft text-accent-ink">
                <Timer size={24} />
              </span>
              <div>
                <h2 className="font-extrabold text-ink">{t.challenge.timedTitle}</h2>
                <p className="text-sm font-medium text-muted">{t.challenge.timedDesc(TIMED_BONUS[level], isReverse)}</p>
              </div>
            </div>

            {/* Sens : arabe → sens, ou sens → arabe (on retrouve le nom à partir de la traduction) */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-ink">{t.challenge.directionTitle}</h3>
              <div role="radiogroup" aria-label={t.challenge.directionTitle} className="grid grid-cols-2 gap-2">
                {DIRECTIONS.map(id => {
                  const isActive = direction === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => chooseDirection(id)}
                      className={choice(isActive)}
                    >
                      <span className="font-extrabold">{t.challenge.directions[id].title}</span>
                      <span className={choiceSub(isActive)}>{t.challenge.directions[id].sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Facile +6 s, Moyen +4 s, Difficile +2 s par bonne réponse */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-ink">{t.challenge.levelTitle}</h3>
              <div role="radiogroup" aria-label={t.challenge.levelTitle} className="grid grid-cols-3 gap-2">
                {TIMED_LEVELS.map(id => {
                  const isActive = level === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => chooseLevel(id)}
                      className={choice(isActive)}
                    >
                      <span className="font-extrabold">{t.challenge.levels[id]}</span>
                      <span className={choiceSub(isActive)}>{t.challenge.bonus(TIMED_BONUS[id])}</span>
                    </button>
                  );
                })}
              </div>
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
        onClick={() => startChallenge(type, level, direction)}
        className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-primary text-on-primary text-lg font-extrabold hover:bg-primary-hover transition-colors"
      >
        <Play fill="currentColor" size={20} />
        {type === 'timed' ? t.challenge.startTimed : t.challenge.startClassic}
      </button>
    </div>
  );
}
