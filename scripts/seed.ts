import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courses = [
    {
      slug: 'html',
      languageCode: 'html',
      iconUrl: '/images/logos/html.svg',
      description: 'Learn the foundation of the web — structure, semantics, and markup.',
      difficulty: 'beginner',
      orderIndex: 0,
    },
    {
      slug: 'css',
      languageCode: 'css',
      iconUrl: '/images/logos/css.svg',
      description: 'Style the web beautifully — layouts, animations, and responsive design.',
      difficulty: 'beginner',
      orderIndex: 1,
    },
    {
      slug: 'javascript',
      languageCode: 'javascript',
      iconUrl: '/images/logos/javascript.svg',
      description: 'Make the web alive — interactivity, logic, and dynamic content.',
      difficulty: 'beginner',
      orderIndex: 2,
    },
    {
      slug: 'python',
      languageCode: 'python',
      iconUrl: '/images/logos/python.svg',
      description: 'General-purpose programming — from basics to real-world applications.',
      difficulty: 'beginner',
      orderIndex: 3,
    },
  ];

  for (const courseData of courses) {
    await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: courseData,
      create: courseData,
    });
  }

  console.log('✅ Courses seeded');

  const levelsPerCourse = {
    html: [
      { levelIndex: 0, title: 'Introduction', description: 'Get to know the web and HTML.' },
      { levelIndex: 1, title: 'HTML Basics', description: 'Learn the fundamental HTML tags.' },
      { levelIndex: 2, title: 'Text and Links', description: 'Format text and create hyperlinks.' },
      { levelIndex: 3, title: 'Images and Media', description: 'Add images, audio, and video.' },
      { levelIndex: 4, title: 'Lists and Tables', description: 'Organize data with lists and tables.' },
      { levelIndex: 5, title: 'Forms', description: 'Collect user input with forms.' },
      { levelIndex: 6, title: 'Semantic HTML', description: 'Write meaningful, accessible markup.' },
      { levelIndex: 7, title: 'Accessibility', description: 'Make the web usable for everyone.' },
      { levelIndex: 8, title: 'Mini Projects', description: 'Apply what you have learned.' },
      { levelIndex: 9, title: 'Final Project', description: 'Build a complete website.' },
    ],
    css: [
      { levelIndex: 0, title: 'Introduction', description: 'Get to know CSS and how it works.' },
      { levelIndex: 1, title: 'Selectors and Properties', description: 'Target elements and style them.' },
      { levelIndex: 2, title: 'Colors and Backgrounds', description: 'Create visually appealing designs.' },
      { levelIndex: 3, title: 'Box Model', description: 'Understand spacing and sizing.' },
      { levelIndex: 4, title: 'Flexbox', description: 'Master flexible layouts.' },
      { levelIndex: 5, title: 'Grid Layout', description: 'Create complex 2D layouts.' },
      { levelIndex: 6, title: 'Responsive Design', description: 'Build for all screen sizes.' },
      { levelIndex: 7, title: 'Animations', description: 'Add motion and transitions.' },
      { levelIndex: 8, title: 'CSS Variables', description: 'Write maintainable styles.' },
      { levelIndex: 9, title: 'Final Project', description: 'Build a styled portfolio.' },
    ],
    javascript: [
      { levelIndex: 0, title: 'Introduction', description: 'Get to know JavaScript and your first script.' },
      { levelIndex: 1, title: 'Variables and Data Types', description: 'Store and manipulate data.' },
      { levelIndex: 2, title: 'Operators and Expressions', description: 'Perform calculations and comparisons.' },
      { levelIndex: 3, title: 'Conditions and Logic', description: 'Make decisions in your code.' },
      { levelIndex: 4, title: 'Loops', description: 'Repeat actions efficiently.' },
      { levelIndex: 5, title: 'Functions', description: 'Write reusable code blocks.' },
      { levelIndex: 6, title: 'Arrays and Objects', description: 'Work with collections of data.' },
      { levelIndex: 7, title: 'DOM Manipulation', description: 'Interact with the web page.' },
      { levelIndex: 8, title: 'Events', description: 'Respond to user actions.' },
      { levelIndex: 9, title: 'ES6+ Features', description: 'Use modern JavaScript.' },
      { levelIndex: 10, title: 'Async Programming', description: 'Handle asynchronous operations.' },
      { levelIndex: 11, title: 'Final Project', description: 'Build an interactive website.' },
    ],
    python: [
      { levelIndex: 0, title: 'Introduction', description: 'Get to know Python and your first program.' },
      { levelIndex: 1, title: 'Variables and Data Types', description: 'Store and manipulate data.' },
      { levelIndex: 2, title: 'Operators', description: 'Perform calculations and comparisons.' },
      { levelIndex: 3, title: 'Conditionals', description: 'Make decisions in your code.' },
      { levelIndex: 4, title: 'Loops', description: 'Repeat actions efficiently.' },
      { levelIndex: 5, title: 'Functions', description: 'Write reusable code blocks.' },
      { levelIndex: 6, title: 'Lists and Tuples', description: 'Work with ordered collections.' },
      { levelIndex: 7, title: 'Dictionaries and Sets', description: 'Work with key-value pairs.' },
      { levelIndex: 8, title: 'File Handling', description: 'Read and write files.' },
      { levelIndex: 9, title: 'OOP Basics', description: 'Object-oriented programming.' },
      { levelIndex: 10, title: 'Libraries', description: 'Use powerful Python packages.' },
      { levelIndex: 11, title: 'Final Project', description: 'Build a complete application.' },
    ],
  };

  for (const [slug, levels] of Object.entries(levelsPerCourse)) {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) continue;
    for (const levelData of levels) {
      await prisma.level.upsert({
        where: { courseId_levelIndex: { courseId: course.id, levelIndex: levelData.levelIndex } },
        update: levelData,
        create: { ...levelData, courseId: course.id },
      });
    }
  }

  console.log('✅ Levels seeded');

  const lessonData = {
    html: [
      { levelIndex: 0, slug: 'what-is-the-web', title: 'What is the Web?', orderIndex: 0, difficulty: 'beginner', estimatedTime: '5 min' },
      { levelIndex: 0, slug: 'what-is-html', title: 'What is HTML?', orderIndex: 1, difficulty: 'beginner', estimatedTime: '5 min' },
      { levelIndex: 1, slug: 'html-structure', title: 'HTML Structure and Tags', orderIndex: 0, difficulty: 'beginner', estimatedTime: '10 min' },
      { levelIndex: 1, slug: 'text-formatting', title: 'Text Formatting', orderIndex: 1, difficulty: 'beginner', estimatedTime: '10 min' },
    ],
    css: [
      { levelIndex: 0, slug: 'what-is-css', title: 'What is CSS?', orderIndex: 0, difficulty: 'beginner', estimatedTime: '5 min' },
      { levelIndex: 0, slug: 'how-css-works', title: 'How CSS Works with HTML', orderIndex: 1, difficulty: 'beginner', estimatedTime: '5 min' },
      { levelIndex: 1, slug: 'selectors', title: 'Selectors and Properties', orderIndex: 0, difficulty: 'beginner', estimatedTime: '10 min' },
      { levelIndex: 1, slug: 'colors', title: 'Colors and Backgrounds', orderIndex: 1, difficulty: 'beginner', estimatedTime: '10 min' },
    ],
    javascript: [
      { levelIndex: 0, slug: 'what-is-js', title: 'What is JavaScript?', orderIndex: 0, difficulty: 'beginner', estimatedTime: '5 min' },
      { levelIndex: 0, slug: 'first-script', title: 'Your First Script', orderIndex: 1, difficulty: 'beginner', estimatedTime: '5 min' },
      { levelIndex: 1, slug: 'variables', title: 'Variables and Data Types', orderIndex: 0, difficulty: 'beginner', estimatedTime: '10 min' },
      { levelIndex: 1, slug: 'operators', title: 'Operators and Expressions', orderIndex: 1, difficulty: 'beginner', estimatedTime: '10 min' },
    ],
    python: [
      { levelIndex: 0, slug: 'what-is-python', title: 'What is Python?', orderIndex: 0, difficulty: 'beginner', estimatedTime: '5 min' },
      { levelIndex: 0, slug: 'first-program', title: 'Your First Program', orderIndex: 1, difficulty: 'beginner', estimatedTime: '5 min' },
      { levelIndex: 1, slug: 'python-variables', title: 'Variables and Data Types', orderIndex: 0, difficulty: 'beginner', estimatedTime: '10 min' },
      { levelIndex: 1, slug: 'python-operators', title: 'Operators', orderIndex: 1, difficulty: 'beginner', estimatedTime: '10 min' },
    ],
  };

  for (const [lang, lessons] of Object.entries(lessonData)) {
    const course = await prisma.course.findUnique({ where: { slug: lang } });
    if (!course) continue;
    for (const lesson of lessons) {
      const level = await prisma.level.findUnique({
        where: { courseId_levelIndex: { courseId: course.id, levelIndex: lesson.levelIndex } },
      });
      if (!level) continue;
      await prisma.lesson.upsert({
        where: { levelId_slug: { levelId: level.id, slug: lesson.slug } },
        update: lesson,
        create: { ...lesson, levelId: level.id },
      });
    }
  }

  console.log('✅ Lessons seeded');

  const translations = [];
  const enLessons = await prisma.lesson.findMany({ include: { level: true } });
  for (const lesson of enLessons) {
    translations.push({
      lessonId: lesson.id,
      language: 'en',
      title: lesson.title,
      theory: `Learn about ${lesson.title.toLowerCase()} in this lesson. This is the English content for ${lesson.title}.`,
      exampleCode: '<!-- Add your code example here -->',
      exampleExplanation: 'This is the English explanation of the code example.',
      tryIt: 'Try it yourself!',
      commonMistakes: 'Common mistakes to avoid.',
      tips: 'Helpful tips for this lesson.',
      summary: 'Summary of this lesson.',
      syntax: 'Syntax reference.',
    });
  }

  for (const t of translations) {
    await prisma.lessonTranslation.upsert({
      where: { lessonId_language: { lessonId: t.lessonId, language: t.language } },
      update: t,
      create: t,
    });
  }

  console.log('✅ Translations seeded');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
