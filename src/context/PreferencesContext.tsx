import React, { createContext, useContext, useState, useEffect } from 'react';
import { NameListChoice } from '../types';
import { DEFAULT_NAME_LIST, isNameListChoice } from '../data/nameLists';
import { applySystemBarsStyle } from '../lib/systemBars';

type TextSize = 'sm' | 'md' | 'lg';

interface PreferencesContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  /** Affiche les noms en arabe avec leurs voyelles (harakat) */
  showVowels: boolean;
  setShowVowels: (show: boolean) => void;
  /** Liste de noms suivie dans toute l'app (Liste, Cartes, QCM, Défi, progression) */
  nameList: NameListChoice;
  setNameList: (list: NameListChoice) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('99names_theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem('99names_textsize') as TextSize) || 'md';
  });

  // Voyelles affichées par défaut ; l'utilisateur peut les masquer dans les Paramètres
  const [showVowels, setShowVowels] = useState(() => localStorage.getItem('99names_vowels') !== 'off');

  // Liste d'origine par défaut : rien ne change pour les utilisateurs actuels tant qu'ils ne choisissent pas
  const [nameList, setNameList] = useState<NameListChoice>(() => {
    const saved = localStorage.getItem('99names_list');
    return isNameListChoice(saved) ? saved : DEFAULT_NAME_LIST;
  });

  useEffect(() => {
    localStorage.setItem('99names_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // App Android : l'heure et les icônes du téléphone suivent le thème de l'app (voir src/lib/systemBars.ts)
    applySystemBarsStyle(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('99names_textsize', textSize);
    // Adjusting the root font-size scales all Tailwind rem-based text classes
    const sizeMap = { sm: '14px', md: '16px', lg: '18px' };
    document.documentElement.style.fontSize = sizeMap[textSize];
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('99names_vowels', showVowels ? 'on' : 'off');
  }, [showVowels]);

  useEffect(() => {
    localStorage.setItem('99names_list', nameList);
  }, [nameList]);

  return (
    <PreferencesContext.Provider value={{ isDarkMode, setIsDarkMode, textSize, setTextSize, showVowels, setShowVowels, nameList, setNameList }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
};
