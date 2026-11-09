'use client';

import { create } from 'zustand';
import { AuthChangeEvent, User as SupabaseUser } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { useLearningProgressStore } from '@/store/learningProgressStore';

export type UserRole = 'creator' | 'admin' | 'user';
export type OAuthProvider = 'google' | 'github';

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
  signInWithOAuth: (provider: OAuthProvider, destination: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<{ success: boolean; message: string }>;
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
  if (code === 'Invalid login credentials') return 'Email yoki parol notöğri.';
  if (code === 'User already registered') return 'Uşbu email bilan allaqaçon hisob oçilgan. Tizimga kiring.';
  if (code === 'weak_password') return 'Parol juda oddiy. Kamida 6 ta belgi kiriting.';
  if (code === 'email_address_invalid') return 'Email formati notöğri.';
  const message = (error as { message?: string })?.message;
  const lowerMessage = message?.toLowerCase() ?? '';
  if (
    code === 'over_email_send_rate_limit' ||
    code === 'email_rate_limit_exceeded' ||
    lowerMessage.includes('email rate limit exceeded') ||
    lowerMessage.includes('over_email_send_rate_limit')
  ) {
    return 'Tasdiqlaş xatlarini yuboriş limiti tugadi. Keyinroq qayta urinib köring yoki Supabase’da SMTP sozlang. Auth → Users’da hisob yaratilgan bölsa, qayta röyxatdan ötmang.';
  }
  if (code === 'otp_expired' || lowerMessage.includes('email link is invalid or has expired')) {
    return 'Tasdiqlaş havolasi eskirgan yoki oldin işlatilgan. Yangi tasdiqlaş xatini sörang.';
  }
  if (code === 'PGRST205' || (lowerMessage.includes('public.profiles') && lowerMessage.includes('schema cache'))) {
    return 'Supabase’da public.profiles jadvali topilmadi. SQL Editor’da barça migratsiyalarni işga tuşiring; jadval mavjud bölsa, API sxema keşini yangilang.';
  }
  return message ? `${fallback} ${message}` : fallback;
}

