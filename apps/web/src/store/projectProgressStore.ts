'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export interface ProjectProgress {
  completedSteps: number[];
  code: string;
}

interface ProjectProgressState {
  userId: string | null;
  projects: Record<string, ProjectProgress>;
  initialize: (userId: string | null) => void;
  load: (projectId: string, userId: string) => Promise<ProjectProgress | null>;
  loadAll: (userId: string) => Promise<Record<string, ProjectProgress>>;
  save: (projectId: string, userId: string, progress: ProjectProgress) => Promise<void>;
}

function parseProgress(data: { completed_steps: number[]; code: string }, id: string): ProjectProgress {
  if (!Array.isArray(data.completed_steps) || !data.completed_steps.every(Number.isInteger) || typeof data.code !== 'string') {
    throw new Error(`Saqlangan loyiha holati formati noto‘g‘ri: ${id}`);
  }
  return { completedSteps: data.completed_steps, code: data.code };
}

export const useProjectProgressStore = create<ProjectProgressState>((set, get) => ({
  userId: null,
  projects: {},

  initialize: userId => {
    if (get().userId !== userId) set({ userId, projects: {} });
  },

  load: async (projectId, userId) => {
    const { data, error } = await getSupabase().from('project_progress').select('completed_steps,code')
      .eq('user_id', userId).eq('project_id', projectId).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const progress = parseProgress(data, projectId);
    if (get().userId === userId) set(state => ({ projects: { ...state.projects, [projectId]: progress } }));
    return progress;
  },

  loadAll: async userId => {
    const { data, error } = await getSupabase().from('project_progress').select('project_id,completed_steps,code').eq('user_id', userId);
    if (error) throw error;
    const projects: Record<string, ProjectProgress> = {};
    (data || []).forEach(item => { projects[item.project_id] = parseProgress(item, item.project_id); });
    if (get().userId === userId) set({ projects });
    return projects;
  },

  save: async (projectId, userId, progress) => {
    if (progress.code.length > 20000 || progress.completedSteps.length > 50 || !progress.completedSteps.every(Number.isInteger)) {
      throw new Error('Loyiha kodi yoki bajarilgan bosqichlar ruxsat etilgan hajmdan oshdi.');
    }
    const { error } = await getSupabase().from('project_progress').upsert({
      user_id: userId,
      project_id: projectId,
      completed_steps: progress.completedSteps,
      code: progress.code,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    if (get().userId === userId) set(state => ({ projects: { ...state.projects, [projectId]: progress } }));
  },
}));
