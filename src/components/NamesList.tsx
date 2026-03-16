import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, CheckCircle2 } from 'lucide-react';
import { namesOfAllah } from '../data/names';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';

export default function NamesList() {
  const { progress } = useProgress();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNames = namesOfAllah.filter(name => 
    name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.meaning[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.arabic.includes(searchTerm)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{t.list.title}</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder={t.list.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-stone-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNames.map((name) => {
          const isMastered = progress.masteredNames.includes(name.id);
          
          return (
            <motion.div
              key={name.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border transition-all ${
                isMastered 
                  ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' 
                  : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 hover:border-primary/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-stone-400 dark:text-stone-500">#{name.id}</span>
                {isMastered && <CheckCircle2 className="text-emerald-500" size={20} />}
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold arabic-text text-primary">{name.arabic}</h2>
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">{name.transliteration}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{name.meaning[language]}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
