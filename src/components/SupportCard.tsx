import React from 'react';
import { Heart, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isSupportEnabled, SUPPORT_URL } from '../lib/support';

interface SupportCardProps {
  /** settings : section des Paramètres · home : carte refermable de l'Accueil · results : rappel discret après un quiz */
  variant: 'settings' | 'home' | 'results';
  /** Accueil seulement : appelé quand l'utilisateur ferme la carte */
  onDismiss?: () => void;
}

/**
 * Encart « Soutenir l'app » : un texte court et un lien vers la page de soutien (voir src/lib/support.ts).
 * Le lien s'ouvre dans un nouvel onglet. Rien ne s'affiche si aucun lien n'est renseigné.
 */
export default function SupportCard({ variant, onDismiss }: SupportCardProps) {
  const { t } = useLanguage();
  if (!isSupportEnabled()) return null;

  const link = (
    <a
      href={SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.support.linkLabel}
      className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl bg-accent-soft text-accent-ink font-extrabold hover:opacity-90 transition-opacity"
    >
      <Heart size={18} aria-hidden="true" />
      {t.support.button}
    </a>
  );

  if (variant === 'settings') {
    return (
      <section className="space-y-2.5">
        <h2 className="px-1 font-extrabold text-ink">{t.support.title}</h2>
        <div className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-surface border border-line">
          <p className="text-sm font-medium text-muted">{t.support.text}</p>
          {link}
        </div>
      </section>
    );
  }

  if (variant === 'home') {
    return (
      <section className="relative flex flex-col items-start gap-3 p-4 pr-12 rounded-3xl bg-surface border border-line">
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t.support.dismiss}
          className="absolute top-1.5 right-1.5 flex items-center justify-center w-11 h-11 rounded-full text-muted hover:bg-track"
        >
          <X size={18} />
        </button>
        <div className="space-y-1">
          <h2 className="font-extrabold text-ink">{t.support.title}</h2>
          <p className="text-sm font-medium text-muted">{t.support.text}</p>
        </div>
        {link}
      </section>
    );
  }

  // Après un quiz : une ligne discrète, sous les boutons
  return (
    <div className="flex flex-col items-center gap-2 pt-2 text-center">
      <p className="text-sm font-medium text-muted">{t.support.resultsText}</p>
      {link}
    </div>
  );
}
