# Audio des 99 Noms : de l'enregistrement à l'app

Une seule voix, celle de la personne choisie, et un fichier par Nom.
Dans l'app, un Nom n'a de bouton « Écouter » que s'il est listé dans `src/data/nameAudio.ts`.
Tant que ce fichier est vide, rien ne change pour les utilisateurs.

## Les étapes

1. **Enregistrement** (la personne choisie, avec la feuille PDF `IlmQuest_Enregistrement_99_Noms`).
   9 fichiers, un par bloc de 11 Noms, nommés « Bloc 1 » à « Bloc 9 ».
   2 secondes de silence entre deux Noms, sans numéro ni commentaire.
   Une erreur ou une hésitation : on refait tout le bloc.
2. **Envoi à Claude** : les fichiers originaux, par Google Drive ou WhatsApp en « document » (pas en message vocal).
3. **Découpage** (Claude) :
   `node outils/audio/decouper.mjs <dossier des enregistrements>`
   - un fichier par Nom : `audio-travail/clips/01.mp3` à `99.mp3` (numéro de la feuille) ;
   - un rapport : `audio-travail/rapport.txt` (blocs découpés ou non, et pourquoi, Noms à écouter de près) ;
   - la page d'écoute : `audio-travail/ecoute/index.html`.
4. **Écoute** (Qassim et la personne choisie) : sur la page d'écoute, chaque Nom est noté ✓ Bon ou ↻ À refaire.
   Ensuite, « Copier le résultat » et envoyer le texte à Claude.
5. **Noms à refaire** : la personne les lit à la suite, dans l'ordre croissant des numéros, avec 2 secondes de silence entre deux Noms.
   `node outils/audio/decouper.mjs --noms 12,45 <fichier>`, puis nouvelle écoute de ces Noms.
6. **Intégration** (Claude) :
   `node outils/audio/integrer.mjs` (ou `--sauf 12,45` pour laisser de côté des Noms encore à refaire)
   - copie les fichiers validés vers `public/audio/noms/<id>.mp3` (id du Nom dans `names.ts`) ;
   - réécrit `src/data/nameAudio.ts` : chaque Nom listé reçoit son bouton « Écouter ».
   Ensuite : commit, test sur le site et le téléphone, fusion dans `main`.

## Les fichiers de ce dossier

| Fichier | Rôle |
| --- | --- |
| `decouper.mjs` | Découpe les enregistrements (volume réglé, repérage des pauses, un MP3 par Nom), écrit le rapport et la page d'écoute. |
| `ecoute.mjs` | Fabrique la page d'écoute. Seul : `node outils/audio/ecoute.mjs` la refait à partir des fichiers déjà découpés. |
| `integrer.mjs` | Met les audios validés dans l'app et réécrit `src/data/nameAudio.ts`. |
| `noms.mjs` | Lit les 99 Noms (ordre de Tirmidhî, arabe vocalisé, sens) directement dans `src/data` : les outils utilisent toujours les textes de l'app. |

`audio-travail/` est le dossier de travail. Il n'est jamais envoyé sur GitHub (voir `.gitignore`).

## Comment le découpage trouve les Noms

1. Le son passe en mono, sans les basses inutiles (souffle, vibrations).
2. Le volume est réglé sur tout le bloc (norme EBU R128, -16 LUFS) : tous les Noms sonnent aussi fort.
3. Le bruit de fond et le niveau de la voix sont mesurés. Au-dessus d'un seuil entre les deux, on entend la voix.
   Les clics et souffles très courts sont ignorés.
4. Il faut entendre exactement 11 passages séparés par une vraie pause (0,9 s ou plus).
   Ces pauses doivent être nettement plus longues que les petites pauses à l'intérieur d'un Nom (ex. Dhû l-Jalâli / wa l-Ikrâm).
   Sinon le bloc n'est pas découpé, et le rapport dit pourquoi.
5. Chaque Nom garde une petite marge avant et après la voix, avec un fondu très court.
   Il est enregistré en MP3 mono 96 kb/s (environ 15 à 25 Ko par Nom, 2 Mo pour les 99).

## Pour les lancer soi-même

Il faut Node, `npm install` déjà fait dans le projet, et ffmpeg (sous Windows : `winget install ffmpeg`).
En pratique, c'est Claude qui lance le découpage et l'intégration, puis livre les fichiers.
