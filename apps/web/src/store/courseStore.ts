'use client';

import { create } from 'zustand';
import { courses as initialCourses } from '@/lib/data';

export interface LevelItem {
  id: string;
  levelIndex: number;
  title: string;
  description: string;
  orderIndex: number;
  lessons?: {
    id: string;
    slug: string;
    title: string;
    duration?: string;
  }[];
}

export interface CourseItem {
  id: string;
  slug: string;
  languageCode: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  levels: LevelItem[];
}

interface CourseState {
  courses: CourseItem[];
  initialized: boolean;
  initialize: () => void;
  addCourse: (course: Omit<CourseItem, 'id' | 'createdAt'>) => { success: boolean; message: string };
  updateCourse: (id: string, updates: Partial<CourseItem>) => { success: boolean; message: string };
  deleteCourse: (id: string) => { success: boolean; message: string };
  addLevel: (courseId: string, level: Omit<LevelItem, 'id'>) => { success: boolean; message: string };
  updateLevel: (courseId: string, levelId: string, updates: Partial<LevelItem>) => { success: boolean; message: string };
  deleteLevel: (courseId: string, levelId: string) => { success: boolean; message: string };
  resetToDefaults: () => void;
}

const COURSES_KEY = 'codelearn_dynamic_courses_v2';

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: initialCourses as CourseItem[],
  initialized: false,

  initialize: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(COURSES_KEY);
      if (stored) {
        set({ courses: JSON.parse(stored), initialized: true });
      } else {
        localStorage.setItem(COURSES_KEY, JSON.stringify(initialCourses));
        set({ courses: initialCourses as CourseItem[], initialized: true });
      }
    } catch {
      set({ courses: initialCourses as CourseItem[], initialized: true });
    }
  },

  addCourse: (courseData) => {
    const { courses } = get();
    const newCourse: CourseItem = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      levels: courseData.levels || [],
    };

    const updated = [...courses, newCourse];
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSES_KEY, JSON.stringify(updated));
    }
    set({ courses: updated });
    return { success: true, message: 'Kurs muvaffaqiyatli qo\'shildi!' };
  },

  updateCourse: (id, updates) => {
    const { courses } = get();
    const updated = courses.map((c) => (c.id === id ? { ...c, ...updates } : c));
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSES_KEY, JSON.stringify(updated));
    }
    set({ courses: updated });
    return { success: true, message: 'Kurs yangilandi!' };
  },

  deleteCourse: (id) => {
    const { courses } = get();
    const updated = courses.filter((c) => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSES_KEY, JSON.stringify(updated));
    }
    set({ courses: updated });
    return { success: true, message: 'Kurs o\'chirildi.' };
  },

  addLevel: (courseId, levelData) => {
    const { courses } = get();
    const newLevel: LevelItem = {
      ...levelData,
      id: `lvl-${Date.now()}`,
    };
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return { ...c, levels: [...c.levels, newLevel] };
      }
      return c;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSES_KEY, JSON.stringify(updated));
    }
    set({ courses: updated });
    return { success: true, message: 'Yangi modul/dars qo\'shildi!' };
  },

  updateLevel: (courseId, levelId, updates) => {
    const { courses } = get();
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          levels: c.levels.map((l) => (l.id === levelId ? { ...l, ...updates } : l)),
        };
      }
      return c;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSES_KEY, JSON.stringify(updated));
    }
    set({ courses: updated });
    return { success: true, message: 'Dars muvaffaqiyatli yangilandi!' };
  },

  deleteLevel: (courseId, levelId) => {
    const { courses } = get();
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          levels: c.levels.filter((l) => l.id !== levelId),
        };
      }
      return c;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSES_KEY, JSON.stringify(updated));
    }
    set({ courses: updated });
    return { success: true, message: 'Dars o\'chirildi.' };
  },

  resetToDefaults: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSES_KEY, JSON.stringify(initialCourses));
    }
    set({ courses: initialCourses as CourseItem[] });
  },
}));
