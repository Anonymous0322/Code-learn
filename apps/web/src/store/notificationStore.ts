'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

export type NotificationCategory = 'lesson' | 'news' | 'message';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  url: string | null;
  createdAt: string;
}

const NOTIFICATION_PAGE_SIZE = 30;

interface NotificationRow {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  url: string | null;
  created_at: string;
}

interface NotificationState {
  notifications: AppNotification[];
  readIds: string[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadedCount: number;
  paginationUpperBound: string | null;
  clearedAt: string | null;
  initialize: (userId: string | null) => Promise<void>;
  loadMore: (userId: string) => Promise<void>;
  clearInbox: (userId: string) => Promise<void>;
  markRead: (notificationId: string, userId: string) => Promise<void>;
  markAllRead: (userId: string) => Promise<void>;
  createNotification: (
    notification: Pick<AppNotification, 'category' | 'title' | 'body' | 'url'>,
    userId: string,
  ) => Promise<void>;
}

let notificationChannel: ReturnType<ReturnType<typeof getSupabase>['channel']> | null = null;
let activeUserId: string | null = null;
let initializationId = 0;

function mapNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    body: row.body,
    url: row.url,
    createdAt: row.created_at,
  };
}

function addNotification(notification: AppNotification) {
  useNotificationStore.setState(state => ({
    notifications: [
      notification,
      ...state.notifications.filter(item => item.id !== notification.id),
    ],
  }));
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  readIds: [],
  loading: false,
  error: null,
  hasMore: false,
  loadingMore: false,
  loadedCount: 0,
  paginationUpperBound: null,
  clearedAt: null,

  initialize: async (userId) => {
    if (!userId) {
      initializationId += 1;
      if (notificationChannel) void getSupabase().removeChannel(notificationChannel);
      notificationChannel = null;
      activeUserId = null;
      set({ notifications: [], readIds: [], loading: false, loadingMore: false, hasMore: false, loadedCount: 0, paginationUpperBound: null, clearedAt: null, error: null });
      return;
    }

    if (activeUserId === userId && notificationChannel) return;
    if (notificationChannel) void getSupabase().removeChannel(notificationChannel);
    notificationChannel = null;
    activeUserId = userId;
    const requestId = ++initializationId;
    set({ notifications: [], readIds: [], loading: true, loadingMore: false, hasMore: false, loadedCount: 0, paginationUpperBound: null, clearedAt: null, error: null });

    try {
      const supabase = getSupabase();
      notificationChannel = supabase
        .channel(`notifications:${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        }, payload => {
          const notification = mapNotification(payload.new as NotificationRow);
          const clearedAt = get().clearedAt;
          if (!clearedAt || notification.createdAt > clearedAt) addNotification(notification);
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notification_reads',
          filter: `user_id=eq.${userId}`,
        }, payload => {
          const notificationId = String(payload.new.notification_id);
          set(state => state.readIds.includes(notificationId)
            ? state
            : { readIds: [...state.readIds, notificationId] });
        })
        .subscribe();

      const inboxResult = await supabase
        .from('notification_inbox_state')
        .select('cleared_at')
        .eq('user_id', userId)
        .maybeSingle();
      if (inboxResult.error) throw inboxResult.error;
      if (requestId !== initializationId || activeUserId !== userId) return;
      const clearedAt = inboxResult.data?.cleared_at ?? null;
      set({ clearedAt });

      let notificationQuery = supabase
          .from('notifications')
          .select('id,category,title,body,url,created_at')
          .order('created_at', { ascending: false });
      if (clearedAt) notificationQuery = notificationQuery.gt('created_at', clearedAt);
      const [notificationResult, readResult] = await Promise.all([
        notificationQuery.range(0, NOTIFICATION_PAGE_SIZE - 1),
        supabase
          .from('notification_reads')
          .select('notification_id')
          .eq('user_id', userId),
      ]);
      if (notificationResult.error) throw notificationResult.error;
      if (readResult.error) throw readResult.error;
      if (requestId !== initializationId || activeUserId !== userId) return;

      const loaded = (notificationResult.data || []).map(row => mapNotification(row as NotificationRow));
      const liveNotifications = get().notifications.filter(notification => !clearedAt || notification.createdAt > clearedAt);
      const byId = new Map(loaded.map(notification => [notification.id, notification]));
      liveNotifications.forEach(notification => byId.set(notification.id, notification));
      set({
        notifications: [...byId.values()]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        readIds: (readResult.data || []).map(row => row.notification_id as string),
        loading: false,
        loadedCount: (notificationResult.data || []).length,
        paginationUpperBound: loaded[0]?.createdAt ?? null,
        hasMore: (notificationResult.data || []).length === NOTIFICATION_PAGE_SIZE,
      });
    } catch (error) {
      if (requestId !== initializationId) return;
      const message = error instanceof Error ? error.message : 'Bildirishnomalarni yuklab bo‘lmadi.';
      console.error('Bildirishnomalarni yuklab bo‘lmadi.', error);
      if (notificationChannel) void getSupabase().removeChannel(notificationChannel);
      notificationChannel = null;
      activeUserId = null;
      set({ loading: false, loadingMore: false, error: message });
    }
  },

  loadMore: async (userId) => {
    const state = get();
    if (state.loadingMore || !state.hasMore || activeUserId !== userId) return;
    const offset = state.loadedCount;
    set({ loadingMore: true, error: null });

    try {
      const supabase = getSupabase();
      let query = supabase
        .from('notifications')
        .select('id,category,title,body,url,created_at')
        .order('created_at', { ascending: false });
      if (state.clearedAt) query = query.gt('created_at', state.clearedAt);
      if (state.paginationUpperBound) query = query.lte('created_at', state.paginationUpperBound);
      const { data, error } = await query.range(offset, offset + NOTIFICATION_PAGE_SIZE - 1);
      if (error) throw error;

      const loaded = (data || []).map(row => mapNotification(row as NotificationRow));
      set(current => ({
        notifications: [...new Map([...current.notifications, ...loaded].map(notification => [notification.id, notification])).values()]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        loadedCount: current.loadedCount + loaded.length,
        hasMore: loaded.length === NOTIFICATION_PAGE_SIZE,
        loadingMore: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eski bildirishnomalarni yuklab bo‘lmadi.';
      console.error('Eski bildirishnomalarni yuklab bo‘lmadi.', error);
      set({ loadingMore: false, error: message });
      throw error;
    }
  },

  clearInbox: async (userId) => {
    const clearedAt = new Date().toISOString();
    const { error } = await getSupabase()
      .from('notification_inbox_state')
      .upsert({ user_id: userId, cleared_at: clearedAt }, { onConflict: 'user_id' });
    if (error) throw error;
    set({ notifications: [], readIds: [], clearedAt, hasMore: false, loadedCount: 0, paginationUpperBound: null, loadingMore: false });
  },

  markRead: async (notificationId, userId) => {
    if (get().readIds.includes(notificationId)) return;
    const { error } = await getSupabase().from('notification_reads').insert({
      user_id: userId,
      notification_id: notificationId,
    });
    if (error && error.code !== '23505') throw error;
    set(state => state.readIds.includes(notificationId)
      ? state
      : { readIds: [...state.readIds, notificationId] });
  },

  markAllRead: async (userId) => {
    const unreadIds = get().notifications
      .filter(notification => !get().readIds.includes(notification.id))
      .map(notification => notification.id);
    if (unreadIds.length === 0) return;

    const { error } = await getSupabase().from('notification_reads').upsert(
      unreadIds.map(notificationId => ({ user_id: userId, notification_id: notificationId })),
      { onConflict: 'user_id,notification_id', ignoreDuplicates: true },
    );
    if (error) throw error;
    set(state => ({ readIds: [...new Set([...state.readIds, ...unreadIds])] }));
  },

  createNotification: async (notification, userId) => {
    const { data, error } = await getSupabase()
      .from('notifications')
      .insert({
        category: notification.category,
        title: notification.title.trim(),
        body: notification.body.trim(),
        url: notification.url?.trim() || null,
        created_by: userId,
      })
      .select('id,category,title,body,url,created_at')
      .single();
    if (error) throw error;
    addNotification(mapNotification(data as NotificationRow));
  },
}));
