export type Language = 'en' | 'uz' | 'ru';

export interface Translation {
  en: string;
  uz: string;
  ru: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'admin';
  createdAt: string;
  xp: number;
  level: number;
  streak: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  level: number;
  lessons: number;
  color: string;
  icon: string;
  translations: Translation;
}

export interface Lesson {
  id: string;
  courseId: string;
  level: number;
  title: string;
  content: string;
  codeExample: string;
  exercise?: string;
  quiz?: Quiz;
  order: number;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}
