'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export interface PublicPortfolioProject {
  id: string;
  title: string;
  code: string;
}

export interface PublicPortfolio {
  shareId: string;
  displayName: string;
  projects: PublicPortfolioProject[];
}

interface PortfolioSharingState {
  userId: string | null;
  shareId: string | null;
  initialize: (userId: string | null) => void;
  loadSettings: (userId: string) => Promise<string | null>;
  publish: (userId: string, displayName: string, projects: PublicPortfolioProject[]) => Promise<string>;
  unpublish: (userId: string, shareId: string) => Promise<void>;
  loadPublic: (shareId: string) => Promise<PublicPortfolio | null>;
}

function parsePublicPortfolio(data: unknown): PublicPortfolio | null {
  if (!data || typeof data !== 'object') return null;
  const row = data as Record<string, unknown>;
  if (typeof row.shareId !== 'string' || typeof row.displayName !== 'string' || !Array.isArray(row.projects)
    || row.projects.length > 3 || !row.projects.every(project => {
      if (!project || typeof project !== 'object') return false;
      const item = project as Record<string, unknown>;
      return typeof item.id === 'string' && typeof item.title === 'string' && typeof item.code === 'string' && item.code.length <= 20000;
    })) {
    throw new Error('Ommaviy portfolio ma’lumotlari noto‘g‘ri.');
  }
  return {
    shareId: row.shareId,
    displayName: row.displayName,
    projects: row.projects as PublicPortfolioProject[],
  };
}

export const usePortfolioSharingStore = create<PortfolioSharingState>((set, get) => ({
  userId: null,
  shareId: null,
  initialize: userId => {
    if (get().userId !== userId) set({ userId, shareId: null });
  },
  loadSettings: async userId => {
    const { data, error } = await getSupabase().from('user_portfolios').select('share_id,is_public')
      .eq('user_id', userId).maybeSingle();
    if (error) throw error;
    if (!data || !data.is_public) return null;
    if (typeof data.share_id !== 'string') throw new Error('Portfolio ulashish sozlamasi noto‘g‘ri.');
    if (get().userId === userId) set({ shareId: data.share_id });
    return data.share_id;
  },
  publish: async (userId, displayName, projects) => {
    if (get().userId !== userId) throw new Error('Hisob o‘zgargani sababli portfolio ulashilmadi.');
    const normalizedName = displayName.trim();
    if (!normalizedName || normalizedName.length > 80) throw new Error('Portfolio uchun 1–80 belgili ko‘rinadigan ism kiriting.');
    if (projects.length > 3 || projects.some(project => project.code.length > 20000)) throw new Error('Portfolio loyihalari ruxsat etilgan hajmdan oshdi.');
    const previous = await getSupabase().from('user_portfolios').select('share_id').eq('user_id', userId).maybeSingle();
    if (previous.error) throw previous.error;
    const shareId = previous.data?.share_id || crypto.randomUUID();
    const { error } = await getSupabase().from('user_portfolios').upsert({
      user_id: userId,
      share_id: shareId,
      display_name: normalizedName,
      projects,
      is_public: true,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    if (get().userId === userId) set({ shareId });
    return shareId;
  },
  unpublish: async (userId, shareId) => {
    if (get().userId !== userId) throw new Error('Hisob o‘zgargani sababli portfolio yashirilmadi.');
    const { error } = await getSupabase().from('user_portfolios')
      .update({ is_public: false, updated_at: new Date().toISOString() }).eq('user_id', userId).eq('share_id', shareId);
    if (error) throw error;
    set({ shareId: null });
  },
  loadPublic: async shareId => {
    const { data, error } = await getSupabase().rpc('get_public_portfolio', { requested_share_id: shareId });
    if (error) throw error;
    return parsePublicPortfolio(data);
  },
}));
