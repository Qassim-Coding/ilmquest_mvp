import React from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getNameById } from '../lib/learning';
import { useArabic } from '../lib/arabic';
import { useBackHandler } from '../lib/backButton';
import {
  nextName,
  previousName,
  setContinuous,
  stopAudio,
  toggleListening,
  useNameAudio,
} from '../lib/nameAudio';

/**
 * Barre de lecture de « Écouter tous les noms » (onglet Liste), posée juste au-dessus des onglets.
 * Elle n'apparaît que pendant cette lecture. On y trouve l'interrupteur « Nom par nom »
 * (éteint : les Noms s'enchaînent seuls ; allumé : on avance avec « Suivant »),
 * puis précédent, lecture / pause, suivant et fermer.
 * Le bouton retour du téléphone la ferme, comme sa croix.
 */
export default function ListenBar() {
  const audio = useNameAudio();
  const { t } = useLanguage();
  const arabic = useArabic();
  useBackHandler(audio.queue !== null, stopAudio);

  if (audio.queue === null || audio.currentId === null) return null;
  const name = getNameById(audio.currentId);
  if (!name) return null;

  const isFirst = audio.index === 0;
  const isLast = audio.index === audio.queue.length - 1;
  const isRunning = audio.phase === 'playing' || audio.phase === 'gap';
  // Nom par Nom, arrêté sur un Nom : le bouton central le fait réécouter
  const replays = audio.phase === 'idle';
  const mainLabel = isRunning ? t.audio.pause : replays ? t.audio.replay : t.audio.play;
  const MainIcon = isRunning ? Pause : replays ? RotateCcw : Play;

  const oneByOne = !audio.continuous;
  const sideButton = 'flex items-center justify-center w-11 h-11 rounded-full text-on-hero hover:bg-hero-soft disabled:opacity-35 disabled:hover:bg-transparent';

  return (
    <section aria-label={t.audio.player} className="max-w-md mx-auto px-3 pb-2">
      <div className="rounded-3xl bg-hero text-on-hero shadow-xl p-3 space-y-2">
        <div className="flex items-center gap-3 pl-1">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-hero-muted">
              {audio.index + 1} / {audio.queue.length}
            </p>
            <p className="font-extrabold truncate">{name.transliteration}</p>
          </div>
          <p lang="ar" dir="rtl" className="arabic-text max-w-[55%] text-2xl font-bold leading-snug text-right">
            {arabic(name)}
          </p>
          <button
            type="button"
            onClick={stopAudio}
            aria-label={t.audio.close}
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full text-hero-muted hover:bg-hero-soft hover:text-on-hero"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Interrupteur « Nom par nom » : éteint = en continu (le Nom suivant part seul), allumé = on avance avec « Suivant » */}
          <button
            type="button"
            role="switch"
            aria-checked={oneByOne}
            onClick={() => setContinuous(oneByOne)}
            className="flex items-center gap-2 h-10 pl-3 pr-2 rounded-full bg-hero-soft text-xs font-extrabold"
          >
            <span className={oneByOne ? 'text-on-hero' : 'text-hero-muted'}>{t.audio.oneByOne}</span>
            <span
              aria-hidden="true"
              className={`flex items-center w-8 h-5 p-0.5 rounded-full transition-colors ${oneByOne ? 'bg-on-hero justify-end' : 'bg-hero justify-start'}`}
            >
              <span className={`w-4 h-4 rounded-full ${oneByOne ? 'bg-hero' : 'bg-hero-muted'}`} />
            </span>
          </button>
          <div className="flex items-center gap-1 ml-auto">
            <button type="button" onClick={previousName} disabled={isFirst} aria-label={t.audio.previous} className={sideButton}>
              <SkipBack size={20} />
            </button>
            <button
              type="button"
              onClick={toggleListening}
              aria-label={mainLabel}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-on-hero text-hero"
            >
              <MainIcon size={22} />
            </button>
            <button type="button" onClick={nextName} disabled={isLast} aria-label={t.audio.next} className={sideButton}>
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
