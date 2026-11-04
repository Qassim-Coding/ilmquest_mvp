import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ownNamesCount, SHARED_NAMES_COUNT } from '../data/nameLists';
import { LIST_PILL } from '../lib/levelStyles';

interface AboutListsProps {
  onBack: () => void;
}

/**
 * Page « Pourquoi deux listes ? » (ouverte depuis Paramètres).
 * Explique à l'utilisateur pourquoi l'app suit la liste de Tirmidhî (référence) et propose aussi la liste Ajib.fr.
 * Les textes sont dans src/i18n/translations.ts (clé about) ; les chiffres sont calculés depuis names.ts.
 */
export default function AboutLists({ onBack }: AboutListsProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onBack}
          aria-label={t.about.back}
          className="flex items-center justify-center w-11 h-11 -ml-2 rounded-full text-ink hover:bg-track"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.about.title}</h1>
      </div>

      {/* Le hadith */}
      <section className="relative overflow-hidden rounded-3xl bg-hero p-5 space-y-3">
        <svg viewBox="0 0 24 24" className="absolute -right-10 -top-12 w-40 h-40 fill-hero-soft" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
          <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
        </svg>
        <h2 className="relative text-xs font-extrabold tracking-widest uppercase text-hero-muted">{t.about.hadithTitle}</h2>
        <p className="relative text-lg font-bold leading-snug text-on-hero">{t.about.hadith}</p>
        <p className="relative text-sm font-semibold text-hero-muted">{t.about.hadithRef}</p>
      </section>
      <p className="px-1 font-medium text-ink">{t.about.hadithNote}</p>

      {/* Les deux listes */}
      {(['tirmidhi', 'ilmquest'] as const).map(list => (
        <section key={list} className="rounded-3xl bg-surface border border-line p-4 space-y-2">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${LIST_PILL[list]}`}>
            {t.listNames[list]}
          </span>
          <h2 className="text-lg font-extrabold text-ink">{list === 'tirmidhi' ? t.about.tirmidhiTitle : t.about.ilmquestTitle}</h2>
          <p className="font-medium text-muted">{list === 'tirmidhi' ? t.about.tirmidhi : t.about.ilmquest}</p>
        </section>
      ))}

      {/* En chiffres, calculés depuis les données */}
      <section className="rounded-3xl bg-surface border border-line p-4 space-y-3">
        <h2 className="text-lg font-extrabold text-ink">{t.about.numbersTitle}</h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-ground p-3">
            <span className="block text-2xl font-extrabold text-ink">{SHARED_NAMES_COUNT}</span>
            <span className="block text-xs font-bold text-muted">{t.about.numberLabels.shared}</span>
          </div>
          <div className="rounded-2xl bg-info-soft p-3">
            <span className="block text-2xl font-extrabold text-info-ink">{ownNamesCount('tirmidhi')}</span>
            <span className="block text-xs font-bold text-info-ink">{t.about.numberLabels.tirmidhi}</span>
          </div>
          <div className="rounded-2xl bg-soft p-3">
            <span className="block text-2xl font-extrabold text-soft-ink">{ownNamesCount('ilmquest')}</span>
            <span className="block text-xs font-bold text-soft-ink">{t.about.numberLabels.ilmquest}</span>
          </div>
        </div>
        <p className="font-medium text-muted">
          {t.about.numbers(SHARED_NAMES_COUNT, ownNamesCount('ilmquest'), ownNamesCount('tirmidhi'))}
        </p>
      </section>

      {/* Ce que l'app fait de ces listes */}
      <section className="rounded-3xl bg-surface border border-line p-4 space-y-2">
        <h2 className="text-lg font-extrabold text-ink">{t.about.inAppTitle}</h2>
        <p className="font-medium text-muted">{t.about.inApp}</p>
      </section>

      <button
        type="button"
        onClick={onBack}
        className="w-full h-12 rounded-2xl bg-primary text-on-primary font-extrabold hover:bg-primary-hover transition-colors"
      >
        {t.about.back}
      </button>
    </div>
  );
}
