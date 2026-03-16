import React, { createContext, useContext, useState, useEffect } from 'react';

type TextSize = 'sm' | 'md' | 'lg';

interface PreferencesContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
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

  useEffect(() => {
    localStorage.setItem('99names_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('99names_textsize', textSize);
    // Adjusting the root font-size scales all Tailwind rem-based text classes
    const sizeMap = { sm: '14px', md: '16px', lg: '18px' };
    document.documentElement.style.fontSize = sizeMap[textSize];
  }, [textSize]);

  return (
    <PreferencesContext.Provider value={{ isDarkMode, setIsDarkMode, textSize, setTextSize }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
};
