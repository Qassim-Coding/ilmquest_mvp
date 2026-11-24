/**
 * Audios des Noms : un fichier par Nom, dans public/audio/noms/<id>.mp3 (id de names.ts).
 *
 * FICHIER RÉÉCRIT PAR outils/audio/integrer.mjs : ne pas le modifier à la main.
 *
 * Un Nom n'a de bouton « Écouter » que s'il figure ici. Tant que la liste est vide,
 * aucun bouton audio n'apparaît dans l'app (site web et app Android).
 * On n'y ajoute que des audios écoutés et validés (page d'écoute, voir outils/audio/LISEZMOI.md).
 *
 * Clé : id du Nom. Valeur : empreinte du fichier. Elle change quand le fichier change :
 * téléphones et navigateurs chargent alors le nouveau fichier au lieu de garder l'ancien en mémoire.
 */
export const NAME_AUDIO: Readonly<Record<number, string>> = {};
