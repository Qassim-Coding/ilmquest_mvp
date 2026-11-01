import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ArrowLeft, ArrowLeftRight, Check } from 'lucide-react';
import { namesOfAllah } from '../data/names';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { getLevel, XP_PER_CARD } from '../lib/learning';
import { FlashcardSide } from '../types';
import { LEVEL_PILL } from '../lib/levelStyles';

interface FlashcardsProps {
  /** Nom à afficher en premier (depuis « Voir en carte » sur une fiche) */
  startId?: number | null;
}

const SIDES: FlashcardSide[] = ['arabic', 'transliteration', 'meaning'];

export default function Flashcards({ startId = null }: FlashcardsProps) {
  const { progress, recordAnswer } = useProgress();
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = startId === null ? -1 : namesOfAllah.findIndex(name => name.id === startId);
    return index >= 0 ? index : 0;
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontSide, setFrontSide] = useState<FlashcardSide>('arabic');
  const [backSide, setBackSide] = useState<FlashcardSide>('meaning');

  const currentName = namesOfAllah[currentIndex];
  const level = getLevel(progress, currentName.id);
  // Au verso, on montre aussi le côté qui n'est ni au recto ni au verso (ex. la translittération)
  const extraSide = SIDES.find(side => side !== frontSide && side !== backSide);

  const goTo = (index: number) => {
    setIsFlipped(false);
    setCurrentIndex((index + namesOfAllah.length) % namesOfAllah.length);
  };

  // « Je le savais » / « À revoir » : la maîtrise du nom monte ou descend, puis carte suivante
  const answer = (knew: boolean) => {
    recordAnswer(currentName.id, knew, knew ? XP_PER_CARD : 0);
    goTo(currentIndex + 1);
  };

  const swapSides = () => {
    setFrontSide(backSide);
    setBackSide(frontSide);
    setIsFlipped(false);
  };

  const renderSide = (side: FlashcardSide, onHero: boolean) => {
    switch (side) {
      case 'arabic':
        return (
          <p lang="ar" dir="rtl" className={`arabic-text text-6xl md:text-7xl font-bold ${onHero ? 'text-on-hero' : 'text-arabic'}`}>
            {currentName.arabic}
          </p>
        );
      case 'transliteration':
        return <p className={`text-3xl md:text-5xl font-extrabold ${onHero ? 'text-on-hero' : 'text-ink'}`}>{currentName.transliteration}</p>;
      case 'meaning':
        return <p className={`text-2xl md:text-4xl font-extrabold px-4 ${onHero ? 'text-on-hero' : 'text-ink'}`}>{currentName.meaning[language]}</p>;
    }
  };

  const renderExtra = (side: FlashcardSide) => {
    if (side === 'arabic') {
      return <p lang="ar" dir="rtl" className="arabic-text text-3xl font-bold text-hero-muted">{currentName.arabic}</p>;
    }
    return (
      <p className="text-lg font-semibold text-hero-muted">
        {side === 'transliteration' ? currentName.transliteration : currentName.meaning[language]}
      </p>
    );
  };

  const sideOptions = (
    <>
      <option value="arabic">{t.cards.arabic}</option>
      <option value="transliteration">{t.cards.transliteration}</option>
      <option value="meaning">{t.cards.meaning}</option>
    </>
  );

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="px-1 text-3xl font-extrabold tracking-tight text-ink">{t.nav.cards}</h1>

      {/* Recto / verso */}
      <div className="flex items-end gap-2">
        <div className="flex-1 min-w-0 space-y-1">
          <label htmlFor="card-front" className="block px-1 text-xs font-bold text-muted">{t.cards.frontLabel}</label>
          <select
            id="card-front"
            value={frontSide}
            onChange={(e) => { setFrontSide(e.target.value as FlashcardSide); setIsFlipped(false); }}
            className="w-full h-11 px-3 rounded-xl bg-surface border border-line text-sm font-bold text-ink outline-none focus:border-primary"
          >
            {sideOptions}
          </select>
        </div>
        <button
          type="button"
          onClick={swapSides}
          aria-label={t.cards.swap}
          className="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-soft text-soft-ink"
        >
          <ArrowLeftRight size={20} />
        </button>
        <div className="flex-1 min-w-0 space-y-1">
          <label htmlFor="card-back" className="block px-1 text-xs font-bold text-muted">{t.cards.backLabel}</label>
          <select
            id="card-back"
            value={backSide}
            onChange={(e) => { setBackSide(e.target.value as FlashcardSide); setIsFlipped(false); }}
            className="w-full h-11 px-3 rounded-xl bg-surface border border-line text-sm font-bold text-ink outline-none focus:border-primary"
          >
            {sideOptions}
          </select>
        </div>
      </div>

      {/* Position et maîtrise */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-muted">{t.cards.name} {currentIndex + 1} / 99</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${LEVEL_PILL[level]}`}>{t.levels[level]}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-track overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${((currentIndex + 1) / 99) * 100}%` }}
            className="h-full bg-primary"
          />
        </div>
      </div>

      {/* Carte : toucher pour la retourner */}
      <button
        type="button"
        onClick={() => setIsFlipped(!isFlipped)}
        aria-label={t.cards.flip}
        className="relative block w-full aspect-[4/3] perspective-1000"
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 backface-hidden p-6 rounded-[1.75rem] bg-surface border border-line shadow-lg flex flex-col items-center justify-center text-center">
            {renderSide(frontSide, false)}
            <p className="absolute bottom-5 flex items-center gap-2 text-sm font-semibold text-muted">
              <RotateCcw size={16} />
              {t.cards.clickToFlip}
            </p>
          </div>
          <div
            className="absolute inset-0 backface-hidden p-6 rounded-[1.75rem] bg-hero shadow-lg flex flex-col items-center justify-center gap-2 text-center"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {renderSide(backSide, true)}
            {extraSide && renderExtra(extraSide)}
          </div>
        </motion.div>
      </button>

      {/* Auto-évaluation */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => answer(false)}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-danger-soft text-danger-ink font-extrabold"
        >
          <RotateCcw size={20} />
          {t.cards.toReview}
        </button>
        <button
          type="button"
          onClick={() => answer(true)}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-on-primary font-extrabold hover:bg-primary-hover transition-colors"
        >
          <Check size={20} />
          {t.cards.iKnew}
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          className="flex items-center gap-2 h-11 px-4 rounded-xl text-sm font-bold text-muted hover:bg-track"
        >
          <ArrowLeft size={18} />
          {t.cards.prev}
        </button>
      </div>
    </div>
  );
}
