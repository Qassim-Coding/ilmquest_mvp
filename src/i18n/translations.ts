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
      followedList: (label: string) => `Liste suivie : ${label}`,
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
      title: (total: number) => (total === 99 ? "Les 99 Noms d'Allah" : "Les Noms d'Allah"),
      search: "Rechercher un nom...",
      searchLabel: "Rechercher un nom",
      summary: (mastered: number, learning: number, toDiscover: number) =>
        `${mastered} acquis · ${learning} en cours · ${toDiscover} à découvrir`,
      filterLabel: "Filtrer",
      all: (total: number) => `Tous · ${total}`,
      onlyIn: { ilmquest: "Ajib.fr", tirmidhi: "Tirmidhî" },
      mastered: "Acquis",
      learning: "En cours",
      favorites: "Favoris",
      empty: "Aucun nom ne correspond à votre recherche.",
      emptyFavorites: "Aucun favori pour l'instant. Ajoutez-en depuis la fiche d'un nom."
    },
    detail: {
      back: "Retour à la liste",
      position: (index: number, total: number) => `Nom ${index} / ${total}`,
      inLists: "Présent dans",
      onlyIn: {
        ilmquest: "Ce nom ne figure pas dans la liste de Tirmidhî.",
        tirmidhi: "Ce nom ne figure pas dans la liste Ajib.fr."
      },
      notInList: "Ce nom ne fait pas partie de la liste que vous suivez.",
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
        all: (total: number) => `Les noms sont tirés au hasard parmi les ${total} de votre liste.`,
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
      record: (level: string) => `Record · ${level}`,
      chooseCount: "Choisissez le nombre de questions", start: "Démarrer le Challenge",
      typeLabel: "Type de défi",
      classic: "Classique", timed: "Contre la montre",
      timedTitle: "60 secondes chrono",
      timedDesc: (seconds: number, reverse: boolean) =>
        reverse
          ? `Retrouvez le nom (arabe et translittération) d'un maximum de significations tirées au hasard. Chaque bonne réponse ajoute ${seconds} secondes.`
          : `Trouvez le sens d'un maximum de noms tirés au hasard. Chaque bonne réponse ajoute ${seconds} secondes.`,
      directionTitle: "Sens du quiz",
      directions: {
        classic: { title: "Arabe → sens", sub: "Trouvez la signification" },
        reverse: { title: "Sens → arabe", sub: "Trouvez le nom" }
      },
      levelTitle: "Difficulté",
      levels: { easy: "Facile", medium: "Moyen", hard: "Difficile" },
      bonus: (seconds: number) => `+${seconds} s`,
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
      timedSummary: (n: number, level: string) => `Contre la montre · ${level} · ${n} ${plural(n, "nom trouvé", "noms trouvés")}`,
      xp: "XP gagnés",
      accuracy: "Précision",
      newMastered: "Noms acquis",
      objectives: "Vos objectifs",
      masteredCount: (n: number, total: number) => `${n} / ${total} noms acquis`,
      objective: (percent: number, total: number) => (percent === 100 ? `Les ${total} Noms appris` : `${percent} % des Noms appris`),
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
      vowels: "Voyelles arabes",
      vowelsHint: "Affichez ou masquez les voyelles (harakat) sur les noms en arabe.",
      vowelsOn: "Avec voyelles", vowelsOff: "Sans voyelles",
      nameList: "Liste des Noms",
      nameListHint: "Les savants n'ont pas tous retenu la même liste de 99 noms. L'app suit par défaut la liste de Tirmidhî, la plus répandue.",
      listOptions: {
        tirmidhi: { title: "Liste de Tirmidhî", sub: (total: number) => `${total} noms · liste de référence de l'app` },
        ilmquest: { title: "Liste Ajib.fr", sub: (total: number) => `${total} noms · ancienne liste de l'app, source en cours de vérification` },
        all: { title: "Les deux listes", sub: (total: number) => `${total} noms · tous les noms réunis` }
      },
      aboutLists: "Pourquoi deux listes ?",
      preview: "Aperçu",
      back: "Retour"
    },
    support: {
      title: "Soutenir IlmQuest",
      text: "IlmQuest est gratuite et sans publicité. Si elle vous aide à apprendre les Noms d'Allah, vous pouvez soutenir son développement.",
      resultsText: "IlmQuest vous est utile ? Vous pouvez soutenir son développement.",
      button: "Soutenir l'app",
      linkLabel: "Soutenir l'app sur Buy Me a Coffee (s'ouvre dans un nouvel onglet)",
      dismiss: "Masquer"
    },
    listNames: { ilmquest: "Liste Ajib.fr", tirmidhi: "Liste de Tirmidhî", all: "Les deux listes" },
    about: {
      title: "Pourquoi deux listes ?",
      back: "Retour aux paramètres",
      hadithTitle: "Le hadith des 99 noms",
      hadith: "Le Prophète ﷺ a dit : « Allah a quatre-vingt-dix-neuf noms, cent moins un. Celui qui les dénombre entrera au Paradis. »",
      hadithRef: "Rapporté par al-Bukhârî (n° 2736) et Muslim (n° 2677).",
      hadithNote: "Ce hadith authentique ne donne pas la liste des noms. Les savants les ont donc recherchés dans le Coran et la Sunna, et leurs listes ne sont pas toutes identiques.",
      tirmidhiTitle: "La liste de Tirmidhî",
      tirmidhi: "C'est la liste la plus connue, et la liste de référence de l'app. Elle vient d'une version du hadith rapportée par at-Tirmidhî (n° 3507), qui énumère les noms. Plusieurs spécialistes du hadith, dont Ibn Hajar, estiment que cette énumération a été ajoutée par un transmetteur et ne vient pas du Prophète ﷺ. Elle reste la plus utilisée.",
      ilmquestTitle: "La liste Ajib.fr",
      ilmquest: "C'est l'ancienne liste de l'app. Elle est reprise du site francophone Ajib.fr (« Les 99 noms d'Allah Azawajal et leurs significations »), qui ne précise pas de quel savant elle provient : sa source est en cours de vérification. Elle contient des noms présents dans le Coran et dans des hadiths authentiques, dont certains absents de la liste de Tirmidhî, comme As-Sitîr, Ar-Rafîq ou At-Tayyib.",
      numbersTitle: "En chiffres",
      numberLabels: { shared: "en commun", ilmquest: "Ajib.fr seule", tirmidhi: "Tirmidhî seule" },
      numbers: (shared: number, ownIlmquest: number, ownTirmidhi: number) =>
        `${shared} noms sont communs aux deux listes. ${ownIlmquest} ne figurent que dans la liste Ajib.fr, ${ownTirmidhi} que dans la liste de Tirmidhî.`,
      inAppTitle: "Dans l'app",
      inApp: "Par défaut, l'app suit la liste de Tirmidhî. Vous pouvez en changer dans Paramètres : la Liste, les Cartes, le QCM, le Défi et votre progression s'y adaptent. Sur la fiche de chaque nom, une pastille indique dans quelle liste il figure. Changer de liste ne fait rien perdre : les noms communs gardent leur progression."
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
      followedList: (label: string) => `List followed: ${label}`,
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
      title: (total: number) => (total === 99 ? "The 99 Names of Allah" : "The Names of Allah"),
      search: "Search for a name...",
      searchLabel: "Search for a name",
      summary: (mastered: number, learning: number, toDiscover: number) =>
        `${mastered} mastered · ${learning} learning · ${toDiscover} to discover`,
      filterLabel: "Filter",
      all: (total: number) => `All · ${total}`,
      onlyIn: { ilmquest: "Ajib.fr", tirmidhi: "Tirmidhi" },
      mastered: "Mastered",
      learning: "Learning",
      favorites: "Favorites",
      empty: "No name matches your search.",
      emptyFavorites: "No favorites yet. Add some from a name's page."
    },
    detail: {
      back: "Back to the list",
      position: (index: number, total: number) => `Name ${index} / ${total}`,
      inLists: "Found in",
      onlyIn: {
        ilmquest: "This name is not in the Tirmidhi list.",
        tirmidhi: "This name is not in the Ajib.fr list."
      },
      notInList: "This name is not part of the list you follow.",
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
        all: (total: number) => `Names are picked at random from the ${total} in your list.`,
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
      record: (level: string) => `Record · ${level}`,
      chooseCount: "Choose the number of questions", start: "Start Challenge",
      typeLabel: "Challenge type",
      classic: "Classic", timed: "Against the clock",
      timedTitle: "60-second sprint",
      timedDesc: (seconds: number, reverse: boolean) =>
        reverse
          ? `Find the name (Arabic and transliteration) for as many random meanings as you can. Each correct answer adds ${seconds} seconds.`
          : `Find the meaning of as many random names as you can. Each correct answer adds ${seconds} seconds.`,
      directionTitle: "Quiz direction",
      directions: {
        classic: { title: "Arabic → meaning", sub: "Find the meaning" },
        reverse: { title: "Meaning → Arabic", sub: "Find the name" }
      },
      levelTitle: "Difficulty",
      levels: { easy: "Easy", medium: "Medium", hard: "Hard" },
      bonus: (seconds: number) => `+${seconds} s`,
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
      timedSummary: (n: number, level: string) => `Against the clock · ${level} · ${n} ${plural(n, "name", "names")} found`,
      xp: "XP earned",
      accuracy: "Accuracy",
      newMastered: "Names mastered",
      objectives: "Your goals",
      masteredCount: (n: number, total: number) => `${n} / ${total} names mastered`,
      objective: (percent: number, total: number) => (percent === 100 ? `All ${total} Names learned` : `${percent}% of the Names learned`),
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
      vowels: "Arabic vowels",
      vowelsHint: "Show or hide the vowel marks (harakat) on the Arabic names.",
      vowelsOn: "With vowels", vowelsOff: "Without vowels",
      nameList: "List of Names",
      nameListHint: "Scholars did not all keep the same list of 99 names. By default, the app follows the Tirmidhi list, the most widespread.",
      listOptions: {
        tirmidhi: { title: "Tirmidhi list", sub: (total: number) => `${total} names · the app's reference list` },
        ilmquest: { title: "Ajib.fr list", sub: (total: number) => `${total} names · the app's former list, source being checked` },
        all: { title: "Both lists", sub: (total: number) => `${total} names · all names together` }
      },
      aboutLists: "Why two lists?",
      preview: "Preview",
      back: "Back"
    },
    support: {
      title: "Support IlmQuest",
      text: "IlmQuest is free and ad-free. If it helps you learn the Names of Allah, you can support its development.",
      resultsText: "Finding IlmQuest useful? You can support its development.",
      button: "Support the app",
      linkLabel: "Support the app on Buy Me a Coffee (opens in a new tab)",
      dismiss: "Hide"
    },
    listNames: { ilmquest: "Ajib.fr list", tirmidhi: "Tirmidhi list", all: "Both lists" },
    about: {
      title: "Why two lists?",
      back: "Back to settings",
      hadithTitle: "The hadith of the 99 names",
      hadith: "The Prophet ﷺ said: “Allah has ninety-nine names, one hundred less one. Whoever enumerates them will enter Paradise.”",
      hadithRef: "Narrated by al-Bukhari (no. 2736) and Muslim (no. 2677).",
      hadithNote: "This authentic hadith does not list the names. Scholars therefore looked for them in the Qur'an and the Sunnah, and their lists are not all identical.",
      tirmidhiTitle: "The Tirmidhi list",
      tirmidhi: "This is the best-known list, and the app's reference list. It comes from a version of the hadith narrated by al-Tirmidhi (no. 3507), which lists the names. Several hadith specialists, including Ibn Hajar, consider that this list was added by a narrator and does not come from the Prophet ﷺ. It remains the most widely used.",
      ilmquestTitle: "The Ajib.fr list",
      ilmquest: "This is the app's former list. It comes from the French website Ajib.fr (“Les 99 noms d'Allah Azawajal et leurs significations”), which does not say which scholar it is based on: its source is being checked. It contains names found in the Qur'an and in authentic hadiths, some of which are not in the Tirmidhi list, such as As-Sitir, Ar-Rafiq or At-Tayyib.",
      numbersTitle: "In numbers",
      numberLabels: { shared: "shared", ilmquest: "Ajib.fr only", tirmidhi: "Tirmidhi only" },
      numbers: (shared: number, ownIlmquest: number, ownTirmidhi: number) =>
        `${shared} names are shared by both lists. ${ownIlmquest} are only in the Ajib.fr list, ${ownTirmidhi} only in the Tirmidhi list.`,
      inAppTitle: "In the app",
      inApp: "By default, the app follows the Tirmidhi list. You can change it in Settings: the List, Cards, Quiz, Challenge and your progress adapt to it. On each name's page, a badge shows which list it belongs to. Switching lists loses nothing: shared names keep their progress."
    }
  }
};

export type Language = 'fr' | 'en';
export type Translations = typeof translations.fr;
