import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'fr' | 'en';
export type Theme = 'light' | 'dark';
export type TextSize = 'normal' | 'large' | 'extra-large';

interface SettingsContextType {
  language: Language;
  theme: Theme;
  textSize: TextSize;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setTextSize: (size: TextSize) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    dashboard: 'الرئيسية',
    quiz: 'اختبار جديد',
    favorites: 'المفضلة',
    leaderboard: 'المتصدرين',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    textSize: 'حجم الخط',
    normal: 'طبيعي',
    large: 'كبير',
    extraLarge: 'كبير جداً',
    save: 'حفظ',
    welcome: 'أهلاً بك يا',
    readyToStudy: 'جاهز لمراجعة دروسك اليوم؟',
    startNewQuiz: 'ابدأ مراجعة جديدة',
    recentActivity: 'آخر النشاطات',
    upcomingBadges: 'الأوسمة القادمة',
    generateQuiz: 'أنشئ اختبارك بالذكاء الاصطناعي',
    quizTopic: 'موضوع الاختبار',
    referenceText: 'النص المرجعي',
    uploadPdf: 'رفع ملف (PDF, DOCX, TXT, TS)',
    dragPdf: 'اسحب الملف هنا',
    generate: 'إنشاء الاختبار',
    points: 'نقطة',
    level: 'المستوى',
    student: 'طالب مجتهد',
    score: 'النتيجة',
    reviewAnswers: 'مراجعة الإجابات',
    newQuiz: 'اختبار جديد',
    explanation: 'التوضيح',
    next: 'التالي',
    prev: 'السابق',
    finish: 'إنهاء',
    accessibility: 'سهولة الوصول',
    olderUsersMode: 'وضع كبار السن (تكبير العناصر)',
    leaderboardTitle: 'لوحة المتصدرين',
    leaderboardSubtitle: 'تنافس مع زملائك وكن في القمة',
    topStudent: 'طالب متميز',
    totalPoints: 'إجمالي النقاط',
    completedQuizzes: 'اختبارات مكتملة',
    accuracy: 'دقة الإجابات',
    studyHours: 'ساعات المذاكرة',
    studentTitle: 'طالب في العلوم الشرعية',
    earnedBadges: 'الأوسمة المكتسبة',
    viewAll: 'عرض الكل',
    noBadges: 'لم تحصل على أوسمة بعد. ابدأ الاختبارات الآن!',
    noFavorites: 'لا توجد أسئلة مفضلة بعد',
    favoriteQuestions: 'الأسئلة المفضلة',
    favoriteSubtitle: 'راجع الأسئلة التي قمت بحفظها للتركيز عليها',
    savedQuestionsSoon: 'سيتم عرض الأسئلة المحفوظة هنا قريباً...',
    recentActivityItemTitle: 'مراجعة سورة البقرة',
    recentActivityItemSubtitle: 'منذ ساعتين • 8/10 إجابات صحيحة',
    upcomingBadgeTitle: 'بطل الأسبوع',
    upcomingBadgeSubtitle: 'باقي لك 3 اختبارات للحصول على هذا الوسام',
    mockBadge1Name: 'المبتدئ الذكي',
    mockBadge1Desc: 'أكمل أول اختبار بنجاح',
    mockBadge2Name: 'المثابر',
    mockBadge2Desc: 'ذاكر لمدة 5 أيام متتالية',
    errorPdfExtract: 'فشل استخراج النص من الملف. يرجى المحاولة مرة أخرى.',
    errorMissingFields: 'يرجى إدخال الموضوع والنص أو رفع ملف.',
    errorGenerate: 'حدث خطأ أثناء إنشاء الاختبار. يرجى المحاولة مرة أخرى.',
    question: 'السؤال',
    explanationTitle: 'التوضيح:',
    modeQcm: 'اختيارات متعددة',
    modeFlashcard: 'بطاقات تعليمية',
    flipCard: 'انقر للقلب',
  },
  fr: {
    dashboard: 'Tableau de bord',
    quiz: 'Nouveau Quiz',
    favorites: 'Favoris',
    leaderboard: 'Classement',
    profile: 'Profil',
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    textSize: 'Taille du texte',
    normal: 'Normale',
    large: 'Grande',
    extraLarge: 'Très grande',
    save: 'Enregistrer',
    welcome: 'Bienvenue,',
    readyToStudy: 'Prêt à réviser aujourd\'hui ?',
    startNewQuiz: 'Commencer une révision',
    recentActivity: 'Activité récente',
    upcomingBadges: 'Badges à venir',
    generateQuiz: 'Générer un Quiz par IA',
    quizTopic: 'Sujet du Quiz',
    referenceText: 'Texte de référence',
    uploadPdf: 'Charger un fichier (PDF, DOCX, TXT, TS)',
    dragPdf: 'Glissez le fichier ici',
    generate: 'Générer le Quiz',
    points: 'points',
    level: 'Niveau',
    student: 'Étudiant assidu',
    score: 'Score',
    reviewAnswers: 'Réviser les réponses',
    newQuiz: 'Nouveau Quiz',
    explanation: 'Explication',
    next: 'Suivant',
    prev: 'Précédent',
    finish: 'Terminer',
    accessibility: 'Accessibilité',
    olderUsersMode: 'Mode senior (agrandir les éléments)',
    leaderboardTitle: 'Classement',
    leaderboardSubtitle: 'Rivalisez avec vos pairs et atteignez le sommet',
    topStudent: 'Étudiant exceptionnel',
    totalPoints: 'Points totaux',
    completedQuizzes: 'Quiz terminés',
    accuracy: 'Précision',
    studyHours: 'Heures d\'étude',
    studentTitle: 'Étudiant en sciences islamiques',
    earnedBadges: 'Badges obtenus',
    viewAll: 'Voir tout',
    noBadges: 'Aucun badge pour le moment. Commencez un quiz !',
    noFavorites: 'Aucun favori pour le moment',
    favoriteQuestions: 'Questions favorites',
    favoriteSubtitle: 'Révisez les questions que vous avez enregistrées',
    savedQuestionsSoon: 'Les questions enregistrées apparaîtront ici bientôt...',
    recentActivityItemTitle: 'Révision de la sourate Al-Baqarah',
    recentActivityItemSubtitle: 'Il y a 2 heures • 8/10 bonnes réponses',
    upcomingBadgeTitle: 'Héros de la semaine',
    upcomingBadgeSubtitle: '3 quiz restants pour obtenir ce badge',
    mockBadge1Name: 'Débutant Intelligent',
    mockBadge1Desc: 'A terminé le premier quiz avec succès',
    mockBadge2Name: 'Persévérant',
    mockBadge2Desc: 'A étudié pendant 5 jours consécutifs',
    errorPdfExtract: 'Échec de l\'extraction du texte du fichier. Veuillez réessayer.',
    errorMissingFields: 'Veuillez entrer le sujet et le texte ou charger un fichier.',
    errorGenerate: 'Une erreur s\'est produite lors de la création du quiz. Veuillez réessayer.',
    question: 'Question',
    explanationTitle: 'Explication :',
    modeQcm: 'QCM',
    modeFlashcard: 'Cartes',
    flipCard: 'Cliquez pour retourner',
  },
  en: {
    dashboard: 'Dashboard',
    quiz: 'New Quiz',
    favorites: 'Favorites',
    leaderboard: 'Leaderboard',
    profile: 'Profile',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    textSize: 'Text Size',
    normal: 'Normal',
    large: 'Large',
    extraLarge: 'Extra Large',
    save: 'Save',
    welcome: 'Welcome,',
    readyToStudy: 'Ready to revise today?',
    startNewQuiz: 'Start new revision',
    recentActivity: 'Recent Activity',
    upcomingBadges: 'Upcoming Badges',
    generateQuiz: 'AI Quiz Generator',
    quizTopic: 'Quiz Topic',
    referenceText: 'Reference Text',
    uploadPdf: 'Upload File (PDF, DOCX, TXT, TS)',
    dragPdf: 'Drag file here',
    generate: 'Generate Quiz',
    points: 'points',
    level: 'Level',
    student: 'Diligent Student',
    score: 'Score',
    reviewAnswers: 'Review Answers',
    newQuiz: 'New Quiz',
    explanation: 'Explanation',
    next: 'Next',
    prev: 'Previous',
    finish: 'Finish',
    accessibility: 'Accessibility',
    olderUsersMode: 'Senior Mode (Enlarge elements)',
    leaderboardTitle: 'Leaderboard',
    leaderboardSubtitle: 'Compete with your peers and reach the top',
    topStudent: 'Outstanding Student',
    totalPoints: 'Total Points',
    completedQuizzes: 'Completed Quizzes',
    accuracy: 'Accuracy',
    studyHours: 'Study Hours',
    studentTitle: 'Islamic Studies Student',
    earnedBadges: 'Earned Badges',
    viewAll: 'View All',
    noBadges: 'No badges yet. Start taking quizzes!',
    noFavorites: 'No favorite questions yet',
    favoriteQuestions: 'Favorite Questions',
    favoriteSubtitle: 'Review the questions you saved to focus on them',
    savedQuestionsSoon: 'Saved questions will appear here soon...',
    recentActivityItemTitle: 'Reviewing Surah Al-Baqarah',
    recentActivityItemSubtitle: '2 hours ago • 8/10 correct answers',
    upcomingBadgeTitle: 'Hero of the Week',
    upcomingBadgeSubtitle: '3 quizzes left to get this badge',
    mockBadge1Name: 'Smart Beginner',
    mockBadge1Desc: 'Successfully completed the first quiz',
    mockBadge2Name: 'Persistent',
    mockBadge2Desc: 'Studied for 5 consecutive days',
    errorPdfExtract: 'Failed to extract text from file. Please try again.',
    errorMissingFields: 'Please enter the topic and text or upload a file.',
    errorGenerate: 'An error occurred while generating the quiz. Please try again.',
    question: 'Question',
    explanationTitle: 'Explanation:',
    modeQcm: 'Multiple Choice',
    modeFlashcard: 'Flashcards',
    flipCard: 'Click to flip',
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'ar');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [textSize, setTextSize] = useState<TextSize>(() => (localStorage.getItem('textSize') as TextSize) || 'normal');

  useEffect(() => {
    localStorage.setItem('lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('textSize', textSize);
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-extra-large');
    document.documentElement.classList.add(`text-${textSize}`);
  }, [textSize]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ language, theme, textSize, setLanguage, setTheme, setTextSize, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
