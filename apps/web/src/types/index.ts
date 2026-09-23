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