async function loadCurrentProfile(user: SupabaseUser, generation: number) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Foydalanuvçi profili topilmadi. Supabase bazasiga migration SQL qöllanganini tekşiring.');
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
    void useAuthStore.getState().fetchUsers().catch(error => console.error('Admin foydalanuvçilarini yuklab bölmadi.', error));
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
            console.error('Supabase profilini yuklab bölmadi.', error);
            set({ currentUser: null, users: [], initialized: true, loading: false });
          });
        }, 0);
      }).data.subscription.unsubscribe;
    } catch (error) {
      console.error('Supabase autentifikatsiyasini boşlaşda xatolik.', error);
      set({ currentUser: null, users: [], initialized: true, loading: false });
    }
  },

  login: async (emailInput, passwordInput) => {
    set({ loading: true });
    const email = emailInput.trim().toLowerCase();
    try {
      const { data, error } = await getSupabase().auth.signInWithPassword({ email, password: passwordInput });
      if (error) throw error;
      if (!data.user) throw new Error('Supabase foydalanuvçini qaytarmadi.');
      const generation = ++authGeneration;
      const loaded = await loadCurrentProfile(data.user, generation);
      return loaded ? { success: true } : { success: false, message: 'Uşbu hisob bloklangan. Boş administrator bilan boğlaning.' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: authError(error, 'Tizimga kirişda xatolik yuz berdi.') };
    }
  },

  signInWithOAuth: async (provider, destination) => {
    set({ loading: true });
    try {
      const redirectTo = new URL('/auth/callback', window.location.origin);
      redirectTo.searchParams.set('next', destination);
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectTo.toString() },
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error instanceof Error ? error.message : 'OAuth orqali tizimga kirib bo‘lmadi.';
      console.error(`${provider} OAuth boshlanmadi.`, error);
      return { success: false, message };
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
        options: {
          data: { name },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      if (!data.user) throw new Error('Supabase hisob yaratmadi.');
      if (!data.session) {
        set({ loading: false });
        return { success: true, message: 'Hisob yaratildi. Tizimga kirişdan oldin emailingizdagi tasdiqlaş havolasini bosing.' };
      }
      const generation = ++authGeneration;
      const loaded = await loadCurrentProfile(data.user, generation);
      return loaded ? { success: true, message: 'Muvaffaqiyatli röyxatdan ötdingiz!' } : { success: false, message: 'Uşbu hisob bloklangan. Boş administrator bilan boğlaning.' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: authError(error, 'Röyxatdan ötişda xatolik yuz berdi.') };
    }
  },

  resendConfirmation: async emailInput => {
    try {
      const { error } = await getSupabase().auth.resend({
        type: 'signup',
        email: emailInput.trim().toLowerCase(),
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      return { success: true, message: 'Tasdiqlaş xati emailingizga qayta yuborildi.' };
    } catch (error) {
      return { success: false, message: authError(error, 'Tasdiqlaş xatini yuborib bölmadi.') };
    }
  },

  logout: async () => {
    const generation = ++authGeneration;
    const { error } = await getSupabase().auth.signOut();
    if (error) {
      console.error('Supabase hisobidan çiqişda xatolik.', error);
      throw error;
    }

    if (generation === authGeneration) {
      useLearningProgressStore.getState().initialize(null);
      set({ currentUser: null, users: [], loading: false });
    }
  },

  updateAvatar: async file => {
    const currentUser = get().currentUser;
    if (!currentUser) return { success: false, message: 'Avatarni özgartiriş uçun tizimga kiring.' };

    const extensionByType: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/avif': 'avif',
    };
    const extension = extensionByType[file.type];
    if (!extension) {
      return { success: false, message: 'Faqat JPEG, PNG, WebP yoki AVIF rasmlarini tanlang.' };
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      return { success: false, message: 'Rasm hajmi 5 MB dan kichik bölişi kerak.' };
    }

    const supabase = getSupabase();
    const objectPath = `${currentUser.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(objectPath, file, { cacheControl: '3600', contentType: file.type, upsert: false });
    if (uploadError) {
      console.error('Avatar Supabase Storage’ga yuklanmadi.', uploadError);
      if (uploadError.message.toLowerCase().includes('bucket not found')) {
        return {
          success: false,
          message: 'Supabase’da avatars bucket topilmadi. supabase/migrations/20261109000100_profile_avatars.sql faylini Supabase SQL Editor’da ishga tushiring, so‘ng sahifani qayta yuklang.',
        };
      }
      return { success: false, message: `Avatarni yuklab bölmadi: ${uploadError.message}` };
    }

    const avatarUrl = supabase.storage.from('avatars').getPublicUrl(objectPath).data.publicUrl;
    const { data, error: profileError } = await supabase
      .from('profiles')
      .update({ avatar: avatarUrl })
      .eq('id', currentUser.id)
      .select('id')
      .maybeSingle();

    if (profileError || !data) {
      const { error: cleanupError } = await supabase.storage.from('avatars').remove([objectPath]);
      if (cleanupError) console.error('Saqlanmagan avatar faylini öçirib bölmadi.', cleanupError);
      const error = profileError || new Error('Foydalanuvçi profilini yangilab bölmadi.');
      console.error('Profil avatar manzili Supabase’da saqlanmadi.', error);
      return { success: false, message: authError(error, 'Avatar profilga saqlanmadi.') };
    }

    set(state => ({
      currentUser: state.currentUser?.id === currentUser.id
        ? { ...state.currentUser, avatar: avatarUrl }
        : state.currentUser,
      users: state.users.map(user => user.id === currentUser.id ? { ...user, avatar: avatarUrl } : user),
    }));

    if (currentUser.avatar) {
      try {
        const oldUrl = new URL(currentUser.avatar);
        const objectPrefix = '/storage/v1/object/public/avatars/';
        if (oldUrl.pathname.includes(objectPrefix)) {
          const oldPath = decodeURIComponent(oldUrl.pathname.split(objectPrefix)[1] || '');
          if (oldPath.startsWith(`${currentUser.id}/`)) {
            const { error: removeError } = await supabase.storage.from('avatars').remove([oldPath]);
            if (removeError) console.error('Oldingi avatar faylini öçirib bölmadi.', removeError);
          }
        }
      } catch (error) {
        console.error('Oldingi avatar manzilini tekşirib bölmadi.', error);
      }
    }

    return { success: true, message: 'Avatar muvaffaqiyatli yangilandi.' };
  },

  updateUserRole: async (targetUserId, newRole) => {
    const currentUser = get().currentUser;
    if (currentUser?.role !== 'creator') return { success: false, message: 'Faqat Creator foydalanuvchi rolini o‘zgartirishi mumkin.' };
    if (currentUser.id === targetUserId) return { success: false, message: 'O‘zingizning rolingizni o‘zgartira olmaysiz.' };
    const { error } = await getSupabase().rpc('set_user_role', { target_id: targetUserId, new_role: newRole });
    if (error) return { success: false, message: authError(error, 'Rol Supabase bazasida saqlanmadi.') };
    set(state => ({
      users: state.users.map(user => user.id === targetUserId ? { ...user, role: newRole } : user),
      ...(state.currentUser?.id === targetUserId
        ? { currentUser: { ...state.currentUser, role: newRole } }
        : {}),
    }));
    return { success: true, message: `Rol muvaffaqiyatli özgartirildi: ${newRole.toUpperCase()}` };
  },

  toggleUserStatus: async targetUserId => {
    const currentUser = get().currentUser;
    if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) return { success: false, message: 'Ruxsat berilmagan.' };
    const target = get().users.find(user => user.id === targetUserId);
    if (!target) return { success: false, message: 'Foydalanuvçi topilmadi.' };
    if (target.role === 'creator') return { success: false, message: 'Boş Adminni bloklab bölmaydi.' };
    const newStatus = target.status === 'active' ? 'banned' : 'active';
    const { error } = await getSupabase().rpc('set_user_status', { target_id: targetUserId, new_status: newStatus });
    if (error) return { success: false, message: authError(error, 'Foydalanuvçi holati Supabase bazasida yangilanmadi.') };
    set({ users: get().users.map(user => user.id === targetUserId ? { ...user, status: newStatus } : user) });
    return { success: true, message: `Holat yangilandi: ${newStatus === 'active' ? 'Faol' : 'Bloklangan'}` };
  },
}));
