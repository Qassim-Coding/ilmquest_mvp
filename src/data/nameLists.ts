import { namesOfAllah } from './names';
import { DivineName, NameListChoice, NameListId } from '../types';

/** Les deux listes de noms proposées dans l'app : Tirmidhî (référence) et Ajib.fr (ancienne liste, source à vérifier) */
export const NAME_LISTS: NameListId[] = ['tirmidhi', 'ilmquest'];

/** Choix possibles dans Paramètres, dans l'ordre d'affichage : une liste, ou les deux réunies */
export const NAME_LIST_CHOICES: NameListChoice[] = ['tirmidhi', 'ilmquest', 'all'];

/**
 * Liste suivie par défaut : la liste de Tirmidhî, liste de référence de l'app (décision de Qassim, 04.11.2026).
 * Un utilisateur qui n'a jamais choisi de liste suit celle-ci.
 */
export const DEFAULT_NAME_LIST: NameListChoice = 'tirmidhi';

/**
 * Ordre de la liste de Tirmidhî (Jâmi‘ at-Tirmidhî, n° 3507), par id, dans sa version la plus diffusée :
 * Ar-Rahmân en 1, As-Sabûr en 99, Al-Ahad après Al-Wâhid, sans « Allah ».
 */
export const TIRMIDHI_ORDER: number[] = [
  2, 3, 70, 74, 75, 46, 60, 61, 62, 63, 53, 54, 55, 6, 59,
  14, 21, 24, 25, 88, 89, 100, 101, 102, 103, 37, 38, 28, 104, 22,
  23, 8, 57, 5, 30, 83, 64, 50, 44, 45, 105, 12, 40, 43, 18,
  27, 16, 32, 106, 39, 76, 51, 78, 79, 33, 34, 107, 108, 109, 110,
  111, 66, 67, 112, 113, 97, 98, 96, 80, 82, 85, 86, 90, 91, 92,
  93, 114, 84, 26, 9, 115, 4, 7, 116, 117, 118, 119, 11, 120, 121,
  122, 123, 124, 125, 126, 127, 68, 128, 129
];

const byId = new Map(namesOfAllah.map(name => [name.id, name]));

const ilmquestNames = namesOfAllah.filter(name => name.lists.includes('ilmquest'));
const tirmidhiNames = TIRMIDHI_ORDER.map(id => byId.get(id)).filter((name): name is DivineName => name !== undefined);
// Les deux listes réunies : la liste de Tirmidhî (référence), puis les noms propres à la liste Ajib.fr
const allNames = [...tirmidhiNames, ...ilmquestNames.filter(name => !name.lists.includes('tirmidhi'))];

const NAMES_BY_CHOICE: Record<NameListChoice, DivineName[]> = {
  ilmquest: ilmquestNames,
  tirmidhi: tirmidhiNames,
  all: allNames,
};

/** Noms d'une liste, dans l'ordre de cette liste */
export function getListNames(choice: NameListChoice): DivineName[] {
  return NAMES_BY_CHOICE[choice] ?? tirmidhiNames;
}

/** Nombre de noms présents dans les deux listes */
export const SHARED_NAMES_COUNT = namesOfAllah.filter(name => name.lists.length === 2).length;

/** Nombre de noms propres à une liste */
export function ownNamesCount(list: NameListId): number {
  return namesOfAllah.filter(name => name.lists.length === 1 && name.lists[0] === list).length;
}

/** Vrai si la valeur enregistrée sur le téléphone est un choix de liste valable */
export function isNameListChoice(value: unknown): value is NameListChoice {
  return value === 'ilmquest' || value === 'tirmidhi' || value === 'all';
}
