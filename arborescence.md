# Arborescence du projet IlmQuest

Voici la structure détaillée des fichiers et dossiers composant l'application **IlmQuest**.

```text
/
├── index.html                  # Point d'entrée HTML de l'application
├── metadata.json               # Métadonnées de l'application (Nom, description)
├── package.json                # Dépendances et scripts du projet
├── README.md                   # Documentation et but de l'application
├── arborescence.md             # Structure du projet (ce fichier)
│
└── src/                        # Code source principal
    ├── main.tsx                # Point d'entrée React
    ├── App.tsx                 # Composant racine (Routage interne, Layout principal)
    ├── index.css               # Styles globaux et configuration Tailwind CSS
    │
    ├── components/             # Composants UI réutilisables
    │   ├── Home.tsx            # Tableau de bord / Page d'accueil
    │   ├── NamesList.tsx       # Vue Liste avec barre de recherche
    │   ├── Flashcards.tsx      # Vue Cartes de mémorisation interactives
    │   ├── Qcm.tsx             # Menu de sélection pour le QCM Classique
    │   ├── Challenge.tsx       # Menu de sélection pour le Mode Défi
    │   ├── QuizEngine.tsx      # Moteur logique partagé pour les QCM et Défis
    │   ├── Settings.tsx        # Vue Paramètres (Thème, Langue, Taille du texte)
    │   └── Layout.tsx          # Composant de mise en page (si utilisé)
    │
    ├── context/                # Gestionnaires d'état global (React Context)
    │   ├── LanguageContext.tsx # Gère la langue (FR/EN) et les traductions
    │   ├── PreferencesContext.tsx # Gère le thème (Clair/Sombre) et la taille du texte
    │   ├── ProgressContext.tsx # Gère la sauvegarde des scores et des noms acquis
    │   └── SettingsContext.tsx # (Ancien contexte ou utilitaire de paramètres)
    │
    ├── data/                   # Données statiques
    │   └── names.ts            # Base de données des 99 Noms (Arabe, Translittération, Sens)
    │
    ├── i18n/                   # Internationalisation
    │   └── translations.ts     # Dictionnaire des textes de l'interface (FR/EN)
    │
    ├── services/               # Services externes ou logiques métier complexes
    │
    └── types/                  # Définitions de types TypeScript globaux
```

## Description des dossiers clés

- **`components/`** : Contient toutes les "vues" de l'application. `QuizEngine.tsx` est particulièrement important car il centralise la logique des questions/réponses partagée par `Qcm.tsx` et `Challenge.tsx`.
- **`context/`** : Utilise l'API Context de React couplée au `localStorage` du navigateur pour s'assurer que les préférences de l'utilisateur (langue, thème, progression) persistent même s'il ferme l'application.
- **`data/`** : Contient le fichier `names.ts` qui est le cœur du contenu de l'application (les 99 Noms d'Allah).
- **`i18n/`** : Sépare les textes de l'interface du code logique, permettant d'ajouter facilement de nouvelles langues à l'avenir.
