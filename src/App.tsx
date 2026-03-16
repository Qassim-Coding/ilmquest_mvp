import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Layers, Target, List, Settings as SettingsIcon, Home as HomeIcon } from 'lucide-react';
import { ProgressProvider } from './context/ProgressContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import Home from './components/Home';
import Flashcards from './components/Flashcards';
import Qcm from './components/Qcm';
import Challenge from './components/Challenge';
import NamesList from './components/NamesList';
import Settings from './components/Settings';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'list' | 'flashcards' | 'qcm' | 'challenge' | 'settings'>('home');
  const { t } = useLanguage();
  const { isDarkMode } = usePreferences();

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={setActiveTab} />;
      case 'list': return <NamesList />;
      case 'flashcards': return <Flashcards />;
      case 'qcm': return <Qcm />;
      case 'challenge': return <Challenge />;
      case 'settings': return <Settings />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'}`}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <BookOpen size={24} />
            <span>{t.appTitle}</span>
          </div>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-full transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            title={t.nav.settings}
          >
            <SettingsIcon size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 pb-safe z-50">
        <div className="max-w-md mx-auto flex items-center justify-around p-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'home' ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
          >
            <HomeIcon size={24} />
            <span className="text-xs font-bold">{t.nav.home}</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'list' ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
          >
            <List size={24} />
            <span className="text-xs font-bold">{t.nav.list}</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'flashcards' ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
          >
            <Layers size={24} />
            <span className="text-xs font-bold">{t.nav.cards}</span>
          </button>
          <button
            onClick={() => setActiveTab('qcm')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'qcm' ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
          >
            <BookOpen size={24} />
            <span className="text-xs font-bold">{t.nav.quiz}</span>
          </button>
          <button
            onClick={() => setActiveTab('challenge')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'challenge' ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            }`}
          >
            <Target size={24} />
            <span className="text-xs font-bold">{t.nav.challenge}</span>
          </button>
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
