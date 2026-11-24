import React from 'react';
import { Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { hasNameAudio, playName, useNameAudio } from '../lib/nameAudio';

interface AudioButtonProps {
  /** id du Nom (names.ts) */
  id: number;
  /** Nom lu, pour les lecteurs d'écran : « Écouter Ar-Rahmân » */
  label: string;
  /**
   * - 'row' : bande à droite d'une ligne de la Liste
   * - 'card' : bouton rond posé sur une carte
   * - 'hero' : bouton « Écouter » sur le bandeau vert foncé de la fiche
   */
  variant: 'row' | 'card' | 'hero';
  className?: string;
}

const STYLES = {
  row: {
    base: 'flex items-center justify-center w-11 shrink-0 self-stretch rounded-r-2xl border-l border-line transition-colors',
    idle: 'text-primary hover:bg-track',
    playing: 'bg-soft text-soft-ink',
  },
  card: {
    base: 'flex items-center justify-center w-11 h-11 rounded-full shadow-md transition-colors',
    idle: 'bg-soft text-soft-ink',
    playing: 'bg-primary text-on-primary',
  },
  hero: {
    base: 'inline-flex items-center gap-2 h-11 px-5 rounded-full font-extrabold transition-colors',
    idle: 'bg-hero-soft text-on-hero',
    playing: 'bg-on-hero text-hero',
  },
};

/**
 * Bouton « Écouter » d'un Nom. N'apparaît que si le Nom a un audio validé (src/data/nameAudio.ts) :
 * tant qu'aucun audio n'est ajouté, il ne s'affiche nulle part.
 */
export default function AudioButton({ id, label, variant, className = '' }: AudioButtonProps) {
  const audio = useNameAudio();
  const { t } = useLanguage();
  if (!hasNameAudio(id)) return null;

  const isPlaying = audio.currentId === id && audio.phase === 'playing';
  // Pendant la lecture de la liste, l'appui fait sauter la lecture à ce Nom (il ne l'arrête pas)
  const stops = isPlaying && audio.queue === null;
  const style = STYLES[variant];

  return (
    <button
      type="button"
      onClick={() => playName(id)}
      aria-label={stops ? t.audio.stop : t.audio.listen(label)}
      className={`${style.base} ${isPlaying ? style.playing : style.idle} ${className}`}
    >
      <Volume2 size={variant === 'row' ? 20 : 22} className={isPlaying ? 'animate-pulse' : ''} aria-hidden="true" />
      {variant === 'hero' && <span>{t.audio.listenButton}</span>}
    </button>
  );
}
