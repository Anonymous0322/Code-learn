'use client';

import { create } from 'zustand';

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

const DEFAULT_USERS: AuthUser[] = [
  {
    id: 'user-creator',
    name: 'Bosh Admin (Creator)',
    email: 'creator@codelearn.uz',
    role: 'creator',
    createdAt: '2024-01-01',
    status: 'active',
  },
  {
    id: 'user-admin',
    name: 'Admin Nazoratchi',
    email: 'admin@codelearn.uz',
    role: 'admin',
    createdAt: '2024-02-15',
    status: 'active',
  },
  {
    id: 'user-student',
    name: 'Dilshodbek (O\'quvchi)',
    email: 'user@codelearn.uz',
    role: 'user',
    createdAt: '2024-03-10',
    status: 'active',
  },
  {
    id: 'user-student-2',
    name: 'Malika Karimova',
    email: 'malika@codelearn.uz',
    role: 'user',
    createdAt: '2024-04-05',
    status: 'active',
  },
];

interface AuthState {
  currentUser: AuthUser | null;
  users: AuthUser[];
  initialized: boolean;
  initialize: () => void;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  loginAs: (role: UserRole) => void;
  register: (name: string, email: string) => { success: boolean; message?: string };
  logout: () => void;
  updateUserRole: (targetUserId: string, newRole: UserRole) => { success: boolean; message: string };
  toggleUserStatus: (targetUserId: string) => { success: boolean; message: string };
  deleteUser: (targetUserId: string) => { success: boolean; message: string };
  addUser: (user: Omit<AuthUser, 'id' | 'createdAt'>) => { success: boolean; message: string };
}

const USERS_KEY = 'codelearn_users_list_v2';
const CURRENT_USER_KEY = 'codelearn_current_user_v2';

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  users: DEFAULT_USERS,
  initialized: false,

  initialize: () => {
    if (typeof window === 'undefined') return;
    try {
      const storedUsers = localStorage.getItem(USERS_KEY);
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      
      let users = DEFAULT_USERS;
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      } else {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      }

      let currentUser: AuthUser | null = null;
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      } else {
        // Default login as creator so user can see it right away or can switch
        currentUser = users[0];
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      }

      set({ users, currentUser, initialized: true });
    } catch {
      set({ users: DEFAULT_USERS, currentUser: DEFAULT_USERS[0], initialized: true });
    }
  },

  login: (email: string) => {
    const { users } = get();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // Auto-create as user if doesn't exist
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'user',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      const updatedUsers = [...users, newUser];
      if (typeof window !== 'undefined') {
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      }
      set({ users: updatedUsers, currentUser: newUser });
      return { success: true, message: 'Yangi hisob yaratildi va tizimga kirildi!' };
    }

    if (found.status === 'banned') {
      return { success: false, message: 'Bu hisob bloklangan! Administratorga murojaat qiling.' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    }
    set({ currentUser: found });
    return { success: true };
  },

  loginAs: (role: UserRole) => {
    const { users } = get();
    const userWithRole = users.find((u) => u.role === role);
    if (userWithRole) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithRole));
      }
      set({ currentUser: userWithRole });
    }
  },

  register: (name: string, email: string) => {
    const { users } = get();
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Ushbu email allaqachon ro\'yxatdan o\'tgan.' };
    }

    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'user', // new users always get 'user' role
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    const updatedUsers = [...users, newUser];
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    }
    set({ users: updatedUsers, currentUser: newUser });
    return { success: true, message: 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz!' };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    set({ currentUser: null });
  },

  updateUserRole: (targetUserId: string, newRole: UserRole) => {
    const { currentUser, users } = get();

    if (!currentUser) {
      return { success: false, message: 'Tizimga kirilmagan!' };
    }

    // Only creator can assign roles
    if (currentUser.role !== 'creator') {
      return {
        success: false,
        message: 'Faqat Bosh Admin (Creator) boshqa foydalanuvchilarning rolini o\'zgartirishi mumkin!',
      };
    }

    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) {
      return { success: false, message: 'Foydalanuvchi topilmadi!' };
    }

    // Creator cannot demote themselves if they are the only creator
    if (targetUser.id === currentUser.id && newRole !== 'creator') {
      const creatorsCount = users.filter((u) => u.role === 'creator').length;
      if (creatorsCount <= 1) {
        return {
          success: false,
          message: 'Tizimda kamida bitta Bosh Admin (Creator) qolishi shart!',
        };
      }
    }

    const updatedUsers = users.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u));
    
    // Update currentUser if it's the same
    let updatedCurrentUser = currentUser;
    if (currentUser.id === targetUserId) {
      updatedCurrentUser = { ...currentUser, role: newRole };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurrentUser));
    }

    set({ users: updatedUsers, currentUser: updatedCurrentUser });
    return { success: true, message: `Rol muvaffaqiyatli o'zgartirildi: ${newRole.toUpperCase()}` };
  },

  toggleUserStatus: (targetUserId: string) => {
    const { currentUser, users } = get();
    if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) {
      return { success: false, message: 'Ruxsat berilmagan!' };
    }

    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return { success: false, message: 'Foydalanuvchi topilmadi!' };

    if (targetUser.role === 'creator') {
      return { success: false, message: 'Bosh Admin (Creator) ni bloklab bo\'lmaydi!' };
    }

    if (currentUser.role === 'admin' && targetUser.role === 'admin') {
      return { success: false, message: 'Admin boshqa adminni bloklay olmaydi. Faqat Creator qila oladi.' };
    }

    const newStatus: 'active' | 'banned' = targetUser.status === 'active' ? 'banned' : 'active';
    const updatedUsers: AuthUser[] = users.map((u) => (u.id === targetUserId ? { ...u, status: newStatus } : u));

    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    }
    set({ users: updatedUsers });
    return { success: true, message: `Holat yangilandi: ${newStatus === 'active' ? 'Faol' : 'Bloklangan'}` };
  },

  deleteUser: (targetUserId: string) => {
    const { currentUser, users } = get();
    if (!currentUser || currentUser.role !== 'creator') {
      return { success: false, message: 'Foydalanuvchini faqat Bosh Admin (Creator) o\'chira oladi!' };
    }

    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return { success: false, message: 'Foydalanuvchi topilmadi!' };

    if (targetUser.id === currentUser.id) {
      return { success: false, message: 'O\'zingizni o\'chira olmaysiz!' };
    }

    const updatedUsers = users.filter((u) => u.id !== targetUserId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    }
    set({ users: updatedUsers });
    return { success: true, message: 'Foydalanuvchi o\'chirildi.' };
  },

  addUser: (userData) => {
    const { currentUser, users } = get();
    if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) {
      return { success: false, message: 'Ruxsat berilmagan!' };
    }

    if (userData.role === 'creator' && currentUser.role !== 'creator') {
      return { success: false, message: 'Faqat Creator yangi Creator qo\'sha oladi.' };
    }

    const newUser: AuthUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedUsers = [newUser, ...users];
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    }
    set({ users: updatedUsers });
    return { success: true, message: 'Yangi foydalanuvchi qo\'shildi!' };
  },
}));
