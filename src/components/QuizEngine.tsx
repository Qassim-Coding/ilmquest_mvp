import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, ArrowRight, RotateCcw, Zap, Timer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { buildOptions, getNameById, QuizOption, XP_PER_CORRECT } from '../lib/learning';
import { AnswerRecord, DivineName, ReviewMode } from '../types';
import QuizResults from './QuizResults';

const TIMED_SECONDS = 60;
const TIMED_BONUS_SECONDS = 2;
const LETTERS = ['A', 'B', 'C', 'D'];

interface QuizEngineProps {
  kind: 'practice' | 'challenge';
  mode: ReviewMode;
  /** Noms à interroger, dans l'ordre (déjà tirés au hasard par l'écran appelant) */
  questionIds: number[];
  /** Défi « Contre la montre » : 60 s, +2 s par bonne réponse */
  timed?: boolean;
  onComplete?: (score: number, total: number) => void;
  onStop: () => void;
  onRestart: () => void;
  onReviewMistakes: (ids: number[]) => void;
}

export default function QuizEngine({
  kind,
  mode,
  questionIds,
  timed = false,
  onComplete,
  onStop,
  onRestart,
  onReviewMistakes,
}: QuizEngineProps) {
  const { language, t } = useLanguage();
  const { progress, recordAnswer } = useProgress();
  const questions = useMemo(
    () => questionIds.map(id => getNameById(id)).filter((name): name is DivineName => name !== undefined),
    [questionIds]
  );
  const reverse = mode === 'reverse';

  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [combo, setCombo] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const [isFinished, setIsFinished] = useState(false);
  // État de départ, pour comparer en fin de QCM (noms acquis, badges)
  const [start] = useState(() => ({ mastered: progress.masteredNames.length, badges: progress.earnedBadges }));
  const reported = useRef(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const current = questions[index];
  const score = answers.filter(answer => answer.correct).length;
  const total = timed ? answers.length : questions.length;

  // Nouvelles réponses à chaque question (et si la langue change)
  const options: QuizOption[] = useMemo(
    () => (current ? buildOptions(current, reverse, language) : []),
    [current?.id, reverse, language]
  );

  // Chrono du défi « Contre la montre »
  useEffect(() => {
    if (!timed || isFinished) return;
    const timer = window.setInterval(() => setTimeLeft(seconds => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [timed, isFinished]);

  useEffect(() => {
    if (timed && timeLeft <= 0 && !isFinished) setIsFinished(true);
  }, [timed, timeLeft, isFinished]);

  // Le score est transmis une seule fois, avec toutes les réponses (y compris la dernière)
  useEffect(() => {
    if (isFinished && !reported.current) {
      reported.current = true;
      onComplete?.(score, total);
    }
  }, [isFinished]);

  // Fait apparaître le résultat et le bouton « Suivant » au-dessus de la barre d'onglets
  useEffect(() => {
    if (selectedId !== null && !timed) {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId, timed]);

  const goNext = () => {
    if (index < questions.length - 1) {
      setIndex(i => i + 1);
      setSelectedId(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleSelect = (option: QuizOption) => {
    if (selectedId !== null || isFinished || !current) return;
    const correct = option.id === current.id;
    setSelectedId(option.id);
    recordAnswer(current.id, correct, correct ? XP_PER_CORRECT : 0);
    setAnswers(previous => [...previous, { id: current.id, correct }]);
    setCombo(value => (correct ? value + 1 : 0));
    if (correct) setXpGained(value => value + XP_PER_CORRECT);
    if (timed) {
      if (correct) setTimeLeft(seconds => seconds + TIMED_BONUS_SECONDS);
      window.setTimeout(goNext, 650);
    }
  };

  if (questions.length === 0) return null;

  if (isFinished) {
    const label = kind === 'challenge' ? t.challenge.title : t.qcm.modes[mode].label;
    return (
      <QuizResults
        label={label}
        timed={timed}
        answers={answers}
        total={total}
        xpGained={xpGained}
        masteredBefore={start.mastered}
        badgesBefore={start.badges}
        onRestart={onRestart}
        onReviewMistakes={onReviewMistakes}
        onBack={onStop}
      />
    );
  }

  const hasAnswered = selectedId !== null;
  const isCorrect = hasAnswered && selectedId === current.id;
  const isLast = index === questions.length - 1;
  const modeLabel = kind === 'challenge' ? (timed ? t.challenge.timed : t.challenge.title) : t.qcm.modes[mode].label;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Barre du haut : quitter, progression ou chrono */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onStop}
          aria-label={t.qcm.stop}
          title={t.qcm.stop}
          className="flex items-center justify-center w-11 h-11 -ml-2 shrink-0 rounded-full text-muted hover:bg-track"
        >
          <X size={24} />
        </button>
        {timed ? (
          <div className="flex-1 h-2 rounded-full bg-track overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded-full bg-accent transition-all duration-1000 ease-linear"
              style={{ width: `${Math.min(100, (timeLeft / TIMED_SECONDS) * 100)}%` }}
            />
          </div>
        ) : questions.length <= 20 ? (
          <div className="flex-1 flex gap-1" aria-hidden="true">
            {questions.map((question, i) => (
              <div
                key={question.id}
                className={`flex-1 h-2 rounded-full ${
                  i < answers.length ? (answers[i].correct ? 'bg-primary' : 'bg-danger') : i === index ? 'bg-accent' : 'bg-track'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 h-2 rounded-full bg-track overflow-hidden" aria-hidden="true">
            <motion.div
              initial={false}
              animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        )}
        <span className="shrink-0 flex items-center gap-1 text-sm font-extrabold text-muted">
          {timed ? (
            <>
              <Timer size={16} />
              {t.challenge.timeLeft(timeLeft)}
            </>
          ) : (
            `${index + 1} / ${questions.length}`
          )}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="px-3 py-1.5 rounded-full bg-soft text-soft-ink text-xs font-extrabold uppercase tracking-wide">
          {modeLabel}
        </span>
        {combo >= 2 && (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-soft text-accent-ink text-sm font-extrabold">
            <Zap size={14} className="fill-accent text-accent" />
            {t.qcm.combo(combo)}
          </span>
        )}
      </div>

      {/* Question */}
      <section className="relative overflow-hidden rounded-3xl bg-surface border border-line px-5 py-7 text-center">
        <svg viewBox="0 0 24 24" className="absolute -left-8 -bottom-9 w-28 h-28 fill-ground" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
          <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
        </svg>
        {reverse ? (
          <>
            <p className="relative text-3xl font-extrabold text-ink">{current.meaning[language]}</p>
            <p className="relative mt-4 font-semibold text-muted">{t.qcm.reverseQuestion}</p>
          </>
        ) : (
          <>
            <p lang="ar" dir="rtl" className="relative arabic-text text-6xl font-bold text-arabic">{current.arabic}</p>
            <p className="relative text-xl font-extrabold text-ink">{current.transliteration}</p>
            <p className="relative mt-4 font-semibold text-muted">{t.qcm.meaningQuestion}</p>
          </>
        )}
      </section>

      {/* Réponses */}
      <div className="space-y-2.5">
        {options.map((option, i) => {
          const isAnswer = option.id === current.id;
          const isSelected = option.id === selectedId;
          let state = 'bg-surface border-line text-ink hover:border-primary/40';
          let letter = 'bg-ground text-muted';
          if (hasAnswered && isAnswer) {
            state = 'bg-soft border-primary text-soft-ink';
            letter = 'bg-primary text-on-primary';
          } else if (hasAnswered && isSelected) {
            state = 'bg-danger-soft border-danger text-danger-ink';
            letter = 'bg-danger text-on-danger';
          } else if (hasAnswered) {
            state = 'bg-surface border-line text-ink opacity-50';
          }
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={hasAnswered}
              className={`w-full flex items-center gap-3 min-h-[3.75rem] py-2 pl-2 pr-4 rounded-2xl border-2 text-left transition-colors ${state}`}
            >
              <span className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-xl text-sm font-extrabold ${letter}`}>
                {LETTERS[i]}
              </span>
              {option.arabic ? (
                <span className="flex-1 min-w-0 flex items-center justify-between gap-3">
                  <span className="font-bold">{option.label}</span>
                  <span lang="ar" dir="rtl" className="arabic-text text-2xl font-bold">{option.arabic}</span>
                </span>
              ) : (
                <span className="flex-1 font-bold text-lg">{option.label}</span>
              )}
              {hasAnswered && isAnswer && <Check size={22} className="shrink-0" />}
              {hasAnswered && isSelected && !isAnswer && <X size={22} className="shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Résultat de la question (le chrono passe tout seul à la suivante) */}
      {hasAnswered && !timed && (
        <motion.div
          ref={feedbackRef}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className={`rounded-3xl p-4 space-y-3 scroll-mb-28 ${isCorrect ? 'bg-soft' : 'bg-danger-soft'}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-full ${
                isCorrect ? 'bg-primary text-on-primary' : 'bg-danger text-on-danger'
              }`}
            >
              {isCorrect ? <Check size={22} /> : <RotateCcw size={20} />}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-xl font-extrabold ${isCorrect ? 'text-soft-ink' : 'text-danger-ink'}`}>
                {isCorrect ? t.qcm.correctTitle : t.qcm.wrongTitle}
              </p>
              <p className={`text-sm font-semibold ${isCorrect ? 'text-soft-ink' : 'text-danger-ink'}`}>
                {isCorrect
                  ? `${current.transliteration} · ${current.meaning[language]}`
                  : t.qcm.rightAnswer(reverse ? current.transliteration : current.meaning[language])}
              </p>
            </div>
            {isCorrect && (
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-accent-soft text-accent-ink text-sm font-extrabold">
                +{XP_PER_CORRECT} {t.xp}
              </span>
            )}
          </div>
          {!isCorrect && <p className="text-sm font-medium text-danger-ink">{t.qcm.addedToMistakes}</p>}
          <button
            type="button"
            onClick={goNext}
            className={`w-full flex items-center justify-center gap-2 h-14 rounded-2xl font-extrabold ${
              isCorrect ? 'bg-primary text-on-primary hover:bg-primary-hover' : 'bg-danger text-on-danger'
            }`}
          >
            {isLast ? t.qcm.finish : t.qcm.next}
            <ArrowRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
