import React from 'react';
import { Moon, Sun, Type, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePreferences } from '../context/PreferencesContext';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { isDarkMode, setIsDarkMode, textSize, setTextSize } = usePreferences();

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t.settings.title}</h1>

      <div className="space-y-6">
        {/* Theme */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-stone-800 dark:text-stone-100 font-bold text-lg">
            {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
            <h2>{t.settings.theme}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsDarkMode(false)}
              className={`p-4 rounded-2xl font-bold transition-all ${!isDarkMode ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              {t.settings.light}
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={`p-4 rounded-2xl font-bold transition-all ${isDarkMode ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              {t.settings.dark}
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-stone-800 dark:text-stone-100 font-bold text-lg">
            <Globe size={24} />
            <h2>{t.settings.language}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('fr')}
              className={`p-4 rounded-2xl font-bold transition-all ${language === 'fr' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              Français
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-2xl font-bold transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Text Size */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-stone-800 dark:text-stone-100 font-bold text-lg">
            <Type size={24} />
            <h2>{t.settings.textSize}</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTextSize('sm')}
              className={`p-4 rounded-2xl font-bold transition-all ${textSize === 'sm' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              <span className="text-sm">{t.settings.small}</span>
            </button>
            <button
              onClick={() => setTextSize('md')}
              className={`p-4 rounded-2xl font-bold transition-all ${textSize === 'md' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              <span className="text-base">{t.settings.medium}</span>
            </button>
            <button
              onClick={() => setTextSize('lg')}
              className={`p-4 rounded-2xl font-bold transition-all ${textSize === 'lg' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              <span className="text-lg">{t.settings.large}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
