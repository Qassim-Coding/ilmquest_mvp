/**
 * Bouton retour du téléphone Android (bouton ◁ ou geste retour), dans l'app Android seulement.
 * Sur le site web et sur iPhone, ce fichier ne fait rien.
 *
 * Règle : le bouton retour du téléphone fait la même chose que le bouton « Retour » ou « Arrêter » affiché à l'écran,
 * et remonte d'un écran à chaque appui jusqu'à l'Accueil.
 * 1. Un sous-écran est ouvert (un QCM ou un défi en cours, ses résultats, une page des Paramètres,
 *    la fenêtre « Voulez-vous quitter ? ») : il se ferme, comme avec sa croix ou sa flèche.
 *    Chaque écran le déclare avec useBackHandler.
 * 2. Sinon, App.tsx décide (useAndroidBackButton) : la fiche d'un nom revient à la liste,
 *    un autre onglet revient à l'Accueil, et sur l'Accueil la fenêtre « Voulez-vous quitter l'application ? » s'ouvre.
 * 3. Dans cette fenêtre, « Oui » ferme l'app (exitApp), « Non » ou un nouvel appui sur retour la referme.
 *
 * Il faut le module officiel @capacitor/app (npm install @capacitor/app@8.1.2, puis npx cap sync android).
 */
import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

type BackHandler = () => void;

// Sous-écrans ouverts en ce moment, le plus récent en dernier
const openSubScreens: { run: BackHandler }[] = [];

/** Vrai dans l'app Android quand le module @capacitor/app est bien installé */
function isAndroidApp(): boolean {
  return Capacitor.getPlatform() === 'android' && Capacitor.isPluginAvailable('App');
}

/**
 * À appeler dans un écran qui a un sous-écran.
 * Tant que `active` est vrai, le bouton retour appelle `handler` (par exemple : arrêter le QCM en cours).
 */
export function useBackHandler(active: boolean, handler: BackHandler): void {
  // Toujours la dernière version de handler, sans réinscrire l'écran à chaque affichage
  const latest = useRef(handler);
  useEffect(() => {
    latest.current = handler;
  });

  useEffect(() => {
    if (!active) return;
    const entry = { run: () => latest.current() };
    openSubScreens.push(entry);
    return () => {
      const index = openSubScreens.indexOf(entry);
      if (index !== -1) openSubScreens.splice(index, 1);
    };
  }, [active]);
}

/**
 * À appeler une seule fois, dans App.tsx.
 * `fallback` sert quand aucun sous-écran n'est ouvert : il revient en arrière et renvoie true,
 * ou renvoie false s'il n'y a plus rien à faire : l'app passe alors en arrière-plan.
 */
export function useAndroidBackButton(fallback: () => boolean): void {
  const latest = useRef(fallback);
  useEffect(() => {
    latest.current = fallback;
  });

  useEffect(() => {
    // Rien à faire hors de l'app Android, ou si le module @capacitor/app n'est pas installé
    if (!isAndroidApp()) return;

    const listener = App.addListener('backButton', () => {
      const subScreen = openSubScreens[openSubScreens.length - 1];
      if (subScreen) {
        subScreen.run();
      } else if (!latest.current()) {
        App.minimizeApp().catch(() => {});
      }
    });

    return () => {
      listener.then(handle => handle.remove()).catch(() => {});
    };
  }, []);
}

/** « Oui » dans la fenêtre « Voulez-vous quitter l'application ? » : ferme l'app Android */
export function exitApp(): void {
  if (!isAndroidApp()) return;
  App.exitApp().catch(() => {});
}
