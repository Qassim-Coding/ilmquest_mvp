import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Layers, Target, List, Settings as SettingsIcon, Home as HomeIcon, Star } from 'lucide-react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { PreferencesProvider } from './context/PreferencesContext';
import Home from './components/Home';
import Flashcards from './components/Flashcards';
import Qcm from './components/Qcm';
import Challenge from './components/Challenge';
import NamesList from './components/NamesList';
import NameDetail from './components/NameDetail';
import Settings from './components/Settings';
import { QcmPreset, ReviewMode, Tab } from './types';

function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  // Fiche d'un nom ouverte par-dessus l'onglet Liste (null = aucune)
  const [detailId, setDetailId] = useState<number | null>(null);
  // Réglages de départ du QCM (depuis « Réviser » sur l'Accueil ou « Réviser ce nom » sur une fiche)
  const [qcmPreset, setQcmPreset] = useState<QcmPreset | null>(null);
  // Carte à afficher en premier dans l'onglet Cartes (depuis « Voir en carte »)
  const [cardsStartId, setCardsStartId] = useState<number | null>(null);
  const { t, language } = useLanguage();
  const { progress } = useProgress();
  const isDebugUi = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debugUi');
  const debugDir = typeof document !== 'undefined' ? document.documentElement.dir : 'unknown';
  const debugHtmlLang = typeof document !== 'undefined' ? document.documentElement.lang : 'unknown';
  const debugLegacyLang = typeof window !== 'undefined' ? localStorage.getItem('lang') ?? 'null' : 'unknown';
  const debugAppLang = typeof window !== 'undefined' ? localStorage.getItem('99names_lang') ?? 'null' : 'unknown';

  const goTo = (tab: Tab) => {
    setDetailId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };

  const openName = (id: number) => {
    setDetailId(id);
    setActiveTab('list');
    window.scrollTo({ top: 0 });
  };

  const startQcm = (mode: ReviewMode, fixedIds?: number[]) => {
    setQcmPreset({ mode, fixedIds, nonce: Date.now() });
    goTo('qcm');
  };

  const openCard = (id: number) => {
    setCardsStartId(id);
    goTo('flashcards');
  };

  const renderContent = () => {
    if (detailId !== null) {
      return (
        <NameDetail
          id={detailId}
          onBack={() => setDetailId(null)}
          onOpenName={openName}
          onOpenCard={openCard}
          onReview={(id) => startQcm('classic', [id])}
        />
      );
    }
    switch (activeTab) {
      case 'home': return <Home onNavigate={goTo} onOpenName={openName} onStartReview={startQcm} />;
      case 'list': return <NamesList onOpenName={openName} />;
      case 'flashcards': return <Flashcards key={cardsStartId ?? 'cards'} startId={cardsStartId} />;
      case 'qcm': return <Qcm key={qcmPreset?.nonce ?? 'qcm'} preset={qcmPreset} />;
      case 'challenge': return <Challenge />;
      case 'settings': return <Settings onBack={() => goTo('home')} />;
    }
  };

  const navItems: { tab: Tab; label: string; Icon: typeof HomeIcon }[] = [
    { tab: 'home', label: t.nav.home, Icon: HomeIcon },
    { tab: 'list', label: t.nav.list, Icon: List },
    { tab: 'flashcards', label: t.nav.cards, Icon: Layers },
    { tab: 'qcm', label: t.nav.quiz, Icon: BookOpen },
    { tab: 'challenge', label: t.nav.challenge, Icon: Target },
  ];

  return (
    <div className="min-h-screen bg-ground text-ink font-sans transition-colors duration-300">
      {isDebugUi && (
        <div className="sticky top-0 z-[70] bg-amber-200 text-amber-950 text-xs px-3 py-1 border-b border-amber-300">
          debugUi: dir={debugDir} | html.lang={debugHtmlLang} | ctx={language} | 99names_lang={debugAppLang} | legacy lang={debugLegacyLang}
        </div>
      )}
      <header className="sticky top-0 z-50 bg-surface/85 backdrop-blur-md border-b border-line">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goTo('home')}
            className="flex items-center gap-2.5 rounded-xl"
            aria-label={t.nav.home}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-on-primary">
              <BookOpen size={20} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-ink">{t.appTitle}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-accent-soft text-accent-ink text-sm font-extrabold">
              <Star size={16} className="fill-accent text-accent" />
              <span>{progress.xp.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} {t.xp}</span>
            </span>
            <button
              type="button"
              onClick={() => goTo('settings')}
              className={`flex items-center justify-center w-11 h-11 rounded-full transition-colors ${
                activeTab === 'settings' && detailId === null ? 'bg-soft text-soft-ink' : 'text-ink hover:bg-track'
              }`}
              aria-label={t.nav.settings}
              title={t.nav.settings}
            >
              <SettingsIcon size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* pb-32 : le contenu ne passe jamais sous la barre d'onglets */}
      <main className="max-w-3xl mx-auto px-4 pt-5 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={detailId !== null ? `detail-${detailId}` : activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
        aria-label={t.navLabel}
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-line pb-safe"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 px-2 pt-2">
          {navItems.map(({ tab, label, Icon }) => {
            const isActive = activeTab === tab && (tab === 'list' || detailId === null);
            return (
              <button
                key={tab}
                type="button"
                onClick={() => goTo(tab)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition-colors ${
                  isActive ? 'bg-soft text-soft-ink' : 'text-muted hover:text-ink'
                }`}
              >
                <Icon size={22} />
                <span className={`text-xs ${isActive ? 'font-extrabold' : 'font-bold'}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <LanguageProvider>
        <ProgressProvider>
          <MainApp />
        </ProgressProvider>
      </LanguageProvider>
    </PreferencesProvider>
  );
}
