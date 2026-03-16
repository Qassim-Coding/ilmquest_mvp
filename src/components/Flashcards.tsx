import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { namesOfAllah } from '../data/names';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { FlashcardSide } from '../types';

export default function Flashcards() {
  const { progress, markAsMastered, unmarkAsMastered } = useProgress();
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontSide, setFrontSide] = useState<FlashcardSide>('arabic');
  const [backSide, setBackSide] = useState<FlashcardSide>('meaning');

  const currentName = namesOfAllah[currentIndex];
  const isMastered = progress.masteredNames.includes(currentName.id);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < namesOfAllah.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMastered) {
      unmarkAsMastered(currentName.id);
    } else {
      markAsMastered(currentName.id);
    }
  };

  const renderSide = (side: FlashcardSide) => {
    switch (side) {
      case 'arabic':
        return <h2 className="text-5xl md:text-7xl font-bold arabic-text leading-relaxed">{currentName.arabic}</h2>;
      case 'transliteration':
        return <h2 className="text-3xl md:text-5xl font-bold">{currentName.transliteration}</h2>;
      case 'meaning':
        return <h2 className="text-2xl md:text-4xl font-medium text-center px-4">{currentName.meaning[language]}</h2>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400">
          <span>{t.cards.front}</span>
          <select 
            value={frontSide} 
            onChange={(e) => setFrontSide(e.target.value as FlashcardSide)}
            className="bg-stone-100 dark:bg-stone-800 rounded-lg px-2 py-1 outline-none"
          >
            <option value="arabic">{t.cards.arabic}</option>
            <option value="transliteration">{t.cards.transliteration}</option>
            <option value="meaning">{t.cards.meaning}</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400">
          <span>{t.cards.back}</span>
          <select 
            value={backSide} 
            onChange={(e) => setBackSide(e.target.value as FlashcardSide)}
            className="bg-stone-100 dark:bg-stone-800 rounded-lg px-2 py-1 outline-none"
          >
            <option value="arabic">{t.cards.arabic}</option>
            <option value="transliteration">{t.cards.transliteration}</option>
            <option value="meaning">{t.cards.meaning}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <span className="text-stone-500 font-medium">{t.cards.name} {currentIndex + 1} / 99</span>
        <button 
          onClick={toggleMastered}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            isMastered 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
              : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-300'
          }`}
        >
          <CheckCircle2 size={18} />
          {isMastered ? t.cards.mastered : t.cards.markMastered}
        </button>
      </div>

      <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / 99) * 100}%` }}
          className="bg-primary h-full"
        />
      </div>

      <div 
        className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d transition-all duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl flex flex-col items-center justify-center text-center">
            {renderSide(frontSide)}
            <p className="absolute bottom-6 text-stone-400 dark:text-stone-500 text-sm font-medium flex items-center gap-2">
              <RotateCcw size={16} />
              {t.cards.clickToFlip}
            </p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden p-8 bg-primary rounded-3xl shadow-xl flex flex-col items-center justify-center text-center text-white"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {renderSide(backSide)}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between pt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-0 transition-all"
        >
          <ArrowLeft size={20} />
          <span>{t.cards.prev}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === namesOfAllah.length - 1}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-hover disabled:opacity-0 transition-all"
        >
          <span>{t.cards.next}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
