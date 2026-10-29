'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export interface SavedLesson {
  courseId: string;
  lessonId: string;
  note: string;
  saved: boolean;
  updatedAt: string;
}

export interface LessonFeedback {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  message: string;
  status: 'open' | 'reviewed';
  createdAt: string;
}

interface LearningExtrasState {
  userId: string | null;
  savedLessons: Record<string, SavedLesson>;
  syncError: string | null;
  initialize: (userId: string | null) => void;
  saveLesson: (courseId: string, lessonId: string, saved: boolean, note: string) => Promise<void>;
  submitFeedback: (courseId: string, lessonId: string, lessonTitle: string, message: string) => Promise<void>;
  loadFeedback: () => Promise<LessonFeedback[]>;
  markFeedbackReviewed: (feedbackId: string) => Promise<void>;
}

let savedLessonsChannel: ReturnType<ReturnType<typeof getSupabase>['channel']> | null = null;
const savedLessonKey = (courseId: string, lessonId: string) => `${courseId}__${lessonId}`;

async function fetchSavedLessons(userId: string) {
  const { data, error } = await getSupabase().from('saved_lessons')
    .select('course_id,lesson_id,note,is_saved,updated_at').eq('user_id', userId);
  if (error) throw error;
  const savedLessons: Record<string, SavedLesson> = {};
  (data || []).forEach(item => {
    if (typeof item.course_id !== 'string' || typeof item.lesson_id !== 'string' || typeof item.note !== 'string' || typeof item.is_saved !== 'boolean' || typeof item.updated_at !== 'string') {
      throw new Error(`Saqlangan dars yozuvi noto‘g‘ri: ${item.course_id}/${item.lesson_id}`);
    }
    savedLessons[savedLessonKey(item.course_id, item.lesson_id)] = {
      courseId: item.course_id,
      lessonId: item.lesson_id,
      note: item.note,
      saved: item.is_saved,
      updatedAt: item.updated_at,
    };
  });
  return savedLessons;
}

export const useLearningExtrasStore = create<LearningExtrasState>((set, get) => ({
  userId: null,
  savedLessons: {},
  syncError: null,

  initialize: userId => {
    if (get().userId === userId) return;
    if (savedLessonsChannel) void getSupabase().removeChannel(savedLessonsChannel);
    savedLessonsChannel = null;
    set({ userId, savedLessons: {}, syncError: null });
    if (!userId) return;
    void fetchSavedLessons(userId).then(savedLessons => {
      if (get().userId === userId) set({ savedLessons, syncError: null });
    }).catch(error => {
      console.error('Supabase saqlangan darslarni yuklab bo‘lmadi.', error);
      if (get().userId === userId) set({ syncError: error instanceof Error ? error.message : 'Saqlangan darslarni yuklab bo‘lmadi.' });
    });
    savedLessonsChannel = getSupabase().channel(`saved-lessons-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'saved_lessons', filter: `user_id=eq.${userId}` }, () => {
        void fetchSavedLessons(userId).then(savedLessons => {
          if (get().userId === userId) set({ savedLessons, syncError: null });
        }).catch(error => {
          if (get().userId === userId) set({ syncError: error instanceof Error ? error.message : 'Saqlangan darslarni yangilab bo‘lmadi.' });
        });
      })
      .subscribe();
  },

  saveLesson: async (courseId, lessonId, saved, note) => {
    const userId = get().userId;
    if (!userId) throw new Error('Darsni saqlash uchun tizimga kiring.');
    const cleanNote = note.trim();
    if (!saved && !cleanNote) {
      const { error } = await getSupabase().from('saved_lessons').delete()
        .eq('user_id', userId).eq('course_id', courseId).eq('lesson_id', lessonId);
      if (error) throw error;
      set(state => {
        const next = { ...state.savedLessons };
        delete next[savedLessonKey(courseId, lessonId)];
        return { savedLessons: next };
      });
      return;
    }
    const updatedAt = new Date().toISOString();
    const { error } = await getSupabase().from('saved_lessons').upsert({
      user_id: userId, course_id: courseId, lesson_id: lessonId, note: cleanNote, is_saved: saved, updated_at: updatedAt,
    });
    if (error) throw error;
    set(state => ({
      savedLessons: {
        ...state.savedLessons,
        [savedLessonKey(courseId, lessonId)]: { courseId, lessonId, note: cleanNote, saved, updatedAt },
      },
    }));
  },

  submitFeedback: async (courseId, lessonId, lessonTitle, message) => {
    const userId = get().userId;
    const cleanMessage = message.trim();
    if (!userId) throw new Error('Taklif yuborish uchun tizimga kiring.');
    if (cleanMessage.length < 8 || cleanMessage.length > 2000) throw new Error('Xabar 8 dan 2000 tagacha belgidan iborat bo‘lishi kerak.');
    const { error } = await getSupabase().from('lesson_feedback').insert({
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      lesson_title: lessonTitle.slice(0, 200),
      message: cleanMessage,
    });
    if (error) throw error;
  },

  loadFeedback: async () => {
    const { data, error } = await getSupabase().from('lesson_feedback')
      .select('id,user_id,course_id,lesson_id,lesson_title,message,status,created_at').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(item => {
      if (typeof item.user_id !== 'string' || typeof item.course_id !== 'string' || typeof item.lesson_id !== 'string' || typeof item.lesson_title !== 'string' || typeof item.message !== 'string' || !['open', 'reviewed'].includes(item.status) || typeof item.created_at !== 'string') {
        throw new Error(`Dars fikri formati noto‘g‘ri: ${item.id}`);
      }
      return {
        id: item.id,
        userId: item.user_id,
        courseId: item.course_id,
        lessonId: item.lesson_id,
        lessonTitle: item.lesson_title,
        message: item.message,
        status: item.status as LessonFeedback['status'],
        createdAt: item.created_at,
      };
    });
  },

  markFeedbackReviewed: async feedbackId => {
    const { error } = await getSupabase().from('lesson_feedback').update({ status: 'reviewed' }).eq('id', feedbackId);
    if (error) throw error;
  },
}));
