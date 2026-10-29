'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface ExerciseCheck {
  id: string;
  label: string;
  selector: string;
  type: 'element' | 'text' | 'style';
  expected?: string;
  property?: string;
}

export interface LessonExercise {
  instructions: string;
  checks: ExerciseCheck[];
}

export interface LessonTranslation {
  title?: string;
  description?: string;
  theory?: string;
  exercise?: {
    instructions?: string;
    checks?: Record<string, { label?: string; expected?: string }>;
  };
  quiz?: Record<string, { question?: string; options?: string[]; explanation?: string }>;
}

export interface LevelItem {
  id: string;
  slug?: string;
  levelIndex: number;
  title: string;
  description: string;
  theory?: string;
  editorLanguage?: 'html' | 'css' | 'javascript';
  starterCode?: string;
  quiz?: QuizQuestion[];
  exercise?: LessonExercise | null;
  translations?: Partial<Record<'en' | 'ru' | 'uz', LessonTranslation>>;
  orderIndex: number;
  lessons?: { id: string; slug: string; title: string; duration?: string }[];
}

export interface CourseItem {
  id: string;
  slug: string;
  languageCode: string;
  iconUrl?: string | null;
  translations?: Partial<Record<'en' | 'ru' | 'uz', { title?: string; description?: string }>>;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  levels: LevelItem[];
  deleted?: boolean;
}

interface CourseState {
  courses: CourseItem[];
  initialized: boolean;
  syncError: string | null;
  initialize: () => Promise<void>;
  addCourse: (course: Omit<CourseItem, 'id' | 'createdAt'>) => Promise<{ success: boolean; message: string }>;
  updateCourse: (id: string, updates: Partial<CourseItem>) => Promise<{ success: boolean; message: string }>;
  deleteCourse: (id: string) => Promise<{ success: boolean; message: string }>;
  addLevel: (courseId: string, level: Omit<LevelItem, 'id'>) => Promise<{ success: boolean; message: string }>;
  updateLevel: (courseId: string, levelId: string, updates: Partial<LevelItem>) => Promise<{ success: boolean; message: string }>;
  deleteLevel: (courseId: string, levelId: string) => Promise<{ success: boolean; message: string }>;
  moveLevel: (courseId: string, levelId: string, direction: -1 | 1) => Promise<{ success: boolean; message: string }>;
}

const COLLECTION = 'courses';
let courseChannel: ReturnType<ReturnType<typeof getSupabase>['channel']> | null = null;
let initialization: Promise<void> | null = null;

function readCourseData(row: Record<string, unknown>): CourseItem {
  return {
    id: String(row.id),
    slug: String(row.slug),
    languageCode: String(row.language_code),
    iconUrl: typeof row.icon_url === 'string' ? row.icon_url : null,
    title: String(row.title),
    description: String(row.description || ''),
    difficulty: row.difficulty as CourseItem['difficulty'],
    orderIndex: Number(row.order_index),
    isActive: Boolean(row.is_active),
    createdAt: String(row.created_at),
    levels: Array.isArray(row.levels) ? row.levels as LevelItem[] : [],
    translations: row.translations as CourseItem['translations'],
    deleted: Boolean(row.deleted),
  };
}

function supabaseError(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === '42501' || code === 'PGRST301') return 'Supabase ruxsat bermadi. Administrator roli va RLS migration sozlamalarini tekshiring.';
  return `Supabase ma’lumotni saqlay olmadi: ${(error as { message?: string })?.message || 'Ulanish yoki baza sozlamalarini tekshiring.'}`;
}

function courseRow(course: CourseItem) {
  return {
    id: course.id,
    slug: course.slug,
    language_code: course.languageCode,
    icon_url: course.iconUrl || null,
    title: course.title,
    description: course.description,
    difficulty: course.difficulty,
    order_index: course.orderIndex,
    is_active: course.isActive,
    deleted: Boolean(course.deleted),
    levels: course.levels || [],
    translations: course.translations || null,
  };
}

