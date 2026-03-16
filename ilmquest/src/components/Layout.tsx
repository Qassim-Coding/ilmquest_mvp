import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, User, Star, LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { t, language } = useSettings();
  
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'quiz', icon: BookOpen, label: t('quiz') },
    { id: 'favorites', icon: Star, label: t('favorites') },
    { id: 'leaderboard', icon: Trophy, label: t('leaderboard') },
    { id: 'profile', icon: User, label: t('profile') },
    { id: 'settings', icon: SettingsIcon, label: t('settings') },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <nav className={`hidden md:flex flex-col w-64 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 p-6 space-y-8 ${
        language === 'ar' ? 'border-l' : 'border-r'
      }`}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <BookOpen size={24} />
          </div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">
            {language === 'ar' ? 'المراجعة' : language === 'fr' ? 'Révision' : 'Revision'}
          </h1>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
              12
            </div>
            <div>
              <p className="text-xs text-stone-400 dark:text-stone-500">{t('level')}</p>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-100">{t('student')}</p>
            </div>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full w-3/4" />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-4 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 ${
              activeTab === item.id ? 'text-primary' : 'text-stone-400 dark:text-stone-500'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[9px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
