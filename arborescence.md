# Arborescence du projet IlmQuest

Voici la structure des fichiers et dossiers qui composent l'application **IlmQuest**.
Les dossiers générés (`node_modules/`, `dist/`) ne sont pas listés.

```text
/
├── .env.example                # Exemple de variables d'environnement
├── .gitignore                  # Fichiers exclus du dépôt
├── arborescence.md             # Structure du projet (ce fichier)
├── capacitor.config.ts         # Configuration Capacitor (emballage mobile, webDir: dist)
├── index.html                  # Point d'entrée HTML
├── LISEZMOI-etape3.txt         # Note de livraison : police arabe, voyelles, icônes
├── metadata.json               # Métadonnées de l'application (nom, description)
├── package.json                # Dépendances et scripts
├── package-lock.json           # Versions figées des dépendances
├── README.md                   # Documentation et but de l'application
├── tsconfig.json               # Configuration TypeScript
├── vite.config.ts              # Configuration Vite, Tailwind et PWA
│
├── public/                     # Fichiers statiques servis tels quels
│   ├── apple-touch-icon.png    # Icône écran d'accueil iOS
│   ├── icon.svg                # Favicon
│   ├── logo_ilmquest_Epure.svg # Logo
│   ├── pwa-192.png             # Icône PWA 192 px
│   ├── pwa-512.png             # Icône PWA 512 px
│   └── pwa-maskable-512.png    # Icône PWA maskable 512 px
│
└── src/                        # Code source
    ├── main.tsx                # Point d'entrée React
    ├── App.tsx                 # Composant racine (onglets, en-tête, navigation)
    ├── index.css               # Styles globaux, tokens Tailwind, classes utilitaires
    │
    ├── components/             # Vues de l'application
    │   ├── AboutLists.tsx      # Page « Pourquoi deux listes ? » (depuis Paramètres)
    │   ├── BadgeIcon.tsx       # Pastille d'un badge
    │   ├── Challenge.tsx       # Défi classique et « Contre la montre » (3 niveaux)
    │   ├── Flashcards.tsx      # Cartes de mémorisation
    │   ├── Home.tsx            # Accueil, nom du jour, progression
    │   ├── Layout.tsx          # Ancien habillage, non branché sur App.tsx
    │   ├── NameDetail.tsx      # Fiche d'un nom
    │   ├── NamesList.tsx       # Liste, recherche et filtres
    │   ├── Qcm.tsx             # Menu du QCM
    │   ├── QuizEngine.tsx      # Moteur partagé par le QCM et le Défi
    │   ├── QuizResults.tsx     # Écran de résultats (score, XP, badges)
    │   └── Settings.tsx        # Paramètres (thème, langue, liste, voyelles, texte)
    │
    ├── context/                # État global (React Context + localStorage)
    │   ├── LanguageContext.tsx    # Langue active (fr/en), clé 99names_lang
    │   ├── PreferencesContext.tsx # Thème, taille du texte, liste suivie, voyelles
    │   ├── ProgressContext.tsx    # Maîtrise, scores, badges, XP
    │   └── SettingsContext.tsx    # Ancien contexte, non branché sur App.tsx
    │
    ├── data/                   # Contenu des noms
    │   ├── names.ts            # Tous les noms (arabe, translittération, sens, listes)
    │   ├── nameLists.ts        # Ordre Tirmidhî, assemblage Ajib.fr / Tirmidhî / les deux
    │   └── namesVocalized.ts   # Forme vocalisée de chaque nom, par id
    │
    ├── i18n/                   # Textes de l'interface
    │   └── translations.ts     # Dictionnaire français et anglais
    │
    ├── lib/                    # Logique partagée par les vues
    │   ├── activeNames.ts      # Noms de la liste choisie dans Paramètres
    │   ├── arabic.ts           # Affichage arabe avec ou sans voyelles
    │   ├── learning.ts         # Maîtrise, révision, questions, badges, records chrono
    │   ├── levelStyles.ts      # Couleurs des étiquettes de maîtrise et de liste
    │   └── search.ts           # Recherche de la Liste (latin, arabe, voyelles)
    │
    └── types/                  # Types TypeScript
        └── index.ts            # DivineName, UserProgress, listes, modes de quiz
```

## Dossiers clés

- **`components/`** : les vues. `QuizEngine.tsx` porte les questions, partagé par `Qcm.tsx` et `Challenge.tsx`. `QuizResults.tsx` affiche le score. `Layout.tsx` date d'une ancienne coquille et n'est pas utilisé par `App.tsx`.
- **`context/`** : langue, préférences et progression, persistées dans le `localStorage`. `SettingsContext.tsx` est l'ancien système (clés `lang`, `theme`, `textSize`) et n'est plus monté.
- **`data/`** : `names.ts` contient tous les noms et le champ `lists` (`ilmquest` = Ajib.fr, `tirmidhi` = at-Tirmidhî). `nameLists.ts` fixe l'ordre de Tirmidhî et assemble la liste suivie. `namesVocalized.ts` ajoute les voyelles sans modifier `names.ts`.
- **`lib/`** : ce que les écrans partagent. `activeNames.ts` est le passage obligé vers la liste choisie. `learning.ts` calcule maîtrise, révision espacée, questions, badges et records du chrono.
- **`i18n/`** : textes d'interface séparés du code, en français et en anglais.
- **`public/`** : logo, favicon et icônes PWA. Le manifeste, dans `vite.config.ts`, pointe vers ces icônes.
