import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, X } from 'lucide-react';
import { namesOfAllah, DivineName } from '../data/names';
import { useLanguage } from '../context/LanguageContext';

interface QuizEngineProps {
  mode: 'practice' | 'challenge';
  count: number;
  onComplete?: (score: number, total: number) => void;
  onStop: () => void;
}

export default function QuizEngine({ mode, count, onComplete, onStop }: QuizEngineProps) {
  const { language, t } = useLanguage();
  const [questions, setQuestions] = useState<DivineName[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const initQuiz = () => {
    let selectedNames = [...namesOfAllah].sort(() => 0.5 - Math.random()).slice(0, count);
    setQuestions(selectedNames);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    generateOptions(selectedNames[0]);
  };

  useEffect(() => {
    initQuiz();
  }, [count, mode]);

  const generateOptions = (correctName: DivineName) => {
    if (!correctName) return;
    const wrongOptions = namesOfAllah
      .filter(n => n.id !== correctName.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(n => n.meaning[language]);
    
    const allOptions = [...wrongOptions, correctName.meaning[language]].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedAnswer(-1);
  };

  const handleSelect = (index: number) => {
    if (selectedAnswer !== -1) return; // Already answered
    setSelectedAnswer(index);
    if (options[index] === questions[currentIndex].meaning[language]) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateOptions(questions[nextIndex]);
    } else {
      setIsFinished(true);
      if (onComplete) {
        onComplete(score + (options[selectedAnswer] === questions[currentIndex].meaning[language] ? 1 : 0), questions.length);
      }
    }
  };

  if (questions.length === 0) return null;

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4"
        >
          <div className="text-6xl font-black text-primary">{percentage}%</div>
          <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t.qcm.finalScore}</h2>
          <p className="text-stone-500 text-lg">{score} {t.qcm.correctAnswers} {questions.length}</p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <button
            onClick={initQuiz}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            <span>{t.qcm.restart}</span>
          </button>
          <button
            onClick={onStop}
            className="w-full py-4 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl font-bold hover:bg-stone-300 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-2"
          >
            <X size={18} />
            <span>{t.qcm.stop}</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
          {mode === 'challenge' ? t.qcm.challengeMode : t.qcm.classicMode}
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t.qcm.question} {currentIndex + 1}</span>
            <span className="text-stone-400 dark:text-stone-500">/ {questions.length}</span>
          </div>
          <button 
            onClick={onStop}
            className="p-2 -mr-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
            title={t.qcm.stop}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="bg-primary h-full"
        />
      </div>

      <div className="space-y-6">
        <div className="p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm text-center">
          <h2 className="text-4xl md:text-6xl font-bold arabic-text text-primary mb-4">
            {currentQuestion.arabic}
          </h2>
          <p className="text-xl text-stone-600 dark:text-stone-400 font-medium">
            {currentQuestion.transliteration}
          </p>
          <p className="mt-6 text-stone-500 font-medium">{t.qcm.meaningQuestion}</p>
        </div>

        <div className="grid gap-4">
          {options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = option === currentQuestion.meaning[language];
            const showResult = selectedAnswer !== -1;

            let stateClasses = 'border-stone-100 dark:border-stone-800 hover:border-primary/30 hover:bg-stone-50 dark:hover:bg-stone-800/50';
            
            if (showResult) {
              if (isCorrect) stateClasses = 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
              else if (isSelected) stateClasses = 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
              else stateClasses = 'opacity-50 border-stone-100 dark:border-stone-800';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4 ${stateClasses}`}
              >
                <span className="font-bold text-lg">{option}</span>
                {showResult && isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />}
                {showResult && isSelected && !isCorrect && <XCircle className="text-red-500 shrink-0" size={24} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end pt-6">
        <button
          onClick={handleNext}
          disabled={selectedAnswer === -1}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
            selectedAnswer === -1
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
              : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-hover'
          }`}
        >
          <span>{currentIndex === questions.length - 1 ? t.qcm.finish : t.qcm.next}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
