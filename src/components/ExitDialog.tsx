import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useBackHandler } from '../lib/backButton';

interface ExitDialogProps {
  /** « Oui » : l'app se ferme */
  onQuit: () => void;
  /** « Non », appui sur le fond sombre ou nouvel appui sur le bouton retour : on reste dans l'app */
  onStay: () => void;
}

/**
 * Fenêtre « Voulez-vous quitter l'application ? » (app Android).
 * Elle s'ouvre quand on appuie sur le bouton retour du téléphone depuis l'Accueil (voir src/lib/backButton.ts).
 * « Non » est le bouton principal : un appui par erreur ne ferme pas l'app.
 */
export default function ExitDialog({ onQuit, onStay }: ExitDialogProps) {
  const { t } = useLanguage();

  // Fenêtre ouverte : le bouton retour du téléphone la ferme, comme « Non »
  useBackHandler(true, onStay);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/60"
      onClick={onStay}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="exit-dialog-title"
        aria-describedby="exit-dialog-text"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        /* Un appui dans la fenêtre ne la ferme pas : seul le fond sombre la ferme */
        onClick={(event: { stopPropagation: () => void }) => event.stopPropagation()}
        className="w-full max-w-sm p-6 rounded-3xl bg-surface border border-line shadow-xl space-y-5"
      >
        <div className="space-y-1.5 text-center">
          <h2 id="exit-dialog-title" className="text-xl font-extrabold text-ink">{t.exitDialog.title}</h2>
          <p id="exit-dialog-text" className="font-medium text-muted">{t.exitDialog.text}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onQuit}
            className="h-12 rounded-2xl bg-surface border-2 border-line text-ink font-extrabold hover:bg-track transition-colors"
          >
            {t.exitDialog.yes}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onStay}
            className="h-12 rounded-2xl bg-primary text-on-primary font-extrabold hover:bg-primary-hover transition-colors"
          >
            {t.exitDialog.no}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
