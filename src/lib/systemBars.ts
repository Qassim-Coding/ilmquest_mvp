/**
 * Couleur de l'heure, de la batterie et des boutons du téléphone, dans l'app Android (et plus tard iPhone).
 * Ils suivent le thème choisi dans l'app, pas celui du téléphone :
 * - thème sombre → icônes claires ;
 * - thème clair → icônes foncées.
 * Sans ça, un téléphone en mode sombre avec l'app en thème clair afficherait des icônes blanches sur fond clair, illisibles.
 *
 * SystemBars fait partie de Capacitor (@capacitor/core) : aucun module à installer.
 * Sur le site web, cette fonction ne fait rien.
 */
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';

export function applySystemBarsStyle(isDarkMode: boolean): void {
  if (!Capacitor.isNativePlatform()) return;
  SystemBars.setStyle({ style: isDarkMode ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => {});
}
