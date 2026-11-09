'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { AppNotification, useNotificationStore } from '@/store/notificationStore';

function categoryLabel(category: AppNotification['category'], tr: (uz: string, ru: string, en: string) => string) {
  if (category === 'lesson') return tr('Yangi dars', 'Новый урок', 'New lesson');
  if (category === 'news') return tr('Yangilik', 'Новость', 'News');
  return tr('Xabar', 'Сообщение', 'Message');
}

export function NotificationCenter() {
  const { tr, language } = useI18n();
  const currentUser = useAuthStore(state => state.currentUser);
  const notifications = useNotificationStore(state => state.notifications);
  const readIds = useNotificationStore(state => state.readIds);
  const loading = useNotificationStore(state => state.loading);
  const error = useNotificationStore(state => state.error);
  const hasMore = useNotificationStore(state => state.hasMore);
  const loadingMore = useNotificationStore(state => state.loadingMore);
  const initialize = useNotificationStore(state => state.initialize);
  const loadMore = useNotificationStore(state => state.loadMore);
  const clearInbox = useNotificationStore(state => state.clearInbox);
  const markRead = useNotificationStore(state => state.markRead);
  const markAllRead = useNotificationStore(state => state.markAllRead);
  const [open, setOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(notification => !readIds.includes(notification.id)).length;

  useEffect(() => {
    void initialize(currentUser?.id || null);
  }, [currentUser?.id, initialize]);

  useEffect(() => {
    if (!open) return;
    const handleDismiss = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === 'Escape') setOpen(false);
        return;
      }
      if (event.target instanceof Node && containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleDismiss);
    document.addEventListener('keydown', handleDismiss);
    return () => {
      document.removeEventListener('pointerdown', handleDismiss);
      document.removeEventListener('keydown', handleDismiss);
    };
  }, [open]);

  if (!currentUser) return null;

  const markOneRead = async (notificationId: string) => {
    try {
      await markRead(notificationId, currentUser.id);
      setActionError(null);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : tr('Bildirişni saqlaşda xatolik.', 'Не удалось сохранить уведомление.', 'Could not save notification.');
      console.error('Bildirishnoma o‘qilgan deb belgilanmadi.', caught);
      setActionError(message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead(currentUser.id);
      setActionError(null);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : tr('Bildirişlarni saqlaşda xatolik.', 'Не удалось сохранить уведомления.', 'Could not save notifications.');
      console.error('Bildirishnomalar o‘qilgan deb belgilanmadi.', caught);
      setActionError(message);
    }
  };

  const handleLoadMore = async () => {
    try {
      await loadMore(currentUser.id);
      setActionError(null);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : tr('Eski bildirişlarni yuklab bo‘lmadi.', 'Не удалось загрузить старые уведомления.', 'Could not load older notifications.');
      console.error('Eski bildirishnomalarni yuklab bo‘lmadi.', caught);
      setActionError(message);
    }
  };

  const handleClearInbox = async () => {
    try {
      await clearInbox(currentUser.id);
      setActionError(null);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : tr('Bildirişlarni tozalab bo‘lmadi.', 'Не удалось очистить уведомления.', 'Could not clear notifications.');
      console.error('Bildirishnomalar qutisini tozalab bo‘lmadi.', caught);
      setActionError(message);
    }
  };

  const notificationContent = (notification: AppNotification) => (
    <>
      <span className="mb-1 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
        {categoryLabel(notification.category, tr)}
      </span>
      <span className="block text-sm font-semibold text-white">{notification.title}</span>
      <span className="mt-1 block whitespace-pre-wrap text-xs leading-relaxed text-slate-400">{notification.body}</span>
      <span className="mt-2 block text-[10px] text-slate-500">
        {new Intl.DateTimeFormat(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(notification.createdAt))}
      </span>
    </>
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={tr('Bildirishnomalar', 'Уведомления', 'Notifications')}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => { setOpen(value => !value); setActionError(null); }}
        className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/[0.08] hover:text-white hover:shadow-[0_6px_18px_rgba(34,211,238,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <svg className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 px-1 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div id={panelId} className="notification-panel-enter fixed inset-x-2 top-[76px] z-[60] mx-auto flex max-h-[calc(100dvh-6rem)] w-auto max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#090e1f] shadow-[0_24px_60px_rgba(0,0,0,0.75),0_0_24px_rgba(34,211,238,0.08)] sm:inset-x-4 lg:absolute lg:inset-x-auto lg:right-0 lg:top-full lg:mt-2 lg:max-h-[min(65vh,36rem)] lg:w-[min(90vw,24rem)] lg:bg-[#090e1f]/[0.98]">
            <div className="flex shrink-0 flex-col gap-2 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">{tr('Bildirishnomalar', 'Уведомления', 'Notifications')}</h2>
              <p className="text-[11px] text-slate-400">
                {tr(`${unreadCount} ta o‘qilmagan`, `${unreadCount} непрочитанных`, `${unreadCount} unread`)}
              </p>
            </div>
            {unreadCount > 0 && (
                <button type="button" onClick={() => void handleMarkAllRead()} className="w-full rounded-lg border border-cyan-400/15 bg-cyan-400/[0.05] px-2.5 py-2 text-left text-[11px] font-medium leading-4 text-cyan-300 transition-colors hover:bg-cyan-400/10 hover:text-cyan-100 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-right">
                  {tr('Barchasini o‘qildi qilish', 'Отметить все как прочитанные', 'Mark all as read')}
              </button>
            )}
          </div>

          {(actionError || error) && (
              <div role="alert" className="flex shrink-0 items-center justify-between gap-3 border-b border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs text-rose-200">
              <span>{actionError || error}</span>
              {error && <button type="button" onClick={() => void initialize(currentUser.id)} className="shrink-0 underline">{tr('Qayta urinish', 'Повторить', 'Retry')}</button>}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain lg:max-h-[min(65vh,28rem)] lg:flex-none">
            {loading && notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-slate-400">{tr('Yuklanmoqda...', 'Загрузка...', 'Loading...')}</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-slate-400">{tr('Hozirça bildirişlar yöq.', 'Пока нет уведомлений.', 'No notifications yet.')}</p>
            ) : notifications.map((notification, index) => {
              const isRead = readIds.includes(notification.id);
              const className = `notification-item-enter block w-full border-b border-white/5 px-4 py-3 text-left transition-all duration-200 hover:translate-x-0.5 hover:bg-white/[0.06] motion-reduce:transform-none motion-reduce:transition-none ${isRead ? 'opacity-70' : 'bg-cyan-400/[0.04]'}`;
              const onClick = () => {
                if (!isRead) void markOneRead(notification.id);
                setOpen(false);
              };

              return notification.url ? (
                <Link key={notification.id} href={notification.url} onClick={onClick} style={{ animationDelay: `${Math.min(index, 6) * 35}ms` }} className={className}>
                  {notificationContent(notification)}
                </Link>
              ) : (
                <button key={notification.id} type="button" onClick={onClick} style={{ animationDelay: `${Math.min(index, 6) * 35}ms` }} className={className}>
                  {notificationContent(notification)}
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#090e1f] px-3 py-2.5 sm:px-4">
            {hasMore ? (
              <button
                type="button"
                onClick={() => void handleLoadMore()}
                disabled={loadingMore}
                className="text-[11px] font-medium text-cyan-300 transition-colors hover:text-cyan-100 disabled:cursor-wait disabled:opacity-60"
              >
                {loadingMore
                  ? tr('Yuklanmoqda...', 'Загрузка...', 'Loading...')
                  : tr('Eski bildirişlarni körish', 'Показать старые уведомления', 'Load older notifications')}
              </button>
            ) : <span className="text-[10px] text-slate-500">{notifications.length ? tr('Barchasi körsatildi', 'Все уведомления показаны', 'All notifications shown') : ''}</span>}
            <button
              type="button"
              onClick={() => void handleClearInbox()}
              disabled={notifications.length === 0 || loading}
              className="ml-auto rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-rose-300 transition-colors hover:bg-rose-400/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {tr('Tozalash', 'Очистить', 'Clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
