export const translations = {
  fr: {
    appTitle: "IlmQuest",
    nav: { home: "Accueil", list: "Liste", cards: "Cartes", quiz: "QCM", challenge: "Défi", settings: "Paramètres" },
    home: {
      welcome: "Bienvenue",
      subtitle: "Découvrez, apprenez et mémorisez les 99 Noms d'Allah à votre rythme.",
      progress: "Votre progression",
      mastered: "noms acquis",
      features: "Que souhaitez-vous faire ?",
      goToList: "Parcourir et rechercher les noms",
      goToCards: "Mémoriser avec les cartes interactives",
      goToQuiz: "S'entraîner avec des questions à choix multiples",
      goToChallenge: "Tester vos connaissances"
    },
    list: { title: "Les 99 Noms d'Allah", search: "Rechercher un nom..." },
    cards: {
      front: "Recto:", back: "Verso:",
      arabic: "Arabe", transliteration: "Translitéré", meaning: "Traduction",
      name: "Nom", mastered: "Acquis", markMastered: "Marquer comme acquis",
      clickToFlip: "Cliquez pour retourner", prev: "Précédent", next: "Suivant"
    },
    qcm: {
      title: "QCM Classique", subtitle: "Entraînez-vous à reconnaître la signification des noms",
      start: "Démarrer le QCM",
      challengeMode: "Mode Challenge", classicMode: "QCM Classique",
      question: "Question", meaningQuestion: "Quelle est la signification de ce nom ?",
      finalScore: "Score Final", correctAnswers: "bonnes réponses sur",
      restart: "Recommencer", finish: "Terminer", next: "Suivant", stop: "Arrêter"
    },
    challenge: {
      title: "Mode Challenge", subtitle: "Testez vos connaissances sur les 99 noms d'Allah",
      bestScore: "Meilleur Score", completed: "Défis terminés",
      chooseCount: "Choisissez le nombre de questions", start: "Démarrer le Challenge"
    },
    settings: {
      title: "Paramètres",
      theme: "Thème", light: "Clair", dark: "Sombre",
      language: "Langue",
      textSize: "Taille du texte", small: "Petit", medium: "Moyen", large: "Grand"
    }
  },
  en: {
    appTitle: "IlmQuest",
    nav: { home: "Home", list: "List", cards: "Cards", quiz: "Quiz", challenge: "Challenge", settings: "Settings" },
    home: {
      welcome: "Welcome",
      subtitle: "Discover, learn and memorize the 99 Names of Allah at your own pace.",
      progress: "Your progress",
      mastered: "names mastered",
      features: "What would you like to do?",
      goToList: "Browse and search the names",
      goToCards: "Memorize with interactive flashcards",
      goToQuiz: "Practice with multiple choice questions",
      goToChallenge: "Test your knowledge"
    },
    list: { title: "The 99 Names of Allah", search: "Search for a name..." },
    cards: {
      front: "Front:", back: "Back:",
      arabic: "Arabic", transliteration: "Transliteration", meaning: "Translation",
      name: "Name", mastered: "Mastered", markMastered: "Mark as mastered",
      clickToFlip: "Click to flip", prev: "Previous", next: "Next"
    },
    qcm: {
      title: "Classic Quiz", subtitle: "Practice recognizing the meaning of the names",
      start: "Start Quiz",
      challengeMode: "Challenge Mode", classicMode: "Classic Quiz",
      question: "Question", meaningQuestion: "What is the meaning of this name?",
      finalScore: "Final Score", correctAnswers: "correct answers out of",
      restart: "Restart", finish: "Finish", next: "Next", stop: "Stop"
    },
    challenge: {
      title: "Challenge Mode", subtitle: "Test your knowledge of the 99 names of Allah",
      bestScore: "Best Score", completed: "Challenges completed",
      chooseCount: "Choose the number of questions", start: "Start Challenge"
    },
    settings: {
      title: "Settings",
      theme: "Theme", light: "Light", dark: "Dark",
      language: "Language",
      textSize: "Text Size", small: "Small", medium: "Medium", large: "Large"
    }
  }
};

export type Language = 'fr' | 'en';
