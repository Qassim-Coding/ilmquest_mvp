import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';
import { getNameById } from '../lib/learning';
import { useArabic } from '../lib/arabic';
import { useBackHandler } from '../lib/backButton';
import { getListNames, NAME_LIST_CHOICES } from '../data/nameLists';
import AboutLists from './AboutLists';
import SupportCard from './SupportCard';

interface SettingsProps {
  onBack: () => void;
}

// Couleurs fixes des miniatures : chaque aperçu montre son thème, quel que soit le thème actif
const THEME_PREVIEWS = {
  light: { ground: '#F3F8F5', line: '#DCE9E1', hero: '#064E3B', track: '#E2EBE6', primary: '#047857' },
  dark: { ground: '#0A1712', line: '#21402F', hero: '#14412F', track: '#1F3A2E', primary: '#34D399' },
};

export default function Settings({ onBack }: SettingsProps) {
  const { language, setLanguage, t } = useLanguage();
  const { isDarkMode, setIsDarkMode, textSize, setTextSize, showVowels, setShowVowels, nameList, setNameList } = usePreferences();
  const arabic = useArabic();
  const sample = getNameById(3);
  // Page « Pourquoi deux listes ? », ouverte depuis la section Liste des Noms
  const [showAbout, setShowAbout] = useState(false);

  // Bouton retour d'Android sur la page « Pourquoi deux listes ? » : retour aux Paramètres
  useBackHandler(showAbout, () => setShowAbout(false));

  const openAbout = () => {
    setShowAbout(true);
    window.scrollTo(0, 0);
  };

  if (showAbout) {
    return <AboutLists onBack={() => setShowAbout(false)} />;
  }

  const themes = [
    { dark: false, label: t.settings.light, sub: t.settings.lightSub, colors: THEME_PREVIEWS.light },
    { dark: true, label: t.settings.dark, sub: t.settings.darkSub, colors: THEME_PREVIEWS.dark },
  ];

  const segment = (active: boolean) =>
    `h-11 rounded-xl text-sm font-extrabold transition-colors ${
      active ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
    }`;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onBack}
          aria-label={t.settings.back}
          className="flex items-center justify-center w-11 h-11 -ml-2 rounded-full text-ink hover:bg-track"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.settings.title}</h1>
      </div>

      {/* Liste des Noms : les savants n'ont pas tous retenu la même liste de 99 noms.
          Affichée seulement s'il y a plusieurs listes au choix (voir SHOW_AJIB_LIST dans src/data/nameLists.ts). */}
      {NAME_LIST_CHOICES.length > 1 && (
      <section className="space-y-2.5">
        <div className="px-1">
          <h2 className="font-extrabold text-ink">{t.settings.nameList}</h2>
          <p className="text-sm font-medium text-muted">{t.settings.nameListHint}</p>
        </div>
        <div role="radiogroup" aria-label={t.settings.nameList} className="space-y-2">
          {NAME_LIST_CHOICES.map(choice => {
            const isActive = nameList === choice;
            const option = t.settings.listOptions[choice];
            return (
              <button
                key={choice}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setNameList(choice)}
                className={`w-full flex items-center justify-between gap-3 min-h-[3.5rem] px-4 py-2.5 rounded-2xl border-2 bg-surface text-left transition-colors ${
                  isActive ? 'border-primary' : 'border-line'
                }`}
              >
                <span>
                  <span className="block font-extrabold text-ink">{option.title}</span>
                  <span className="block text-xs font-semibold text-muted">{option.sub(getListNames(choice).length)}</span>
                </span>
                <span
                  className={`w-5 h-5 shrink-0 rounded-full ${isActive ? 'border-[6px] border-primary' : 'border-2 border-line'}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={openAbout}
          className="w-full flex items-center justify-between gap-3 h-12 px-4 rounded-2xl bg-soft text-soft-ink font-extrabold"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={18} />
            {t.settings.aboutLists}
          </span>
          <ChevronRight size={18} />
        </button>
      </section>
      )}

      {/* Thème */}
      <section className="space-y-2.5">
        <h2 className="px-1 font-extrabold text-ink">{t.settings.theme}</h2>
        <div role="radiogroup" aria-label={t.settings.theme} className="grid grid-cols-2 gap-3">
          {themes.map(theme => {
            const isActive = isDarkMode === theme.dark;
            return (
              <button
                key={theme.label}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setIsDarkMode(theme.dark)}
                className={`flex flex-col gap-3 p-2.5 rounded-2xl border-2 bg-surface text-left transition-colors ${
                  isActive ? 'border-primary' : 'border-line'
                }`}
              >
                <span
                  className="flex flex-col gap-1.5 p-2 rounded-xl border"
                  style={{ background: theme.colors.ground, borderColor: theme.colors.line }}
                  aria-hidden="true"
                >
                  <span className="block h-8 rounded-lg" style={{ background: theme.colors.hero }} />
                  <span className="block h-2 w-3/4 rounded-full" style={{ background: theme.colors.track }} />
                  <span className="block h-2 w-1/2 rounded-full" style={{ background: theme.colors.track }} />
                  <span className="block h-4 rounded-md" style={{ background: theme.colors.primary }} />
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span>
                    <span className="block font-extrabold text-ink">{theme.label}</span>
                    <span className="block text-xs font-semibold text-muted">{theme.sub}</span>
                  </span>
                  <span
                    className={`w-5 h-5 shrink-0 rounded-full ${isActive ? 'border-[6px] border-primary' : 'border-2 border-line'}`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Langue */}
      <section className="space-y-2.5">
        <h2 className="px-1 font-extrabold text-ink">{t.settings.language}</h2>
        <div role="group" aria-label={t.settings.language} className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-track">
          <button type="button" aria-pressed={language === 'fr'} onClick={() => setLanguage('fr')} className={segment(language === 'fr')}>
            Français
          </button>
          <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')} className={segment(language === 'en')}>
            English
          </button>
        </div>
      </section>

      {/* Voyelles arabes */}
      <section className="space-y-2.5">
        <div className="px-1">
          <h2 className="font-extrabold text-ink">{t.settings.vowels}</h2>
          <p className="text-sm font-medium text-muted">{t.settings.vowelsHint}</p>
        </div>
        <div role="group" aria-label={t.settings.vowels} className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-track">
          <button type="button" aria-pressed={showVowels} onClick={() => setShowVowels(true)} className={segment(showVowels)}>
            {t.settings.vowelsOn}
          </button>
          <button type="button" aria-pressed={!showVowels} onClick={() => setShowVowels(false)} className={segment(!showVowels)}>
            {t.settings.vowelsOff}
          </button>
        </div>
      </section>

      {/* Taille du texte */}
      <section className="space-y-2.5">
        <h2 className="px-1 font-extrabold text-ink">{t.settings.textSize}</h2>
        <div role="group" aria-label={t.settings.textSize} className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-track">
          <button type="button" aria-pressed={textSize === 'sm'} onClick={() => setTextSize('sm')} className={segment(textSize === 'sm')}>
            {t.settings.small}
          </button>
          <button type="button" aria-pressed={textSize === 'md'} onClick={() => setTextSize('md')} className={segment(textSize === 'md')}>
            {t.settings.medium}
          </button>
          <button type="button" aria-pressed={textSize === 'lg'} onClick={() => setTextSize('lg')} className={segment(textSize === 'lg')}>
            {t.settings.large}
          </button>
        </div>
      </section>

      {/* Aperçu : reflète la taille du texte et le choix des voyelles */}
      {sample && (
        <div className="flex flex-col items-center gap-0.5 p-4 rounded-2xl bg-surface border border-line text-center">
          <span className="text-xs font-extrabold tracking-widest uppercase text-muted">{t.settings.preview}</span>
          <span lang="ar" dir="rtl" className="arabic-text text-4xl font-bold text-arabic">{arabic(sample)}</span>
          <span className="text-lg font-extrabold text-ink">{sample.transliteration}</span>
          <span className="text-sm font-medium text-muted">{sample.meaning[language]}</span>
        </div>
      )}

      {/* Soutenir l'app (lien Buy Me a Coffee, voir src/lib/support.ts) */}
      <SupportCard variant="settings" />
    </div>
  );
}
