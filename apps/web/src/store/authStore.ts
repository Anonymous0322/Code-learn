'use client';

import { create } from 'zustand';
import { AuthChangeEvent, User as SupabaseUser } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { useLearningProgressStore } from '@/store/learningProgressStore';

export type UserRole = 'creator' | 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'banned';
}

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string | null;
  created_at: string;
}

interface AuthState {
  currentUser: AuthUser | null;
  users: AuthUser[];
  initialized: boolean;
  loading: boolean;
  initialize: () => void;
  fetchUsers: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUserRole: (targetUserId: string, newRole: UserRole) => Promise<{ success: boolean; message: string }>;
  toggleUserStatus: (targetUserId: string) => Promise<{ success: boolean; message: string }>;
}

let authUnsubscribe: (() => void) | null = null;
let authGeneration = 0;

function roleFrom(value: string): UserRole {
  return value === 'creator' || value === 'admin' ? value : 'user';
}

function profileToUser(profile: ProfileRow): AuthUser {
  return {
    id: profile.id,
    name: profile.name || profile.email.split('@')[0],
    email: profile.email,
    role: roleFrom(profile.role),
    status: profile.status === 'banned' ? 'banned' : 'active',
    createdAt: profile.created_at,
    ...(profile.avatar ? { avatar: profile.avatar } : {}),
  };
}

function authError(error: unknown, fallback: string) {
  const code = (error as { code?: string })?.code;
  if (code === 'Invalid login credentials') return 'Email yoki parol noto‘g‘ri.';
  if (code === 'User already registered') return 'Ushbu email bilan allaqachon hisob ochilgan. Tizimga kiring.';
  if (code === 'weak_password') return 'Parol juda oddiy. Kamida 6 ta belgi kiriting.';
  if (code === 'email_address_invalid') return 'Email formati noto‘g‘ri.';
  const message = (error as { message?: string })?.message;
  return message ? `${fallback} ${message}` : fallback;
}

