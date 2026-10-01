'use client';

import { create } from 'zustand';

interface LearningState {
  completedLessons: string[];
  xp: number;
  streak: number;
  completeLesson: (lessonId: string, reward?: number) => void;
  resetProgress: () => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  completedLessons: [],
  xp: 0,
  streak: 0,
  completeLesson: (lessonId, reward = 20) => set((state) => {
    if (state.completedLessons.includes(lessonId)) return state;
    return { completedLessons: [...state.completedLessons, lessonId], xp: state.xp + reward, streak: Math.max(1, state.streak) };
  }),
  resetProgress: () => set({ completedLessons: [], xp: 0, streak: 0 }),
}));
