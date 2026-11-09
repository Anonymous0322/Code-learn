'use client';

import { useState, useEffect, createContext, ReactNode, useContext, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';

export type Language = 'en' | 'ru' | 'uz';

const translations = {
  en: {
    home: 'Home', courses: 'Courses', roadmap: 'Roadmap', about: 'About', login: 'Log in', signup: 'Sign up',
    heroBadge: 'The best place to learn programming', heroTitle: 'Code. Learn. Build.', heroText: 'Master programming from the ground up. Interactive lessons, real examples, practical projects. Your journey as a developer starts here.', start: 'Start Learning', explore: 'Explore Courses',
    basics: 'START WITH THE BASICS', choose: 'Choose a language and begin your journey.', viewAll: 'View all courses', why: 'Why CodeLearn?', faq: 'Frequently asked questions',
    allCourses: 'All Courses', chooseCourse: 'Choose a programming language and start your journey.', aboutTitle: 'A clearer way to become a developer.',
    heroFloatingNote: 'Never stop learning and growing',
    featureLessonTitle: 'Interactive Lessons', featureLessonText: 'Learn with step-by-step explanations and code examples.',
    featurePracticeTitle: 'Code Practice', featurePracticeText: 'Write and run code directly in your browser.',
    featureProgressTitle: 'Progress Tracking', featureProgressText: 'Track your XP, streaks, and achievements.',
    featureCommunityTitle: 'Learning Community', featureCommunityText: 'Ask questions, share experience, and help other learners in the forum.',
    statsCourses: 'Courses', statsLessons: 'Lessons', statsExercises: 'Exercises', statsLearners: 'Learners', statsMembers: 'Project members',
    byTheNumbers: 'By The Numbers', howItWorks: 'How It Works',
    stepChooseTitle: 'Choose a Language', stepChooseText: 'Pick from HTML, CSS, JavaScript, or Python.',
    stepStartTitle: 'Start from Zero', stepStartText: 'Every course starts with absolute basics.',
    stepLearnTitle: 'Learn + Practice', stepLearnText: 'Watch, read, and write code interactively.',
    stepBuildTitle: 'Build Projects', stepBuildText: 'Apply your skills to real-world projects.',
    aboutStory: 'The CodeLearn story', aboutIntro: 'CodeLearn is a focused learning space for people who want to move from curiosity to confidence. We make the first step feel small, practical, and worth repeating.',
    principleZeroTitle: 'Start from zero', principleZeroText: 'Every path begins with the fundamentals, explained in plain language.',
    principleBuildTitle: 'Learn by building', principleBuildText: 'Short lessons turn into small wins, real exercises, and useful projects.',
    principlePurposeTitle: 'Progress with purpose', principlePurposeText: 'A clear roadmap helps you know what to learn next and why it matters.',
    faqIntro: 'Questions, answered', faqTitle: 'Frequently asked questions',
    faqQ1: 'What can I learn on CodeLearn?', faqA1: 'Start with HTML, CSS, JavaScript, or Python. Each path begins with fundamentals and gradually moves toward projects.',
    faqQ2: 'Do I need previous experience?', faqA2: 'No. The lessons are written for complete beginners and explain the important words and syntax as you go.',
    faqQ3: 'Can I practice in the browser?', faqA3: 'Yes. The learning experience is designed around small examples, exercises, and a safe browser-based practice flow.',
    faqQ4: 'Which interface languages are supported?', faqA4: 'The product is designed for Uzbek, Russian, and English learners.',
    roadmapIntro: 'Your learning path', roadmapTitle: 'A roadmap from zero to builder.', roadmapText: 'Choose a language, move at your own pace, and keep collecting small wins. The path is structured, but your curiosity sets the speed.',
    roadmapStage1Title: 'Absolute zero', roadmapStage1Text: 'Understand how the web works and write your first lines of code.', roadmapStage1Lessons: '12 lessons',
    roadmapStage2Title: 'Core syntax', roadmapStage2Text: 'Build a strong foundation with variables, structure, selectors, and logic.', roadmapStage2Lessons: '24 lessons',
    roadmapStage3Title: 'Practical skills', roadmapStage3Text: 'Turn concepts into responsive pages, interactions, and useful mini projects.', roadmapStage3Lessons: '32 lessons',
    roadmapStage4Title: 'Build projects', roadmapStage4Text: 'Bring everything together and ship projects you can be proud of.', roadmapStage4Lessons: '12 projects',
    exploreShort: 'Explore →',
    settingsTitle: 'Preferences', settingsIntro: 'Make it yours.', settingsLanguageLabel: 'Interface language', settingsLanguageValue: 'English', settingsLanguageHelp: 'Choose your UI language',
    settingsRemindersLabel: 'Learning reminders', settingsRemindersValue: 'On', settingsRemindersHelp: 'A gentle nudge keeps your streak alive',
    settingsMotionLabel: 'Reduced motion', settingsMotionValue: 'Off', settingsMotionHelp: 'Use fewer transitions and effects',
    registerTitle: 'Start your path', registerSubtitle: 'Create an account and make your first commit.',
    registerAlready: 'Already learning?', registerSignIn: 'Sign in',
    loginTitle: 'Welcome back', loginSubtitle: 'Continue where your learning left off.', loginNew: 'New to CodeLearn?', loginCreate: 'Create an account',
    footerResources: 'Resources', footerConnect: 'Connect', footerContact: 'Contact', footerPrivacy: 'Privacy', footerTerms: 'Terms', footerSitemap: 'Sitemap',
    startLearning: 'Start Learning',
    heroMainTitle: 'Learn to Code. From Zero to Developer.', heroMainSubtitle: 'Master programming from absolute zero with interactive lessons, real-time code practice, and progress tracking.',
    interactiveLessons: 'Interactive Lessons', learnByDoing: 'Learn by doing', realProjects: 'Real Projects', buildPortfolio: 'Build your portfolio', multiLanguage: 'Multi-language', trackProgress: 'Track Progress', seeGrowth: 'See your growth',
    noCourses: 'No Courses Available', checkBackCourses: 'Check back later for new courses.', levels: 'levels', exploreAction: 'Explore', beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced',
    loginFormTitle: 'Sign in to your account', emailLabel: 'Email address', passwordLabel: 'Password', submitLogin: 'Log in', submittingLogin: 'Signing in…', invalidEmail: 'Enter a valid email address', passwordMin: 'Password must contain at least 6 characters', nameMin: 'Name must contain at least 2 characters',
    registerFormTitle: 'Create your account', fullNameLabel: 'Full name', submitRegister: 'Create account', submittingRegister: 'Creating account…',
    profile: 'Profile', signOut: 'Sign out', adminPanel: 'Admin panel', profileHeading: 'Learner profile', accountDetails: 'Account details', joinedDate: 'Joined', accountStatus: 'Account status', activeStatus: 'Active', signInToViewProfile: 'Sign in to view your profile', loadingProfile: 'Loading profile…', learnerRole: 'Learner', creatorRole: 'Creator',
    coursePath: 'Course Path', theory: 'Theory', code: 'Code', summary: 'Summary', tips: 'Tips', commonMistakes: 'Common Mistakes', previousLesson: 'Previous Lesson', nextLesson: 'Next Lesson', lessonProgress: 'Lesson Progress', progress: 'Progress', quickInfo: 'Quick Info', difficulty: 'Difficulty', time: 'Time', languageLabel: 'Language', allRightsReserved: 'All rights reserved.', lessonTheoryFallback: 'Lesson theory will appear here when it is added.', exampleFallback: 'Code example will appear here when it is added.', summaryFallback: 'Lesson summary will appear here when it is added.',
  },
  ru: {
    home: 'Главная', courses: 'Курсы', roadmap: 'Путь', about: 'О нас', login: 'Войти', signup: 'Регистрация',
    heroBadge: 'Лучшее место для изучения программирования', heroTitle: 'Код. Учись. Создавай.', heroText: 'Изучайте программирование с нуля. Интерактивные уроки, реальные примеры и практические проекты. Ваш путь разработчика начинается здесь.', start: 'Начать обучение', explore: 'Изучить курсы',
    basics: 'НАЧНИТЕ С ОСНОВ', choose: 'Выберите язык и начните свой путь.', viewAll: 'Все курсы', why: 'Почему CodeLearn?', faq: 'Частые вопросы',
    allCourses: 'Все курсы', chooseCourse: 'Выберите язык программирования и начните обучение.', aboutTitle: 'Понятный путь к профессии разработчика.',
    heroFloatingNote: 'Никогда не переставайте учиться и расти',
    featureLessonTitle: 'Интерактивные уроки', featureLessonText: 'Изучайте материал шаг за шагом с пояснениями и примерами кода.',
    featurePracticeTitle: 'Практика кода', featurePracticeText: 'Пишите и запускайте код прямо в браузере.',
    featureProgressTitle: 'Отслеживание прогресса', featureProgressText: 'Следите за XP, streak и достижениями.',
    featureCommunityTitle: 'Сообщество', featureCommunityText: 'Задавайте вопросы, делитесь опытом и помогайте другим участникам форума.',
    statsCourses: 'Курсы', statsLessons: 'Уроки', statsExercises: 'Упражнения', statsLearners: 'Учащиеся', statsMembers: 'Участники проекта',
    byTheNumbers: 'По цифрам', howItWorks: 'Как это работает',
    stepChooseTitle: 'Выберите язык', stepChooseText: 'Выбирайте HTML, CSS, JavaScript или Python.',
    stepStartTitle: 'С нуля', stepStartText: 'Каждый курс начинается с основ.',
    stepLearnTitle: 'Учёба + практика', stepLearnText: 'Смотрите, читайте и пишите код интерактивно.',
    stepBuildTitle: 'Создавайте проекты', stepBuildText: 'Применяйте знания в реальных проектах.',
    aboutStory: 'История CodeLearn', aboutIntro: 'CodeLearn — это пространство для обучения, где можно перейти от любопытства к уверенности. Мы делаем первый шаг маленьким, практичным и повторяемым.',
    principleZeroTitle: 'С нуля', principleZeroText: 'Каждый путь начинается с основ, объяснённых простым языком.',
    principleBuildTitle: 'Учиться через создание', principleBuildText: 'Короткие уроки превращаются в небольшие победы, реальные упражнения и полезные проекты.',
    principlePurposeTitle: 'Движение с целью', principlePurposeText: 'Чёткий план помогает понять, что учить дальше и зачем это нужно.',
    faqIntro: 'Вопросы и ответы', faqTitle: 'Частые вопросы',
    faqQ1: 'Что я могу изучать на CodeLearn?', faqA1: 'Начните с HTML, CSS, JavaScript или Python. Каждая траектория начинается с основ и постепенно переходит к проектам.',
    faqQ2: 'Нужен ли опыт?', faqA2: 'Нет. Уроки написаны для новичков и объясняют важные слова и синтаксис по ходу обучения.',
    faqQ3: 'Могу ли я практиковаться в браузере?', faqA3: 'Да. Обучение построено вокруг небольших примеров, упражнений и безопасного практического потока в браузере.',
    faqQ4: 'Какие языки интерфейса поддерживаются?', faqA4: 'Продукт рассчитан на изучающих узбекский, русский и английский языки.',
    roadmapIntro: 'Ваш путь обучения', roadmapTitle: 'Путь от нуля до разработчика.', roadmapText: 'Выбирайте язык, двигайтесь в своём темпе и продолжайте накапливать маленькие победы. Путь структурирован, но скорость задаёт ваша любознательность.',
    roadmapStage1Title: 'Абсолютный ноль', roadmapStage1Text: 'Поймите, как работает веб, и напишите свои первые строки кода.', roadmapStage1Lessons: '12 уроков',
    roadmapStage2Title: 'Основы синтаксиса', roadmapStage2Text: 'Постройте крепкую основу из переменных, структуры, селекторов и логики.', roadmapStage2Lessons: '24 урока',
    roadmapStage3Title: 'Практические навыки', roadmapStage3Text: 'Преобразуйте понятия в адаптивные страницы, взаимодействия и полезные мини-проекты.', roadmapStage3Lessons: '32 урока',
    roadmapStage4Title: 'Создавайте проекты', roadmapStage4Text: 'Соедините всё вместе и выпустите проекты, которыми можно гордиться.', roadmapStage4Lessons: '12 проектов',
    exploreShort: 'Смотреть →',
    settingsTitle: 'Настройки', settingsIntro: 'Сделайте под себя.', settingsLanguageLabel: 'Язык интерфейса', settingsLanguageValue: 'Русский', settingsLanguageHelp: 'Выберите язык интерфейса',
    settingsRemindersLabel: 'Напоминания', settingsRemindersValue: 'Вкл', settingsRemindersHelp: 'Лёгкое напоминание поддерживает вашу streak',
    settingsMotionLabel: 'Сниженная анимация', settingsMotionValue: 'Выкл', settingsMotionHelp: 'Использовать меньше эффектов и анимации',
    registerTitle: 'Начните свой путь', registerSubtitle: 'Создайте аккаунт и сделайте свой первый коммит.',
    registerAlready: 'Уже учитесь?', registerSignIn: 'Войти',
    loginTitle: 'С возвращением', loginSubtitle: 'Продолжайте там, где остановились.', loginNew: 'Новичок в CodeLearn?', loginCreate: 'Создать аккаунт',
    footerResources: 'Ресурсы', footerConnect: 'Связь', footerContact: 'Контакты', footerPrivacy: 'Конфиденциальность', footerTerms: 'Условия', footerSitemap: 'Карта сайта',
    startLearning: 'Начать обучение',
    heroMainTitle: 'Учитесь программировать. С нуля до разработчика.', heroMainSubtitle: 'Освойте программирование с нуля с помощью интерактивных уроков, практики кода и отслеживания прогресса.',
    interactiveLessons: 'Интерактивные уроки', learnByDoing: 'Учитесь на практике', realProjects: 'Реальные проекты', buildPortfolio: 'Создайте портфолио', multiLanguage: 'Несколько языков', trackProgress: 'Отслеживайте прогресс', seeGrowth: 'Следите за ростом',
    noCourses: 'Курсы пока недоступны', checkBackCourses: 'Загляните позже — появятся новые курсы.', levels: 'уровней', exploreAction: 'Открыть', beginner: 'начальный', intermediate: 'средний', advanced: 'продвинутый',
    loginFormTitle: 'Войдите в аккаунт', emailLabel: 'Электронная почта', passwordLabel: 'Пароль', submitLogin: 'Войти', submittingLogin: 'Выполняется вход…', invalidEmail: 'Введите корректный адрес электронной почты', passwordMin: 'Пароль должен содержать не менее 6 символов', nameMin: 'Имя должно содержать не менее 2 символов',
    registerFormTitle: 'Создайте аккаунт', fullNameLabel: 'Полное имя', submitRegister: 'Создать аккаунт', submittingRegister: 'Создание аккаунта…',
    profile: 'Профиль', signOut: 'Выйти', adminPanel: 'Панель администратора', profileHeading: 'Профиль ученика', accountDetails: 'Данные аккаунта', joinedDate: 'Дата регистрации', accountStatus: 'Статус аккаунта', activeStatus: 'Активен', signInToViewProfile: 'Войдите, чтобы посмотреть профиль', loadingProfile: 'Загрузка профиля…', learnerRole: 'Ученик', creatorRole: 'Создатель',
    coursePath: 'Путь курса', theory: 'Теория', code: 'Код', summary: 'Итоги', tips: 'Советы', commonMistakes: 'Частые ошибки', previousLesson: 'Предыдущий урок', nextLesson: 'Следующий урок', lessonProgress: 'Прогресс урока', progress: 'Прогресс', quickInfo: 'Краткая информация', difficulty: 'Сложность', time: 'Время', languageLabel: 'Язык', allRightsReserved: 'Все права защищены.', lessonTheoryFallback: '\u0422\u0435\u043e\u0440\u0438\u044f \u0443\u0440\u043e\u043a\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.', exampleFallback: '\u041f\u0440\u0438\u043c\u0435\u0440 \u043a\u043e\u0434\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.', summaryFallback: '\u0418\u0442\u043e\u0433\u0438 \u0443\u0440\u043e\u043a\u0430 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.',
  },
  uz: {
    home: 'Boş sahifa', courses: 'Kurslar', roadmap: 'Yöl xaritasi', about: 'Biz haqimizda', login: 'Kiriş', signup: 'Röyxatdan ötiş',
    heroBadge: 'Dasturlaşni örganiş uçun eng yaxşi joy', heroTitle: 'Kod yoz. Örgan. Yarat.', heroText: 'Dasturlaşni noldan örganing. Interaktiv darslar, haqiqiy misollar va amaliy loyihalar. Dasturçi böliş yölingiz şu yerdan boşlanadi.', start: 'Örganişni boşlaş', explore: 'Kurslarni köriş',
    basics: 'ASOSLARDAN BOŞLANG', choose: 'Tilni tanlang va örganiş yölingizni boşlang.', viewAll: 'Barça kurslar', why: 'Nega CodeLearn?', faq: 'Köp beriladigan savollar',
    allCourses: 'Barça kurslar', chooseCourse: 'Dasturlaş tilini tanlang va örganişni boşlang.', aboutTitle: 'Dasturçi bölişning tuşunarli yöli.',
    heroFloatingNote: 'Har doim örganişni va ösişni davom ettiring',
    featureLessonTitle: 'Interaktiv darslar', featureLessonText: 'Qadam-ba-qadam tuşuntirişlar va kod misollari bilan örganing.',
    featurePracticeTitle: 'Kod maşqlari', featurePracticeText: 'Kodni töğridan-töğri brauzerda yozing va işga tuşiring.',
    featureProgressTitle: 'Jarayonni kuzatiş', featureProgressText: 'XP, streak va yutuqlarni kuzatib boring.',
    featureCommunityTitle: 'Örganuvchilar hamjamiyati', featureCommunityText: 'Forumda savol bering, tajriba almashing va boshqa örganuvchilarga yordam bering.',
    statsCourses: 'Kurslar', statsLessons: 'Darslar', statsExercises: 'Maşqlar', statsLearners: 'Öquvçilar', statsMembers: 'Loyiha a’zolari',
    byTheNumbers: 'Raqamlar bilan', howItWorks: 'Bu qanday işlaydi',
    stepChooseTitle: 'Tilni tanlang', stepChooseText: 'HTML, CSS, JavaScript yoki Python dan birini tanlang.',
    stepStartTitle: 'Noldan boşlaş', stepStartText: 'Har bir kurs mutlaqo asoslardan boşlanadi.',
    stepLearnTitle: 'Örganiş + maşq', stepLearnText: 'Kodni interaktiv tarzda tomoşa qiling, öqing va yozing.',
    stepBuildTitle: 'Loyihalar yarating', stepBuildText: 'Bilimingizni real dunyo loyihalarida qöllang.',
    aboutStory: 'CodeLearn hikoyasi', aboutIntro: 'CodeLearn — qiziqişdan işonçga ötişi uçun möljallangan öquv maydoni. Biz birinçi qadamni kiçik, amaliy va takrorlanadigan qilib qilamiz.',
    principleZeroTitle: 'Noldan boşlaş', principleZeroText: 'Har bir yöl asoslardan boşlanadi, oddiy tilda tuşuntiriladi.',
    principleBuildTitle: 'Yaratiş orqali örganiş', principleBuildText: 'Qisqa darslar kiçik ğalabaga, haqiqiy maşqlarga va foydali loyihalarga aylanadi.',
    principlePurposeTitle: 'Maqsad bilan rivojlaniş', principlePurposeText: 'Aniq yöl xaritasi sizga keyingi qadamni va nimaga ehtiyojingiz borligini aytib beradi.',
    faqIntro: 'Savollar va javoblar', faqTitle: 'Köp beriladigan savollar',
    faqQ1: 'CodeLearn da nimani örganişim mumkin?', faqA1: 'HTML, CSS, JavaScript yoki Python dan boşlang. Har bir yöl asoslardan boşlanib loyihalarga bosib ötadi.',
    faqQ2: 'Avvaldan tajribam bölişi şartmi?', faqA2: 'Yöq. Darslar boşlanğiç darajadagi öquvçilar uçun yozilgan va muhim sözlar hamda sintaksis tuşuntiriladi.',
    faqQ3: 'Brauzerda maşq qila olamanmi?', faqA3: 'Ha. Öquv tajribasi kiçik misollar, maşqlar va xavfsiz brauzerdagi amaliy jarayon ustiga qurilgan.',
    faqQ4: 'Qaysi interfeys tillari qöllab-quvvatlanadi?', faqA4: 'Mahsulot özbek, rus va ingliz tilida örganadiganlar uçun möljallangan.',
    roadmapIntro: 'Sizning öquv yöl haritasi', roadmapTitle: 'Noldan quruvçiga qadar yöl.', roadmapText: 'Tilni tanlang, özingizga mos tezlikda harakat qiling va kiçik yutuqlarni töplab boring. Yöl tuzilgan, lekin tezlikni qiziqiş belgilaydi.',
    roadmapStage1Title: 'Mutlaq nol', roadmapStage1Text: 'Vebning qanday işlaşini tuşunib, birinçi qator kodlarni yozing.', roadmapStage1Lessons: '12 dars',
    roadmapStage2Title: 'Sintaksis asoslari', roadmapStage2Text: 'Özgaruvçilar, tuzilma, selectorlar va mantiq asosida mustahkam poydevor quring.', roadmapStage2Lessons: '24 dars',
    roadmapStage3Title: 'Amaliy könikmalar', roadmapStage3Text: 'Tuşunçalarni moslaşuvçan sahifalar, interaktsiyalar va foydali mini-loyihalarga aylantiring.', roadmapStage3Lessons: '32 dars',
    roadmapStage4Title: 'Loyihalar yarating', roadmapStage4Text: 'Hammasini bir joyga yiğib, faxr qilişingiz mumkin bölgan loyihalarni işlab çiqing.', roadmapStage4Lessons: '12 loyiha',
    exploreShort: 'Köriş →',
    settingsTitle: 'Sozlamalar', settingsIntro: 'Barçasini özingizga moslang.', settingsLanguageLabel: 'Interfeys tili', settingsLanguageValue: 'Özbek', settingsLanguageHelp: 'UI tilini tanlang',
    settingsRemindersLabel: 'Eslatmalar', settingsRemindersValue: 'Yoniq', settingsRemindersHelp: 'Yumşoq eslatma streak ni saqlab turadi',
    settingsMotionLabel: 'Kamroq animatsiya', settingsMotionValue: 'Öçiq', settingsMotionHelp: 'Kamroq effekt va animatsiyadan foydalaning',
    registerTitle: 'Yölni boşlang', registerSubtitle: 'Akkount yarating va birinçi commit ni qiling.',
    registerAlready: 'Allaqaçon örganayapsizmi?', registerSignIn: 'Kiriş',
    loginTitle: 'Xuş kelibsiz', loginSubtitle: 'Örganişni töxtagan joyingizdan davom eting.', loginNew: 'CodeLearn da yangimisiz?', loginCreate: 'Akkount yaratiş',
    footerResources: 'Resurslar', footerConnect: 'Boğlaniş', footerContact: 'Kontakt', footerPrivacy: 'Maxfiylik', footerTerms: 'Şartlar', footerSitemap: 'Sayt xaritasi',
    startLearning: 'Örganişni boşlaş',
    heroMainTitle: 'Dasturlaşni noldan örganing.', heroMainSubtitle: 'Interaktiv darslar, kod maşqlari va öz rivojingizni kuzatiş orqali dasturlaşni noldan örganing.',
    interactiveLessons: 'Interaktiv darslar', learnByDoing: 'Amaliyot orqali örganing', realProjects: 'Haqiqiy loyihalar', buildPortfolio: 'Portfolio yarating', multiLanguage: 'Köp tilli', trackProgress: 'Jarayonni kuzating', seeGrowth: 'Ösişni köring',
    noCourses: 'Hozirça kurslar yöq', checkBackCourses: 'Yangi kurslar uçun keyinroq qayta kiring.', levels: 'bosqiç', exploreAction: 'Köriş', beginner: 'boşlanğiç', intermediate: 'örta', advanced: 'yuqori',
    loginFormTitle: 'Hisobingizga kiring', emailLabel: 'Email manzil', passwordLabel: 'Parol', submitLogin: 'Kiriş', submittingLogin: 'Kirilmoqda…', invalidEmail: 'Email manzilni töğri kiriting', passwordMin: 'Parol kamida 6 ta belgidan iborat bölişi kerak', nameMin: 'Ism kamida 2 ta belgidan iborat bölişi kerak',
    registerFormTitle: 'Hisob yarating', fullNameLabel: 'Töliq ism', submitRegister: 'Hisob yaratiş', submittingRegister: 'Hisob yaratilmoqda…',
    profile: 'Profil', signOut: 'Çiqiş', adminPanel: 'Admin paneli', profileHeading: 'Öquvçi profili', accountDetails: 'Hisob ma’lumotlari', joinedDate: 'A’zo bölgan sana', accountStatus: 'Hisob holati', activeStatus: 'Faol', signInToViewProfile: 'Profilingizni köriş uçun tizimga kiring', loadingProfile: 'Profil yuklanmoqda…', learnerRole: 'Öquvçi', creatorRole: 'Yaratuvçi',
    coursePath: 'Kurs yöli', theory: 'Nazariya', code: 'Kod', summary: 'Xulosa', tips: 'Maslahatlar', commonMistakes: 'Köp uçraydigan xatolar', previousLesson: 'Oldingi dars', nextLesson: 'Keyingi dars', lessonProgress: 'Dars jarayoni', progress: 'Jarayon', quickInfo: 'Qisqa ma’lumot', difficulty: 'Qiyinlik', time: 'Vaqt', languageLabel: 'Til', allRightsReserved: 'Barça huquqlar himoyalangan.', lessonTheoryFallback: 'Dars nazariyasi hali kiritilmagan.', exampleFallback: 'Kod namunasi hali kiritilmagan.', summaryFallback: 'Dars xulosasi hali kiritilmagan.',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

export const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  tr: (uz: string, ru: string, en: string) => string;
}>({
  theme: 'dark',
  toggleTheme: () => {},
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key],
  tr: (_uz, _ru, en) => en,
});

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState<Language>('en');
  const [authLinkError, setAuthLinkError] = useState<string | null>(null);
  const translate = useCallback((uz: string, ru: string, en: string) => (
    language === 'uz' ? uz : language === 'ru' ? ru : en
  ), [language]);
  const translateKey = useCallback((key: TranslationKey) => translations[language][key], [language]);
  const toggleTheme = useCallback(() => setTheme(current => current === 'dark' ? 'light' : 'dark'), []);
  useEffect(() => {
    useAuthStore.getState().initialize();
    void useCourseStore.getState().initialize();
  }, []);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const errorCode = hash.get('error_code');
    if (errorCode === 'otp_expired') {
      setAuthLinkError('otp_expired');
    } else if (errorCode) {
      setAuthLinkError('confirmation_error');
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem('codelearn-language');
    if (saved === 'en' || saved === 'ru' || saved === 'uz') setLanguage(saved);
    document.documentElement.lang = saved === 'ru' || saved === 'uz' ? saved : 'en';
  }, []);

  const changeLanguage = useCallback((nextLanguage: Language) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('codelearn-language', nextLanguage);
    document.documentElement.lang = nextLanguage;
  }, []);
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    language,
    setLanguage: changeLanguage,
    t: translateKey,
    tr: translate,
  }), [theme, toggleTheme, language, changeLanguage, translateKey, translate]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {authLinkError && (
        <div role="alert" className="fixed inset-x-4 top-20 z-[100] mx-auto max-w-xl rounded-lg border border-red-500/30 bg-red-950/95 p-4 text-center text-sm text-red-200 shadow-xl">
          {authLinkError === 'otp_expired'
            ? translate('Tasdiqlaş havolasi eskirgan yoki oldin işlatilgan. Yangi tasdiqlaş xatini sörang.', 'Ссылка для подтверждения устарела или уже использована. Запросите новое письмо.', 'The confirmation link has expired or was already used. Request a new email.')
            : translate('Emailni tasdiqlaşda xatolik yuz berdi.', 'Не удалось подтвердить email.', 'Email confirmation failed.')}{' '}
          <a href="/auth/login" className="font-semibold text-neon-cyan underline">
            {translate('Login sahifasiga ötiş', 'Перейти ко входу', 'Go to sign in')}
          </a>
        </div>
      )}
      {children}
    </ThemeContext.Provider>
  );
}

export function useI18n() {
  return useContext(ThemeContext);
}