async function loadCurrentProfile(user: SupabaseUser, generation: number) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Foydalanuvchi profili topilmadi. Supabase bazasiga migration SQL qo‘llanganini tekshiring.');
  if (generation !== authGeneration) return;
  const currentUser = profileToUser(data as ProfileRow);
  if (currentUser.status === 'banned') {
    await supabase.auth.signOut();
    useLearningProgressStore.getState().initialize(null);
    useAuthStore.setState({ currentUser: null, users: [], initialized: true, loading: false });
    return false;
  }
  useAuthStore.setState({ currentUser, initialized: true, loading: false });
  useLearningProgressStore.getState().initialize(currentUser.id);
  void useLearningProgressStore.getState().recordVisit().catch(error => {
    console.error('Supabase faollik kunini yozolmadi.', error);
  });
  if (currentUser.role === 'creator' || currentUser.role === 'admin') {
    void useAuthStore.getState().fetchUsers().catch(error => console.error('Admin foydalanuvchilarini yuklab bo‘lmadi.', error));
  } else {
    useAuthStore.setState({ users: [] });
  }
  return true;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  users: [],
  initialized: false,
  loading: false,

  fetchUsers: async () => {
    const currentUser = get().currentUser;
    if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) {
      set({ users: [] });
      return;
    }
    const { data, error } = await getSupabase()
      .from('profiles')
      .select('id,name,email,role,status,avatar,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    set({ users: (data || []).map(row => profileToUser(row as ProfileRow)) });
  },

  initialize: () => {
    if (typeof window === 'undefined' || authUnsubscribe) return;
    try {
      const supabase = getSupabase();
      authUnsubscribe = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session) => {
        const generation = ++authGeneration;
        if (!session?.user) {
          useLearningProgressStore.getState().initialize(null);
          set({ currentUser: null, users: [], initialized: true, loading: false });
          return;
        }
        set({ loading: true });
        window.setTimeout(() => {
          void loadCurrentProfile(session.user, generation).catch(error => {
            if (generation !== authGeneration) return;
            console.error('Supabase profilini yuklab bo‘lmadi.', error);
            set({ currentUser: null, users: [], initialized: true, loading: false });
          });
        }, 0);
      }).data.subscription.unsubscribe;
    } catch (error) {
      console.error('Supabase autentifikatsiyasini boshlashda xatolik.', error);
      set({ currentUser: null, users: [], initialized: true, loading: false });
    }
  },

  login: async (emailInput, passwordInput) => {
    set({ loading: true });
    const email = emailInput.trim().toLowerCase();
    try {
      const { data, error } = await getSupabase().auth.signInWithPassword({ email, password: passwordInput });
      if (error) throw error;
      if (!data.user) throw new Error('Supabase foydalanuvchini qaytarmadi.');
      const generation = ++authGeneration;
      const loaded = await loadCurrentProfile(data.user, generation);
      return loaded ? { success: true } : { success: false, message: 'Ushbu hisob bloklangan. Bosh administrator bilan bog‘laning.' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: authError(error, 'Tizimga kirishda xatolik yuz berdi.') };
    }
  },

  register: async (nameInput, emailInput, passwordInput) => {
    set({ loading: true });
    const email = emailInput.trim().toLowerCase();
    const name = nameInput.trim();
    try {
      const { data, error } = await getSupabase().auth.signUp({
        email,
        password: passwordInput,
        options: { data: { name } },
      });
      if (error) throw error;
      if (!data.user) throw new Error('Supabase hisob yaratmadi.');
      if (!data.session) {
        set({ loading: false });
        return { success: true, message: 'Hisob yaratildi. Tizimga kirishdan oldin emailingizdagi tasdiqlash havolasini bosing.' };
      }
      const generation = ++authGeneration;
      const loaded = await loadCurrentProfile(data.user, generation);
      return loaded ? { success: true, message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!' } : { success: false, message: 'Ushbu hisob bloklangan. Bosh administrator bilan bog‘laning.' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: authError(error, 'Ro‘yxatdan o‘tishda xatolik yuz berdi.') };
    }
  },

  logout: async () => {
    const generation = ++authGeneration;
    try {
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Supabase hisobidan chiqishda xatolik.', error);
    } finally {
      if (generation === authGeneration) {
        useLearningProgressStore.getState().initialize(null);
        set({ currentUser: null, users: [], loading: false });
      }
    }
  },

  updateUserRole: async (targetUserId, newRole) => {
    if (get().currentUser?.role !== 'creator') return { success: false, message: 'Faqat Bosh Admin foydalanuvchi rolini o‘zgartirishi mumkin.' };
    const { error } = await getSupabase().rpc('set_user_role', { target_id: targetUserId, new_role: newRole });
    if (error) return { success: false, message: authError(error, 'Rol Supabase bazasida saqlanmadi.') };
    set(state => ({
      users: state.users.map(user => user.id === targetUserId ? { ...user, role: newRole } : user),
      ...(state.currentUser?.id === targetUserId
        ? { currentUser: { ...state.currentUser, role: newRole } }
        : {}),
    }));
    return { success: true, message: `Rol muvaffaqiyatli o‘zgartirildi: ${newRole.toUpperCase()}` };
  },

  toggleUserStatus: async targetUserId => {
    const currentUser = get().currentUser;
    if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) return { success: false, message: 'Ruxsat berilmagan.' };
    const target = get().users.find(user => user.id === targetUserId);
    if (!target) return { success: false, message: 'Foydalanuvchi topilmadi.' };
    if (target.role === 'creator') return { success: false, message: 'Bosh Adminni bloklab bo‘lmaydi.' };
    const newStatus = target.status === 'active' ? 'banned' : 'active';
    const { error } = await getSupabase().rpc('set_user_status', { target_id: targetUserId, new_status: newStatus });
    if (error) return { success: false, message: authError(error, 'Foydalanuvchi holati Supabase bazasida yangilanmadi.') };
    set({ users: get().users.map(user => user.id === targetUserId ? { ...user, status: newStatus } : user) });
    return { success: true, message: `Holat yangilandi: ${newStatus === 'active' ? 'Faol' : 'Bloklangan'}` };
  },
}));
