'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export interface DailyChallengeResult {
  date: string;
  challengeId: string;
  passedCount: number;
  total: number;
  completed: boolean;
}

interface DailyChallengeState {
  userId: string | null;
  result: DailyChallengeResult | null;
  initialize: (userId: string | null) => void;
  load: (date: string, userId: string) => Promise<DailyChallengeResult | null>;
  save: (result: DailyChallengeResult, userId: string) => Promise<void>;
}

export const useDailyChallengeStore = create<DailyChallengeState>((set, get) => ({
  userId: null,
  result: null,
  initialize: userId => {
    if (get().userId !== userId) set({ userId, result: null });
  },
  load: async (date, userId) => {
    const { data, error } = await getSupabase().from('daily_challenges')
      .select('challenge_date,challenge_id,passed_count,total,completed')
      .eq('user_id', userId).eq('challenge_date', date).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    if (data.challenge_date !== date || typeof data.challenge_id !== 'string' || !Number.isInteger(data.passed_count) || !Number.isInteger(data.total) || data.total < 1 || data.passed_count < 0 || data.passed_count > data.total || typeof data.completed !== 'boolean' || data.completed !== (data.passed_count === data.total)) {
      throw new Error('Kunlik mashq natijasi formati noto‘g‘ri.');
    }
    const result: DailyChallengeResult = {
      date: data.challenge_date,
      challengeId: data.challenge_id,
      passedCount: data.passed_count,
      total: data.total,
      completed: data.completed,
    };
    if (get().userId === userId) set({ result });
    return result;
  },
  save: async (result, userId) => {
    if (get().userId !== userId) throw new Error('Hisob o‘zgargani sababli natijani saqlab bo‘lmadi.');
    if (!Number.isInteger(result.passedCount) || !Number.isInteger(result.total) || result.total < 1 || result.passedCount < 0 || result.passedCount > result.total || result.completed !== (result.passedCount === result.total)) {
      throw new Error('Kunlik mashq natijasi yaroqsiz.');
    }
    const { error } = await getSupabase().from('daily_challenges').upsert({
      user_id: userId,
      challenge_date: result.date,
      challenge_id: result.challengeId,
      passed_count: result.passedCount,
      total: result.total,
      completed: result.completed,
    });
    if (error) throw error;
    set({ result });
  },
}));
