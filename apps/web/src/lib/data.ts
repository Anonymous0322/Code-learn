export const courses = [
  {
    id: '1', slug: 'html', languageCode: 'html', iconUrl: null,
    description: 'Learn HTML from scratch. Structure the web with semantic markup, forms, tables, and multimedia.',
    difficulty: 'beginner', orderIndex: 0, isActive: true, createdAt: '2024-01-01', title: 'HTML',
    levels: [
      { id: 'h1', levelIndex: 0, title: 'What is the Web?', description: 'Introduction to the web and HTML', orderIndex: 0 },
      { id: 'h2', levelIndex: 1, title: 'What is HTML?', description: 'HTML basics and structure', orderIndex: 1 },
      { id: 'h3', levelIndex: 2, title: 'HTML Structure and Tags', description: 'Tags, elements, attributes', orderIndex: 2 },
      { id: 'h4', levelIndex: 3, title: 'Text Formatting', description: 'Headings, paragraphs, lists', orderIndex: 3 },
      { id: 'h5', levelIndex: 4, title: 'Links and Images', description: 'Hyperlinks and media', orderIndex: 4 },
      { id: 'h6', levelIndex: 5, title: 'Tables', description: 'Table structures and data', orderIndex: 5 },
      { id: 'h7', levelIndex: 6, title: 'Forms', description: 'Form elements and validation', orderIndex: 6 },
      { id: 'h8', levelIndex: 7, title: 'Semantic HTML', description: 'SEO-friendly markup', orderIndex: 7 },
      { id: 'h9', levelIndex: 8, title: 'Multimedia', description: 'Audio, video, and iframe', orderIndex: 8 },
      { id: 'h10', levelIndex: 9, title: 'Final Project', description: 'Build a complete HTML page', orderIndex: 9 },
    ],
  },
  {
    id: '2', slug: 'css', languageCode: 'css', iconUrl: null,
    description: 'Master CSS styling. Learn flexbox, grid, animations, responsive design, and modern CSS features.',
    difficulty: 'beginner', orderIndex: 1, isActive: true, createdAt: '2024-01-01', title: 'CSS',
    levels: [
      { id: 'c1', levelIndex: 0, title: 'CSS Basics', description: 'Selectors, properties, values', orderIndex: 0 },
      { id: 'c2', levelIndex: 1, title: 'Box Model', description: 'Margin, padding, border', orderIndex: 1 },
      { id: 'c3', levelIndex: 2, title: 'Flexbox', description: 'Flexible layouts', orderIndex: 2 },
      { id: 'c4', levelIndex: 3, title: 'Grid Layout', description: 'CSS Grid system', orderIndex: 3 },
      { id: 'c5', levelIndex: 4, title: 'Responsive Design', description: 'Media queries and breakpoints', orderIndex: 4 },
      { id: 'c6', levelIndex: 5, title: 'Animations', description: 'Keyframes and transitions', orderIndex: 5 },
      { id: 'c7', levelIndex: 6, title: 'Colors and Gradients', description: 'Color models and gradients', orderIndex: 6 },
      { id: 'c8', levelIndex: 7, title: 'Typography', description: 'Fonts, text styling', orderIndex: 7 },
      { id: 'c9', levelIndex: 8, title: 'Variables and Custom Properties', description: 'CSS Custom Properties', orderIndex: 8 },
      { id: 'c10', levelIndex: 9, title: 'Final Project', description: 'Build a styled website', orderIndex: 9 },
    ],
  },
  {
    id: '3', slug: 'javascript', languageCode: 'javascript', iconUrl: null,
    description: 'Learn JavaScript from basics to advanced. Variables, functions, DOM manipulation, events, and more.',
    difficulty: 'intermediate', orderIndex: 2, isActive: true, createdAt: '2024-01-01', title: 'JavaScript',
    levels: [
      { id: 'js1', levelIndex: 0, title: 'Variables and Types', description: 'let, const, var, data types', orderIndex: 0 },
      { id: 'js2', levelIndex: 1, title: 'Functions', description: 'Declarations, expressions, arrows', orderIndex: 1 },
      { id: 'js3', levelIndex: 2, title: 'Control Flow', description: 'If, switch, loops', orderIndex: 2 },
      { id: 'js4', levelIndex: 3, title: 'Arrays and Objects', description: 'Data structures', orderIndex: 3 },
      { id: 'js5', levelIndex: 4, title: 'DOM Manipulation', description: 'Select, modify, create elements', orderIndex: 4 },
      { id: 'js6', levelIndex: 5, title: 'Events', description: 'Click, hover, form events', orderIndex: 5 },
      { id: 'js7', levelIndex: 6, title: 'ES6+ Features', description: 'Destructuring, spread, modules', orderIndex: 6 },
      { id: 'js8', levelIndex: 7, title: 'Async Programming', description: 'Promises, async/await', orderIndex: 7 },
      { id: 'js9', levelIndex: 8, title: 'Fetch API', description: 'HTTP requests', orderIndex: 8 },
      { id: 'js10', levelIndex: 9, title: 'Objects and Prototypes', description: 'OOP concepts', orderIndex: 9 },
      { id: 'js11', levelIndex: 10, title: 'Error Handling', description: 'Try/catch and debugging', orderIndex: 10 },
      { id: 'js12', levelIndex: 11, title: 'Final Project', description: 'Build an interactive app', orderIndex: 11 },
    ],
  },
  {
    id: '4', slug: 'python', languageCode: 'python', iconUrl: null,
    description: 'Python from zero. Learn variables, functions, OOP, data structures, and real-world applications.',
    difficulty: 'intermediate', orderIndex: 3, isActive: true, createdAt: '2024-01-01', title: 'Python',
    levels: [
      { id: 'p1', levelIndex: 0, title: 'Python Basics', description: 'Installation, print, variables', orderIndex: 0 },
      { id: 'p2', levelIndex: 1, title: 'Data Types', description: 'Strings, numbers, booleans', orderIndex: 1 },
      { id: 'p3', levelIndex: 2, title: 'Control Flow', description: 'If/elif/else, loops', orderIndex: 2 },
      { id: 'p4', levelIndex: 3, title: 'Functions', description: 'Def, parameters, return', orderIndex: 3 },
      { id: 'p5', levelIndex: 4, title: 'Lists and Tuples', description: 'Collections', orderIndex: 4 },
      { id: 'p6', levelIndex: 5, title: 'Dictionaries and Sets', description: 'Key-value pairs', orderIndex: 5 },
      { id: 'p7', levelIndex: 6, title: 'OOP Concepts', description: 'Classes and objects', orderIndex: 6 },
      { id: 'p8', levelIndex: 7, title: 'File Handling', description: 'Read and write files', orderIndex: 7 },
      { id: 'p9', levelIndex: 8, title: 'Modules and Packages', description: 'Import and organize code', orderIndex: 8 },
      { id: 'p10', levelIndex: 9, title: 'Error Handling', description: 'Exceptions', orderIndex: 9 },
      { id: 'p11', levelIndex: 10, title: 'Working with APIs', description: 'HTTP requests with requests', orderIndex: 10 },
      { id: 'p12', levelIndex: 11, title: 'Final Project', description: 'Build a Python application', orderIndex: 11 },
    ],
  },
];

