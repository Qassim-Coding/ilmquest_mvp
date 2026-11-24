import React from 'react';
import { ChevronLeft, ChevronRight, Heart, Layers, RotateCcw } from 'lucide-react';
import { getListNames, SHOW_AJIB_LIST } from '../data/nameLists';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { daysUntilReview, getLevel, getNameById, LEVEL_ORDER, positionInList } from '../lib/learning';
import { useArabic } from '../lib/arabic';
import { useActiveNames } from '../lib/activeNames';
import { LIST_PILL } from '../lib/levelStyles';
import { hasNameAudio } from '../lib/nameAudio';
import AudioButton from './AudioButton';

interface NameDetailProps {
  id: number;
  onBack: () => void;
  onOpenName: (id: number) => void;
  onOpenCard: (id: number) => void;
  onReview: (id: number) => void;
}

/** Fiche d'un nom : uniquement les données de names.ts et la progression de l'utilisateur */
export default function NameDetail({ id, onBack, onOpenName, onOpenCard, onReview }: NameDetailProps) {
  const { progress, toggleFavorite, setNote } = useProgress();
  const { language, t } = useLanguage();
  const arabic = useArabic();
  const { names } = useActiveNames();

  const name = getNameById(id);
  if (!name) return null;

  // On navigue dans la liste suivie ; si le nom n'en fait pas partie, dans les deux listes réunies
  const inFollowedList = names.some(n => n.id === id);
  const navNames = inFollowedList ? names : getListNames('all');
  const index = navNames.findIndex(n => n.id === id);
  const previous = navNames[(index - 1 + navNames.length) % navNames.length];
  const next = navNames[(index + 1) % navNames.length];
  const position = (nameId: number) => positionInList(navNames, nameId) ?? nameId;

  const isFavorite = progress.favorites.includes(id);
  const stat = progress.nameStats[id];
  const level = getLevel(progress, id);
  const levelIndex = LEVEL_ORDER.indexOf(level);
  const totalAnswers = stat ? stat.correct + stat.wrong : 0;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label={t.detail.back}
          className="flex items-center justify-center w-11 h-11 -ml-2 rounded-full text-ink hover:bg-track"
        >
          <ChevronLeft size={26} />
        </button>
        <span className="font-extrabold text-muted">{t.detail.position(position(name.id), navNames.length)}</span>
        <button
          type="button"
          onClick={() => toggleFavorite(id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? t.detail.removeFavorite : t.detail.addFavorite}
          className={`flex items-center justify-center w-11 h-11 -mr-2 rounded-full transition-colors ${
            isFavorite ? 'bg-danger-soft text-danger' : 'text-ink hover:bg-track'
          }`}
        >
          <Heart size={22} className={isFavorite ? 'fill-danger' : ''} />
        </button>
      </div>

      {/* En-tête du nom */}
      <section className="relative overflow-hidden rounded-[1.75rem] bg-hero px-5 py-7 text-center">
        <svg viewBox="0 0 24 24" className="absolute -left-14 -top-14 w-48 h-48 fill-hero-soft" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
          <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
        </svg>
        <svg viewBox="0 0 24 24" className="absolute -right-10 -bottom-10 w-32 h-32 fill-hero-soft" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
          <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
        </svg>
        <p lang="ar" dir="rtl" className="relative arabic-text text-6xl font-bold text-on-hero">{arabic(name)}</p>
        <p className="relative mt-1 text-2xl font-extrabold text-on-hero">{name.transliteration}</p>
        <p className="relative text-lg font-semibold text-hero-muted">{name.meaning[language]}</p>
        {hasNameAudio(name.id) && (
          <div className="relative mt-4 flex justify-center">
            <AudioButton id={name.id} label={name.transliteration} variant="hero" />
          </div>
        )}
      </section>

      {/* Listes qui contiennent ce nom : prévient l'utilisateur que les listes diffèrent.
          Pastilles affichées seulement quand la liste Ajib.fr est proposée (voir SHOW_AJIB_LIST). */}
      <div className="space-y-1.5 px-1">
        {SHOW_AJIB_LIST && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted">{t.detail.inLists}</span>
          {name.lists.map(list => (
            <span key={list} className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${LIST_PILL[list]}`}>
              {t.listNames[list]}
            </span>
          ))}
        </div>
        )}
        {SHOW_AJIB_LIST && name.lists.length === 1 && <p className="text-xs font-semibold text-muted">{t.detail.onlyIn[name.lists[0]]}</p>}
        {!inFollowedList && (
          <p className="px-3 py-2 rounded-xl bg-accent-soft text-sm font-semibold text-accent-ink">{t.detail.notInList}</p>
        )}
      </div>

      {/* Nom précédent / suivant */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onOpenName(previous.id)}
          aria-label={t.detail.previous}
          className="flex items-center gap-2 h-12 px-3 rounded-2xl bg-surface border border-line text-sm font-bold text-ink min-w-0"
        >
          <ChevronLeft size={18} className="shrink-0 text-muted" />
          <span className="truncate">#{position(previous.id)} {previous.transliteration}</span>
        </button>
        <button
          type="button"
          onClick={() => onOpenName(next.id)}
          aria-label={t.detail.next}
          className="flex items-center justify-end gap-2 h-12 px-3 rounded-2xl bg-surface border border-line text-sm font-bold text-ink min-w-0"
        >
          <span className="truncate">#{position(next.id)} {next.transliteration}</span>
          <ChevronRight size={18} className="shrink-0 text-muted" />
        </button>
      </div>

      {/* Maîtrise */}
      <section className="rounded-3xl bg-surface border border-line p-4 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 className="font-extrabold text-ink">{t.detail.mastery}</h2>
          <span className="text-sm font-semibold text-muted">{t.detail.nextReview(daysUntilReview(stat))}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {LEVEL_ORDER.map((item, i) => (
            <div key={item} className="space-y-1.5">
              <div className={`h-2 rounded-full ${i <= levelIndex ? 'bg-primary' : 'bg-track'}`} />
              <span className={`block text-xs ${item === level ? 'font-extrabold text-soft-ink' : 'font-semibold text-muted'}`}>
                {t.levels[item]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-line">
          <span className="text-sm font-semibold text-muted">
            {totalAnswers > 0 && stat ? t.detail.answers(totalAnswers, stat.correct) : t.detail.noAnswers}
          </span>
          {stat && stat.history.length > 0 && (
            <span className="flex gap-1" aria-hidden="true">
              {stat.history.map((correct, i) => (
                <span key={i} className={`w-3 h-3 rounded-full ${correct ? 'bg-primary' : 'bg-danger'}`} />
              ))}
            </span>
          )}
        </div>
      </section>

      {/* Note personnelle (enregistrée sur l'appareil) */}
      <div className="space-y-1.5">
        <label htmlFor="name-note" className="block px-1 text-sm font-extrabold text-ink">{t.detail.note}</label>
        <textarea
          id="name-note"
          rows={2}
          value={progress.notes[id] ?? ''}
          onChange={(e) => setNote(id, e.target.value)}
          placeholder={t.detail.notePlaceholder}
          className="w-full px-4 py-3 rounded-2xl bg-surface border border-line text-ink placeholder:text-muted resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onOpenCard(id)}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-surface border-2 border-line font-extrabold text-ink"
        >
          <Layers size={18} />
          {t.detail.seeCard}
        </button>
        <button
          type="button"
          onClick={() => onReview(id)}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-on-primary font-extrabold hover:bg-primary-hover transition-colors"
        >
          <RotateCcw size={18} />
          {t.detail.reviewName}
        </button>
      </div>
    </div>
  );
}
