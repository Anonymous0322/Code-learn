'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export interface StudyPlan {
  weekStart: string;
  goal: number;
  lessonIds: string[];
  updatedAt: string;
}

interface StudyPlanState {
  userId: string | null;
  plan: StudyPlan | null;
  initialize: (userId: string | null) => void;
  load: (userId: string) => Promise<StudyPlan | null>;
  save: (userId: string, plan: Omit<StudyPlan, 'updatedAt'>) => Promise<void>;
}

export const useStudyPlanStore = create<StudyPlanState>((set, get) => ({
  userId: null,
  plan: null,
  initialize: userId => {
    if (get().userId !== userId) set({ userId, plan: null });
  },
  load: async userId => {
    const { data, error } = await getSupabase().from('study_plans').select('week_start,goal,lesson_ids,updated_at')
      .eq('user_id', userId).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    if (typeof data.week_start !== 'string' || !Number.isInteger(data.goal) || !Array.isArray(data.lesson_ids) || !data.lesson_ids.every(id => typeof id === 'string') || typeof data.updated_at !== 'string') {
      throw new Error('Saqlangan haftalik reja formati noto‘g‘ri.');
    }
    const plan: StudyPlan = { weekStart: data.week_start, goal: data.goal, lessonIds: data.lesson_ids, updatedAt: data.updated_at };
    if (get().userId === userId) set({ plan });
    return plan;
  },
  save: async (userId, plan) => {
    if (get().userId !== userId) throw new Error('Hisob o‘zgargani sababli rejani saqlab bo‘lmadi.');
    if (!Number.isInteger(plan.goal) || plan.goal < 1 || plan.goal > 30 || plan.lessonIds.length > 30 || plan.lessonIds.some(id => !id || id.length > 400)) {
      throw new Error('Haftalik maqsad yoki darslar soni yaroqsiz.');
    }
    const saved: StudyPlan = { ...plan, updatedAt: new Date().toISOString() };
    const { error } = await getSupabase().from('study_plans').upsert({
      user_id: userId,
      week_start: plan.weekStart,
      goal: plan.goal,
      lesson_ids: plan.lessonIds,
      updated_at: saved.updatedAt,
    });
    if (error) throw error;
    set({ plan: saved });
  },
}));