export function getCourseBySlug(slug: string) {
  return courses.find(c => c.slug === slug) || null;
}

export function getCourseRoadmap(courseId: string) {
  const course = courses.find(c => c.id === courseId);
  if (!course) return null;
  return { ...course, levels: course.levels };
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;
  const allLessons = course.levels.flatMap((l: any) =>
    (l.lessons || []).map((ls: any) => ({ ...ls, levelTitle: l.title }))
  );
  const lesson = allLessons.find((l: any) => l.slug === lessonSlug);
  if (!lesson) return null;
  return {
    id: `lesson-${lessonSlug}`,
    levelId: '1',
    slug: lessonSlug,
    orderIndex: 0,
    difficulty: 'beginner',
    estimatedTime: '15 min',
    isLocked: false,
    title: lesson.title,
    level: { id: '1', levelIndex: 0, title: lesson.levelTitle },
    theory: `This lesson covers ${lessonSlug.replace(/-/g, ' ')}. You will learn the fundamental concepts and practical applications.`,
    exampleCode: `// Example code for ${lessonSlug.replace(/-/g, ' ')}\nconsole.log('Hello, World!');`,
    exampleExplanation: 'This example demonstrates the basic syntax and structure.',
    tryIt: 'Try modifying the code above and see the results.',
    commonMistakes: 'A common mistake is forgetting to close tags or misspell property names.',
    tips: 'Always test your code as you go and use comments to explain your logic.',
    summary: `By the end of this lesson, you should understand ${lessonSlug.replace(/-/g, ' ')}.`,
    syntax: '// Basic syntax\nfunction example() {\n  return "Hello";\n}',
    content: {},
  };
}
