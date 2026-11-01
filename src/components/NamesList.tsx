import React, { useState } from 'react';
import { Search, Heart } from 'lucide-react';
import { namesOfAllah } from '../data/names';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { countByLevel, getLevel } from '../lib/learning';
import { LEVEL_PILL } from '../lib/levelStyles';

type ListFilter = 'all' | 'mastered' | 'learning' | 'favorites';

interface NamesListProps {
  onOpenName: (id: number) => void;
}

export default function NamesList({ onOpenName }: NamesListProps) {
  const { progress } = useProgress();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<ListFilter>('all');

  const { mastered, learning, toDiscover } = countByLevel(progress);
  const term = searchTerm.toLowerCase();

  const filteredNames = namesOfAllah.filter(name => {
    const matchesSearch =
      name.transliteration.toLowerCase().includes(term) ||
      name.meaning[language].toLowerCase().includes(term) ||
      name.arabic.includes(searchTerm);
    if (!matchesSearch) return false;
    const level = getLevel(progress, name.id);
    if (filter === 'mastered') return level === 'mastered';
    if (filter === 'learning') return level === 'learning' || level === 'familiar';
    if (filter === 'favorites') return progress.favorites.includes(name.id);
    return true;
  });

  const filters: { id: ListFilter; label: string }[] = [
    { id: 'all', label: t.list.all },
    { id: 'mastered', label: t.list.mastered },
    { id: 'learning', label: t.list.learning },
    { id: 'favorites', label: t.list.favorites },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.list.title}</h1>
        <p className="text-sm font-medium text-muted">{t.list.summary(mastered, learning, toDiscover)}</p>
      </div>

      <div className="relative">
        <label htmlFor="names-search" className="sr-only">{t.list.searchLabel}</label>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} aria-hidden="true" />
        <input
          id="names-search"
          type="search"
          placeholder={t.list.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-2xl bg-surface border border-line text-ink placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div role="group" aria-label={t.list.filterLabel} className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map(item => {
          const isActive = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={isActive}
              className={`shrink-0 h-10 px-3.5 rounded-full border text-sm font-bold transition-colors ${
                isActive ? 'bg-primary border-primary text-on-primary' : 'bg-surface border-line text-ink hover:bg-track'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {filteredNames.length === 0 ? (
        <p className="px-1 py-10 text-center text-muted font-medium">
          {filter === 'favorites' && searchTerm === '' ? t.list.emptyFavorites : t.list.empty}
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredNames.map(name => {
            const level = getLevel(progress, name.id);
            const isFavorite = progress.favorites.includes(name.id);
            return (
              <li key={name.id}>
                <button
                  type="button"
                  onClick={() => onOpenName(name.id)}
                  className="w-full flex items-center gap-3 min-h-[4.5rem] py-2.5 pl-2.5 pr-4 rounded-2xl bg-surface border border-line text-left hover:border-primary/40 transition-colors"
                >
                  <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-ground text-sm font-extrabold text-muted">
                    #{name.id}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="font-extrabold text-ink truncate">{name.transliteration}</span>
                      {isFavorite && <Heart size={14} className="shrink-0 fill-danger text-danger" aria-hidden="true" />}
                    </span>
                    <span className="block text-sm font-medium text-muted">{name.meaning[language]}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1 shrink-0">
                    <span lang="ar" dir="rtl" className="arabic-text text-3xl font-bold text-arabic">{name.arabic}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${LEVEL_PILL[level]}`}>
                      {t.levels[level]}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
