export interface Course {
  id: string;
  slug: string;
  languageCode: string;
  iconUrl: string | null;
  description: string | null;
  difficulty: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  title?: string;
  translations?: Partial<Record<'en' | 'ru' | 'uz', { title?: string; description?: string }>>;
  levels?: any[];
}

export interface Level {
  id: string;
  courseId: string;
  levelIndex: number;
  title: string | null;
  description: string | null;
  orderIndex: number;
}

export interface Lesson {
  id: string;
  levelId: string;
  slug: string;
  orderIndex: number;
  difficulty: string;
  estimatedTime: string | null;
  isLocked: boolean;
  title?: string;
  level?: any;
  theory?: string;
  description?: string;
  videoUrl?: string;
  editorLanguage?: 'html' | 'css' | 'javascript';
  starterCode?: string;
  quiz?: { id: string; question: string; options: string[]; correctIndex: number; explanation?: string }[];
  exercise?: {
    instructions: string;
    checks: { id: string; label: string; selector: string; type: 'element' | 'text' | 'style'; expected?: string; property?: string }[];
  } | null;
  exampleCode?: string;
  exampleExplanation?: string;
  tryIt?: string;
  commonMistakes?: string;
  tips?: string;
  summary?: string;
  syntax?: string;
  content?: Record<string, string> | null;
}

export interface LessonTranslation {
  id: string;
  lessonId: string;
  language: string;
  title: string;
  theory: string | null;
  exampleCode: string | null;
  exampleExplanation: string | null;
  tryIt: string | null;
  commonMistakes: string | null;
  tips: string | null;
  summary: string | null;
  syntax: string | null;
  content: Record<string, string> | null;
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  levelId: string | null;
  lessonId: string | null;
  isCompleted: boolean;
  xpEarned: number;
  completedLevels: number[];
  completedLessons: number[];
  totalLessons: number;
}