async function fetchCourses() {
  const { data, error } = await getSupabase().from(COLLECTION).select('*').order('order_index');
  if (error) throw error;
  return (data || []).map(row => readCourseData(row as Record<string, unknown>)).filter(course => !course.deleted);
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  initialized: false,
  syncError: null,

  initialize: async () => {
    if (initialization) await initialization;
    if (get().initialized) return;
    initialization = fetchCourses().then(courses => {
      set({ courses, initialized: true, syncError: null });
      if (!courseChannel && typeof window !== 'undefined') {
        courseChannel = getSupabase().channel('public-courses')
          .on('postgres_changes', { event: '*', schema: 'public', table: COLLECTION }, () => {
            void fetchCourses().then(next => set({ courses: next, syncError: null })).catch(error => {
              set({ syncError: supabaseError(error) });
            });
          })
          .subscribe(status => {
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              set({ syncError: 'Supabase real-time obunasi ulanmayapti. Kurslar sahifani yangilaganda qayta yuklanadi.' });
            }
          });
      }
    }).catch(error => {
      set({ courses: [], initialized: true, syncError: supabaseError(error) });
    }).finally(() => { initialization = null; });
    return initialization;
  },

  addCourse: async courseData => {
    const id = `course-${courseData.slug}`;
    const newCourse: CourseItem = { ...courseData, id, createdAt: new Date().toISOString(), levels: courseData.levels || [], deleted: false };
    try {
      const { error } = await getSupabase().from(COLLECTION).insert(courseRow(newCourse));
      if (error) throw error;
      const courses = [...get().courses.filter(course => course.id !== id), newCourse].sort((a, b) => a.orderIndex - b.orderIndex);
      set({ courses, syncError: null });
      return { success: true, message: 'Kurs Supabase bazasiga saqlandi.' };
    } catch (error) { return { success: false, message: supabaseError(error) }; }
  },

  updateCourse: async (id, updates) => {
    const current = get().courses.find(course => course.id === id);
    if (!current) return { success: false, message: 'Kurs topilmadi.' };
    const updated = { ...current, ...updates, id, deleted: false };
    try {
      const { error } = await getSupabase().from(COLLECTION).upsert(courseRow(updated));
      if (error) throw error;
      const courses = get().courses.map(course => course.id === id ? updated : course);
      set({ courses, syncError: null });
      return { success: true, message: 'Kurs Supabase bazasida yangilandi.' };
    } catch (error) { return { success: false, message: supabaseError(error) }; }
  },

  deleteCourse: async id => {
    const course = get().courses.find(item => item.id === id);
    if (!course) return { success: false, message: 'Kurs topilmadi.' };
    try {
      const { error } = await getSupabase().from(COLLECTION).update({ deleted: true, is_active: false }).eq('id', id);
      if (error) throw error;
      set({ courses: get().courses.filter(item => item.id !== id), syncError: null });
      return { success: true, message: 'Kurs saytdan olib tashlandi.' };
    } catch (error) { return { success: false, message: supabaseError(error) }; }
  },

  addLevel: async (courseId, levelData) => {
    const course = get().courses.find(item => item.id === courseId);
    if (!course) return { success: false, message: 'Kurs topilmadi.' };
    const slug = levelData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const level: LevelItem = { ...levelData, id: `lesson-${crypto.randomUUID()}`, slug };
    return get().updateCourse(courseId, { levels: [...course.levels, level] });
  },

  updateLevel: async (courseId, levelId, updates) => {
    const course = get().courses.find(item => item.id === courseId);
    if (!course) return { success: false, message: 'Kurs topilmadi.' };
    return get().updateCourse(courseId, { levels: course.levels.map(level => level.id === levelId ? { ...level, ...updates } : level) });
  },

  deleteLevel: async (courseId, levelId) => {
    const course = get().courses.find(item => item.id === courseId);
    if (!course) return { success: false, message: 'Kurs topilmadi.' };
    return get().updateCourse(courseId, { levels: course.levels.filter(level => level.id !== levelId) });
  },

  moveLevel: async (courseId, levelId, direction) => {
    const course = get().courses.find(item => item.id === courseId);
    if (!course) return { success: false, message: 'Kurs topilmadi.' };
    const levels = [...course.levels].sort((a, b) => a.orderIndex - b.orderIndex);
    const index = levels.findIndex(level => level.id === levelId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= levels.length) return { success: false, message: 'Dars tartibini o‘zgartirib bo‘lmadi.' };
    [levels[index], levels[target]] = [levels[target], levels[index]];
    return get().updateCourse(courseId, { levels: levels.map((level, orderIndex) => ({ ...level, orderIndex, levelIndex: orderIndex })) });
  },

}));
