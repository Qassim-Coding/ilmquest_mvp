import { usePreferences } from '../context/PreferencesContext';
import { getListNames } from '../data/nameLists';
import { DivineName, NameListChoice } from '../types';

/**
 * Noms de la liste suivie (réglage « Liste des Noms » dans Paramètres), dans l'ordre de cette liste.
 * Tous les écrans passent par ici : Liste, Fiche, Cartes, QCM, Défi, Accueil, Résultats.
 */
export function useActiveNames(): { choice: NameListChoice; names: DivineName[] } {
  const { nameList } = usePreferences();
  return { choice: nameList, names: getListNames(nameList) };
}
