'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  submittedAt: string;
}

interface LearningProgressState {
  userId: string | null;
  completedLessonIds: string[];
  activeDays: string[];
  quizResults: Record<string, QuizResult>;
  loading: boolean;
  initialize: (userId: string | null) => void;
  recordVisit: () => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  loadQuizResult: (lessonId: string, userId: string) => Promise<QuizResult | null>;
  loadQuizResults: (userId: string) => Promise<Record<string, QuizResult>>;
  saveQuizResult: (lessonId: string, userId: string, score: number, total: number) => Promise<QuizResult>;
}

function parseQuizResult(data: Record<string, unknown>, id: string): QuizResult {
  if (typeof data.score !== 'number' || typeof data.total !== 'number' || typeof data.percentage !== 'number' || typeof data.submitted_at !== 'string') {
    throw new Error(`Saqlangan test natijasi formati noto‘g‘ri: ${id}`);
  }
  return { score: data.score, total: data.total, percentage: data.percentage, submittedAt: data.submitted_at };
}

export const useLearningProgressStore = create<LearningProgressState>((set, get) => ({
  userId: null,
  completedLessonIds: [],
  activeDays: [],
  quizResults: {},
  loading: false,

  initialize: userId => {
    if (get().userId === userId) return;
    set({ userId, completedLessonIds: [], activeDays: [], quizResults: {}, loading: Boolean(userId) });
    if (!userId) return;
    void (async () => {
      try {
        const { data, error } = await getSupabase().from('learning_progress').select('completed_lesson_ids,active_days').eq('user_id', userId).maybeSingle();
        if (error) throw error;
        if (get().userId !== userId) return;
        set({
          completedLessonIds: Array.isArray(data?.completed_lesson_ids) ? data.completed_lesson_ids : [],
          activeDays: Array.isArray(data?.active_days) ? data.active_days : [],
          loading: false,
        });
      } catch (error) {
        console.error('Supabase o‘quv jarayonini yuklab bo‘lmadi.', error);
        if (get().userId === userId) set({ loading: false });
      }
    })();
  },

  recordVisit: async () => {
    if (!get().userId) return;
    const { error } = await getSupabase().rpc('record_learning_visit');
    if (error) throw error;
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tashkent' });
    set(state => ({ activeDays: state.activeDays.includes(today) ? state.activeDays : [...state.activeDays, today] }));
  },

  completeLesson: async lessonId => {
    if (!get().userId) throw new Error('Dars jarayonini saqlash uchun tizimga kiring.');
    const { error } = await getSupabase().rpc('mark_lesson_complete', { lesson_key: lessonId });
    if (error) throw error;
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tashkent' });
    set(state => ({
      completedLessonIds: state.completedLessonIds.includes(lessonId) ? state.completedLessonIds : [...state.completedLessonIds, lessonId],
      activeDays: state.activeDays.includes(today) ? state.activeDays : [...state.activeDays, today],
    }));
  },

  loadQuizResult: async (lessonId, userId) => {
    const { data, error } = await getSupabase().from('quiz_results').select('score,total,percentage,submitted_at')
      .eq('user_id', userId).eq('lesson_id', lessonId).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const result = parseQuizResult(data, lessonId);
    if (get().userId === userId) set(state => ({ quizResults: { ...state.quizResults, [lessonId]: result } }));
    return result;
  },

  loadQuizResults: async userId => {
    const { data, error } = await getSupabase().from('quiz_results').select('lesson_id,score,total,percentage,submitted_at').eq('user_id', userId);
    if (error) throw error;
    const results: Record<string, QuizResult> = {};
    (data || []).forEach(item => { results[item.lesson_id] = parseQuizResult(item, item.lesson_id); });
    if (get().userId === userId) set({ quizResults: results });
    return results;
  },

  saveQuizResult: async (lessonId, userId, score, total) => {
    if (!Number.isInteger(score) || !Number.isInteger(total) || total < 1 || score < 0 || score > total) {
      throw new Error('Test natijasi qiymatlari noto‘g‘ri.');
    }
    const result: QuizResult = { score, total, percentage: Math.round(score * 100 / total), submittedAt: new Date().toISOString() };
    const { error } = await getSupabase().from('quiz_results').upsert({
      user_id: userId,
      lesson_id: lessonId,
      score,
      total,
      percentage: result.percentage,
      submitted_at: result.submittedAt,
    });
    if (error) throw error;
    if (get().userId === userId) set(state => ({ quizResults: { ...state.quizResults, [lessonId]: result } }));
    return result;
  },
}));
