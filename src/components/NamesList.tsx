import React, { useEffect, useState } from 'react';
import { Search, Heart, Headphones, Square } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { countByLevel, getLevel } from '../lib/learning';
import { LEVEL_PILL, LIST_PILL } from '../lib/levelStyles';
import { useActiveNames } from '../lib/activeNames';
import { useArabic } from '../lib/arabic';
import { matchesSearch } from '../lib/search';
import { getNameAudioState, hasNameAudio, startListening, stopAudio, useNameAudio } from '../lib/nameAudio';
import AudioButton from './AudioButton';

type ListFilter = 'all' | 'mastered' | 'learning' | 'favorites';

interface NamesListProps {
  onOpenName: (id: number) => void;
}

export default function NamesList({ onOpenName }: NamesListProps) {
  const { progress } = useProgress();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<ListFilter>('all');
  const arabic = useArabic();
  const { choice, names } = useActiveNames();
  const audio = useNameAudio();
  const isListening = audio.queue !== null;

  const { mastered, learning, toDiscover, total } = countByLevel(progress, names);
  // Numéro de chaque nom dans la liste suivie (sa place dans cette liste, pas son id)
  const positions = new Map(names.map((name, index) => [name.id, index + 1]));

  // Recherche tolérante (voir src/lib/search.ts) : sans accents ni signes, avec ou sans article,
  // et en arabe avec ou sans voyelles. « Rahim » trouve Ar-Rahîm.
  const filteredNames = names.filter(name => {
    if (!matchesSearch(name, searchTerm, language)) return false;
    const level = getLevel(progress, name.id);
    if (filter === 'mastered') return level === 'mastered';
    if (filter === 'learning') return level === 'learning' || level === 'familiar';
    if (filter === 'favorites') return progress.favorites.includes(name.id);
    return true;
  });

  // « Écouter tous les noms » lit les noms affichés (recherche et filtre compris) qui ont un audio.
  // Sans aucun audio validé, le bouton n'apparaît pas.
  const audioIds = filteredNames.filter(name => hasNameAudio(name.id)).map(name => name.id);
  const showsEveryName = audioIds.length === names.filter(name => hasNameAudio(name.id)).length;

  // Pendant l'écoute, la liste défile pour garder le Nom en cours au milieu de l'écran
  useEffect(() => {
    if (!isListening || audio.currentId === null) return;
    const row = document.getElementById(`name-row-${audio.currentId}`);
    if (!row) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    row.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [isListening, audio.currentId]);

  // En quittant la Liste (autre onglet, fiche d'un nom), l'écoute s'arrête
  useEffect(() => () => {
    if (getNameAudioState().queue !== null) stopAudio();
  }, []);

  const filters: { id: ListFilter; label: string }[] = [
    { id: 'all', label: t.list.all(total) },
    { id: 'mastered', label: t.list.mastered },
    { id: 'learning', label: t.list.learning },
    { id: 'favorites', label: t.list.favorites },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.list.title(total)}</h1>
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

      {audioIds.length > 0 && (
        <button
          type="button"
          onClick={() => (isListening ? stopAudio() : startListening(audioIds))}
          className={`flex items-center justify-center gap-2 w-full h-12 rounded-2xl font-extrabold transition-colors ${
            isListening ? 'bg-track text-ink' : 'bg-soft text-soft-ink hover:bg-primary hover:text-on-primary'
          }`}
        >
          {isListening ? <Square size={18} /> : <Headphones size={20} />}
          {isListening ? t.audio.stopListening : showsEveryName ? t.audio.listenAll : t.audio.listenSome(audioIds.length)}
        </button>
      )}

      {filteredNames.length === 0 ? (
        <p className="px-1 py-10 text-center text-muted font-medium">
          {filter === 'favorites' && searchTerm === '' ? t.list.emptyFavorites : t.list.empty}
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredNames.map(name => {
            const level = getLevel(progress, name.id);
            const isFavorite = progress.favorites.includes(name.id);
            // Nom en cours pendant « Écouter tous les noms » : ligne surlignée
            const isCurrent = isListening && audio.currentId === name.id;
            return (
              <li
                key={name.id}
                id={`name-row-${name.id}`}
                aria-current={isCurrent ? 'true' : undefined}
                className={`flex items-stretch rounded-2xl border transition-colors ${
                  isCurrent ? 'bg-soft border-primary ring-2 ring-primary/30' : 'bg-surface border-line hover:border-primary/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onOpenName(name.id)}
                  className="flex-1 min-w-0 flex items-center gap-3 min-h-[4.5rem] py-2.5 pl-2.5 pr-4 rounded-2xl text-left"
                >
                  <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-ground text-sm font-extrabold text-muted">
                    #{positions.get(name.id)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="font-extrabold text-ink min-w-0 break-words">{name.transliteration}</span>
                      {isFavorite && <Heart size={14} className="shrink-0 fill-danger text-danger" aria-hidden="true" />}
                      {/* Les deux listes réunies : on signale les noms qui n'appartiennent qu'à une liste */}
                      {choice === 'all' && name.lists.length === 1 && (
                        <span className={`shrink-0 px-1.5 py-0.5 rounded-md text-xs font-extrabold ${LIST_PILL[name.lists[0]]}`}>
                          {t.list.onlyIn[name.lists[0]]}
                        </span>
                      )}
                    </span>
                    <span className="block text-sm font-medium text-muted">{name.meaning[language]}</span>
                  </span>
                  {/* max-w : un nom arabe très long (n° 85) passe sur deux lignes au lieu de recouvrir le texte à sa gauche */}
                  <span className="flex flex-col items-end gap-1 shrink-0 max-w-[45%]">
                    <span lang="ar" dir="rtl" className="arabic-text text-3xl font-bold text-arabic text-right">{arabic(name)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${LEVEL_PILL[level]}`}>
                      {t.levels[level]}
                    </span>
                  </span>
                </button>
                {/* Bouton « Écouter » : à côté de la ligne et non dedans (un bouton ne peut pas en contenir un autre) */}
                <AudioButton id={name.id} label={name.transliteration} variant="row" />
              </li>
            );
          })}
        </ul>
      )}

      {/* Pendant l'écoute, la barre de lecture couvre le bas de l'écran : de la place pour que les derniers noms restent visibles */}
      {isListening && <div className="h-28" aria-hidden="true" />}
    </div>
  );
}
