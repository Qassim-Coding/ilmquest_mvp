const plural = (n: number, one: string, many: string) => (n > 1 ? many : one);

export const translations = {
  fr: {
    appTitle: "IlmQuest",
    nav: { home: "Accueil", list: "Liste", cards: "Cartes", quiz: "QCM", challenge: "Défi", settings: "Paramètres" },
    navLabel: "Navigation principale",
    xp: "XP",
    levels: { new: "Nouveau", learning: "En cours", familiar: "Familier", mastered: "Acquis" },
    home: {
      welcome: "Bienvenue",
      subtitle: "Découvrez, apprenez et mémorisez les 99 Noms d'Allah à votre rythme.",
      nameOfTheDay: "Nom du jour",
      seeDetail: "Voir la fiche",
      progress: "Votre progression",
      mastered: "noms acquis",
      legendMastered: "acquis",
      legendLearning: "en cours",
      legendNew: "à découvrir",
      dailyReview: "Révision du jour",
      dueNames: (n: number) => `${n} ${plural(n, "nom à revoir", "noms à revoir")}`,
      nothingDue: "Rien à revoir pour l'instant",
      review: "Réviser",
      practice: "S'entraîner",
      features: "Que souhaitez-vous faire ?",
      goToList: "Parcourir et rechercher les noms",
      goToCards: "Mémoriser avec les cartes interactives",
      goToQuiz: "S'entraîner avec des questions à choix multiples",
      goToChallenge: "Tester vos connaissances",
      tileList: "Parcourir les noms",
      tileCards: "Mémoriser",
      tileQuiz: "S'entraîner",
      tileChallenge: "Tester vos connaissances"
    },
    list: {
      title: "Les 99 Noms d'Allah",
      search: "Rechercher un nom...",
      searchLabel: "Rechercher un nom",
      summary: (mastered: number, learning: number, toDiscover: number) =>
        `${mastered} acquis · ${learning} en cours · ${toDiscover} à découvrir`,
      filterLabel: "Filtrer",
      all: "Tous · 99",
      mastered: "Acquis",
      learning: "En cours",
      favorites: "Favoris",
      empty: "Aucun nom ne correspond à votre recherche.",
      emptyFavorites: "Aucun favori pour l'instant. Ajoutez-en depuis la fiche d'un nom."
    },
    detail: {
      back: "Retour à la liste",
      position: (id: number) => `Nom ${id} / 99`,
      addFavorite: "Ajouter aux favoris",
      removeFavorite: "Retirer des favoris",
      previous: "Nom précédent",
      next: "Nom suivant",
      mastery: "Votre maîtrise",
      nextReview: (days: number | null) =>
        days === null ? "Pas encore révisé"
          : days === 0 ? "Prochaine révision : aujourd'hui"
          : days === 1 ? "Prochaine révision : demain"
          : `Prochaine révision : dans ${days} jours`,
      answers: (total: number, correct: number) =>
        `${total} ${plural(total, "réponse", "réponses")} · ${correct} ${plural(correct, "juste", "justes")}`,
      noAnswers: "Aucune réponse pour l'instant",
      note: "Ma note personnelle",
      notePlaceholder: "Ajoutez une note pour vous souvenir de ce nom…",
      seeCard: "Voir en carte",
      reviewName: "Réviser ce nom"
    },
    cards: {
      front: "Recto:", back: "Verso:",
      frontLabel: "Recto", backLabel: "Verso",
      arabic: "Arabe", transliteration: "Translitéré", meaning: "Traduction",
      name: "Nom", mastered: "Acquis", markMastered: "Marquer comme acquis",
      clickToFlip: "Cliquez pour retourner", prev: "Précédent", next: "Suivant",
      swap: "Inverser recto et verso",
      flip: "Retourner la carte",
      toReview: "À revoir",
      iKnew: "Je le savais"
    },
    qcm: {
      title: "QCM", subtitle: "Choisissez votre façon de réviser",
      start: "Démarrer le QCM",
      challengeMode: "Mode Challenge", classicMode: "QCM Classique",
      question: "Question", meaningQuestion: "Quelle est la signification de ce nom ?",
      reverseQuestion: "Quel nom correspond à cette signification ?",
      finalScore: "Score Final", correctAnswers: "bonnes réponses sur",
      restart: "Recommencer", finish: "Terminer", next: "Suivant", stop: "Arrêter",
      modes: {
        classic: { title: "Classique", label: "QCM classique · arabe → sens" },
        reverse: { title: "Inversé", label: "QCM inversé · sens → arabe" },
        smart: { title: "Révision intelligente", label: "Révision intelligente" },
        mistakes: { title: "Mes erreurs", label: "Mes erreurs" },
        favorites: { title: "Favoris", label: "Mes favoris" }
      },
      modeSub: {
        classic: "Arabe → signification",
        reverse: "Signification → arabe",
        smart: (due: number) => due > 0 ? `${due} ${plural(due, "nom à revoir", "noms à revoir")} aujourd'hui` : "Les noms à revoir passent en premier",
        mistakes: (n: number) => n > 0 ? `${n} ${plural(n, "nom raté", "noms ratés")} récemment` : "Aucune erreur pour l'instant",
        favorites: (n: number) => n > 0 ? `${n} ${plural(n, "nom enregistré", "noms enregistrés")}` : "Aucun favori pour l'instant"
      },
      recommended: "Recommandé",
      isNew: "Nouveau",
      countTitle: "Nombre de noms",
      random: "Tirés au hasard",
      helper: {
        all: "Les noms sont tirés au hasard parmi les 99.",
        smart: "Les noms à revoir passent en premier, le reste est tiré au hasard.",
        mistakes: (n: number) => `Tirés au hasard parmi vos noms ratés (${n} pour l'instant).`,
        favorites: (n: number) => `Tirés au hasard parmi vos favoris (${n} pour l'instant).`
      },
      emptyPool: "Il n'y a encore aucun nom dans cette sélection.",
      startCount: (n: number) => `Démarrer · ${n} ${plural(n, "nom", "noms")}`,
      combo: (n: number) => `Combo ×${n}`,
      correctTitle: "Bonne réponse !",
      wrongTitle: "Pas cette fois",
      rightAnswer: (answer: string) => `Bonne réponse : ${answer}`,
      addedToMistakes: "Ce nom est ajouté à « Mes erreurs » pour votre prochaine révision."
    },
    challenge: {
      title: "Défi", subtitle: "Testez vos connaissances sur les 99 noms d'Allah",
      bestScore: "Meilleur score", completed: "Défis terminés",
      record: "Record en 60 s",
      chooseCount: "Choisissez le nombre de questions", start: "Démarrer le Challenge",
      typeLabel: "Type de défi",
      classic: "Classique", timed: "Contre la montre",
      timedTitle: "60 secondes chrono",
      timedDesc: "Trouvez le sens d'un maximum de noms tirés au hasard. Chaque bonne réponse ajoute 2 secondes.",
      startClassic: "Démarrer le défi",
      startTimed: "Démarrer le chrono",
      timeLeft: (s: number) => `${s} s`,
      badges: "Vos badges",
      badgesCount: (earned: number, total: number) => `${earned} sur ${total}`,
      badgeNote: "Un badge gagné reste acquis, même après une pause.",
      badgeNames: (n: number) => `${n} noms`,
      badgeFirst: "1er défi",
      badgePerfect: "Sans faute",
      badgeStudy: (n: number) => `${n} jours d'étude`
    },
    results: {
      excellent: "Excellent travail !",
      good: "Bien joué !",
      keepGoing: "Continuez comme ça !",
      summary: (label: string, n: number) => `${label} · ${n} ${plural(n, "nom", "noms")}`,
      timedSummary: (n: number) => `Contre la montre · ${n} ${plural(n, "nom trouvé", "noms trouvés")}`,
      xp: "XP gagnés",
      accuracy: "Précision",
      newMastered: "Noms acquis",
      objectives: "Vos objectifs",
      masteredCount: (n: number) => `${n} / 99 noms acquis`,
      objective: (percent: number) => percent === 100 ? "Les 99 Noms appris" : `${percent} % des Noms appris`,
      reached: "Atteint !",
      newBadges: "Nouveau badge",
      toReview: (n: number) => `À revoir (${n})`,
      reviewMistakes: "Réviser mes erreurs",
      back: "Retour"
    },
    settings: {
      title: "Paramètres",
      theme: "Thème", light: "Clair", dark: "Sombre",
      lightSub: "Émeraude", darkSub: "Émeraude sombre",
      language: "Langue",
      textSize: "Taille du texte", small: "Petit", medium: "Moyen", large: "Grand",
      preview: "Aperçu",
      back: "Retour"
    }
  },
  en: {
    appTitle: "IlmQuest",
    nav: { home: "Home", list: "List", cards: "Cards", quiz: "Quiz", challenge: "Challenge", settings: "Settings" },
    navLabel: "Main navigation",
    xp: "XP",
    levels: { new: "New", learning: "Learning", familiar: "Familiar", mastered: "Mastered" },
    home: {
      welcome: "Welcome",
      subtitle: "Discover, learn and memorize the 99 Names of Allah at your own pace.",
      nameOfTheDay: "Name of the day",
      seeDetail: "Open",
      progress: "Your progress",
      mastered: "names mastered",
      legendMastered: "mastered",
      legendLearning: "learning",
      legendNew: "to discover",
      dailyReview: "Today's review",
      dueNames: (n: number) => `${n} ${plural(n, "name to review", "names to review")}`,
      nothingDue: "Nothing to review right now",
      review: "Review",
      practice: "Practice",
      features: "What would you like to do?",
      goToList: "Browse and search the names",
      goToCards: "Memorize with interactive flashcards",
      goToQuiz: "Practice with multiple choice questions",
      goToChallenge: "Test your knowledge",
      tileList: "Browse the names",
      tileCards: "Memorize",
      tileQuiz: "Practice",
      tileChallenge: "Test your knowledge"
    },
    list: {
      title: "The 99 Names of Allah",
      search: "Search for a name...",
      searchLabel: "Search for a name",
      summary: (mastered: number, learning: number, toDiscover: number) =>
        `${mastered} mastered · ${learning} learning · ${toDiscover} to discover`,
      filterLabel: "Filter",
      all: "All · 99",
      mastered: "Mastered",
      learning: "Learning",
      favorites: "Favorites",
      empty: "No name matches your search.",
      emptyFavorites: "No favorites yet. Add some from a name's page."
    },
    detail: {
      back: "Back to the list",
      position: (id: number) => `Name ${id} / 99`,
      addFavorite: "Add to favorites",
      removeFavorite: "Remove from favorites",
      previous: "Previous name",
      next: "Next name",
      mastery: "Your mastery",
      nextReview: (days: number | null) =>
        days === null ? "Not reviewed yet"
          : days === 0 ? "Next review: today"
          : days === 1 ? "Next review: tomorrow"
          : `Next review: in ${days} days`,
      answers: (total: number, correct: number) =>
        `${total} ${plural(total, "answer", "answers")} · ${correct} correct`,
      noAnswers: "No answers yet",
      note: "My personal note",
      notePlaceholder: "Add a note to help you remember this name…",
      seeCard: "Open as a card",
      reviewName: "Review this name"
    },
    cards: {
      front: "Front:", back: "Back:",
      frontLabel: "Front", backLabel: "Back",
      arabic: "Arabic", transliteration: "Transliteration", meaning: "Translation",
      name: "Name", mastered: "Mastered", markMastered: "Mark as mastered",
      clickToFlip: "Click to flip", prev: "Previous", next: "Next",
      swap: "Swap front and back",
      flip: "Flip the card",
      toReview: "Review again",
      iKnew: "I knew it"
    },
    qcm: {
      title: "Quiz", subtitle: "Choose how you want to review",
      start: "Start Quiz",
      challengeMode: "Challenge Mode", classicMode: "Classic Quiz",
      question: "Question", meaningQuestion: "What is the meaning of this name?",
      reverseQuestion: "Which name matches this meaning?",
      finalScore: "Final Score", correctAnswers: "correct answers out of",
      restart: "Restart", finish: "Finish", next: "Next", stop: "Stop",
      modes: {
        classic: { title: "Classic", label: "Classic quiz · Arabic → meaning" },
        reverse: { title: "Reverse", label: "Reverse quiz · meaning → Arabic" },
        smart: { title: "Smart review", label: "Smart review" },
        mistakes: { title: "My mistakes", label: "My mistakes" },
        favorites: { title: "Favorites", label: "My favorites" }
      },
      modeSub: {
        classic: "Arabic → meaning",
        reverse: "Meaning → Arabic",
        smart: (due: number) => due > 0 ? `${due} ${plural(due, "name", "names")} to review today` : "Names due for review come first",
        mistakes: (n: number) => n > 0 ? `${n} recently missed ${plural(n, "name", "names")}` : "No mistakes yet",
        favorites: (n: number) => n > 0 ? `${n} saved ${plural(n, "name", "names")}` : "No favorites yet"
      },
      recommended: "Recommended",
      isNew: "New",
      countTitle: "Number of names",
      random: "Picked at random",
      helper: {
        all: "Names are picked at random from the 99.",
        smart: "Names due for review come first, the rest are picked at random.",
        mistakes: (n: number) => `Picked at random from your missed names (${n} so far).`,
        favorites: (n: number) => `Picked at random from your favorites (${n} so far).`
      },
      emptyPool: "There are no names in this selection yet.",
      startCount: (n: number) => `Start · ${n} ${plural(n, "name", "names")}`,
      combo: (n: number) => `Combo ×${n}`,
      correctTitle: "Correct!",
      wrongTitle: "Not this time",
      rightAnswer: (answer: string) => `Correct answer: ${answer}`,
      addedToMistakes: "This name was added to \"My mistakes\" for your next review."
    },
    challenge: {
      title: "Challenge", subtitle: "Test your knowledge of the 99 names of Allah",
      bestScore: "Best score", completed: "Challenges completed",
      record: "Record in 60 s",
      chooseCount: "Choose the number of questions", start: "Start Challenge",
      typeLabel: "Challenge type",
      classic: "Classic", timed: "Against the clock",
      timedTitle: "60-second sprint",
      timedDesc: "Find the meaning of as many random names as you can. Each correct answer adds 2 seconds.",
      startClassic: "Start the challenge",
      startTimed: "Start the clock",
      timeLeft: (s: number) => `${s} s`,
      badges: "Your badges",
      badgesCount: (earned: number, total: number) => `${earned} of ${total}`,
      badgeNote: "A badge you earn is yours to keep, even after a break.",
      badgeNames: (n: number) => `${n} names`,
      badgeFirst: "1st challenge",
      badgePerfect: "Perfect score",
      badgeStudy: (n: number) => `${n} study days`
    },
    results: {
      excellent: "Excellent work!",
      good: "Well done!",
      keepGoing: "Keep it up!",
      summary: (label: string, n: number) => `${label} · ${n} ${plural(n, "name", "names")}`,
      timedSummary: (n: number) => `Against the clock · ${n} ${plural(n, "name", "names")} found`,
      xp: "XP earned",
      accuracy: "Accuracy",
      newMastered: "Names mastered",
      objectives: "Your goals",
      masteredCount: (n: number) => `${n} / 99 names mastered`,
      objective: (percent: number) => percent === 100 ? "All 99 Names learned" : `${percent}% of the Names learned`,
      reached: "Reached!",
      newBadges: "New badge",
      toReview: (n: number) => `To review (${n})`,
      reviewMistakes: "Review my mistakes",
      back: "Back"
    },
    settings: {
      title: "Settings",
      theme: "Theme", light: "Light", dark: "Dark",
      lightSub: "Emerald", darkSub: "Dark emerald",
      language: "Language",
      textSize: "Text Size", small: "Small", medium: "Medium", large: "Large",
      preview: "Preview",
      back: "Back"
    }
  }
};

export type Language = 'fr' | 'en';
export type Translations = typeof translations.fr;
