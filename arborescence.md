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
├── metadata.json               # Métadonnées de l'application (nom, description)
├── package.json                # Dépendances et scripts
├── package-lock.json           # Versions figées des dépendances
├── README.md                   # Documentation et but de l'application
├── tsconfig.json               # Configuration TypeScript
├── vite.config.ts              # Configuration Vite, Tailwind et PWA
│
├── public/                     # Fichiers statiques servis tels quels
│   ├── icon.svg                # Icône de l'application (PWA, favicon)
│   └── logo_ilmquest_Epure.svg # Logo
│
└── src/                        # Code source
    ├── main.tsx                # Point d'entrée React
    ├── App.tsx                 # Composant racine (onglets, en-tête, navigation)
    ├── index.css               # Styles globaux, tokens Tailwind, classes utilitaires
    │
    ├── components/             # Vues de l'application
    │   ├── Home.tsx            # Accueil et progression
    │   ├── NamesList.tsx       # Liste avec recherche
    │   ├── Flashcards.tsx      # Cartes de mémorisation
    │   ├── Qcm.tsx             # Menu du QCM classique
    │   ├── Challenge.tsx       # Menu du mode Défi
    │   ├── QuizEngine.tsx      # Moteur partagé par le QCM et le Défi
    │   ├── Settings.tsx        # Paramètres (thème, langue, taille du texte)
    │   └── Layout.tsx          # Ancien habillage, non branché sur App.tsx
    │
    ├── context/                # État global (React Context + localStorage)
    │   ├── LanguageContext.tsx    # Langue active (fr/en), clé 99names_lang
    │   ├── PreferencesContext.tsx # Thème et taille du texte
    │   ├── ProgressContext.tsx    # Noms acquis et scores de défi
    │   └── SettingsContext.tsx    # Ancien contexte, non branché sur App.tsx
    │
    ├── data/                   # Contenu statique
    │   └── names.ts            # Les 99 noms (arabe, translittération, sens fr/en)
    │
    ├── i18n/                   # Textes de l'interface
    │   └── translations.ts     # Dictionnaire français et anglais
    │
    └── types/                  # Types TypeScript
        └── index.ts            # DivineName, UserProgress, modes de quiz
```

## Dossiers clés

- **`components/`** : les vues. `QuizEngine.tsx` porte la logique des questions, partagée par `Qcm.tsx` et `Challenge.tsx`. `Layout.tsx` date d'une ancienne coquille et n'est pas utilisé par `App.tsx`.
- **`context/`** : langue, préférences et progression, persistées dans le `localStorage`. `SettingsContext.tsx` est l'ancien système (clés `lang`, `theme`, `textSize`) et n'est plus monté.
- **`data/`** : `names.ts`, source unique des 99 noms.
- **`i18n/`** : textes d'interface séparés du code, en français et en anglais.
- **`public/`** : icône et logo. Le manifeste PWA, dans `vite.config.ts`, pointe vers `icon.svg`.
