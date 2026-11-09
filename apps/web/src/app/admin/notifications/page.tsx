'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useI18n } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { AppNotification, NotificationCategory, useNotificationStore } from '@/store/notificationStore';

export default function AdminNotificationsPage() {
  const { currentUser } = useAuthStore();
  const { language, tr } = useI18n();
  const notifications = useNotificationStore(state => state.notifications);
  const loading = useNotificationStore(state => state.loading);
  const initialize = useNotificationStore(state => state.initialize);
  const createNotification = useNotificationStore(state => state.createNotification);
  const [category, setCategory] = useState<NotificationCategory>('news');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    void initialize(currentUser?.id || null);
  }, [currentUser?.id, initialize]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    const cleanUrl = url.trim();

    if (!cleanTitle || !cleanBody) {
      setNotice({ text: tr('Sarlavha va xabar matnini kiriting.', 'Введите заголовок и текст сообщения.', 'Enter a title and message.') , type: 'error' });
      return;
    }
    if (cleanUrl && (!cleanUrl.startsWith('/') || cleanUrl.startsWith('//'))) {
      setNotice({ text: tr('Havola sayt ichidagi / bilan boshlanuvchi manzil bölişi kerak.', 'Ссылка должна быть внутренним адресом сайта и начинаться с /.', 'The link must be an internal site path starting with /.') , type: 'error' });
      return;
    }
    if (!currentUser) {
      setNotice({ text: tr('Bildiriş yuböriş uçun tizimga kiring.', 'Войдите, чтобы отправить уведомление.', 'Sign in to send a notification.') , type: 'error' });
      return;
    }

    setSending(true);
    setNotice(null);
    try {
      await createNotification({
        category,
        title: cleanTitle,
        body: cleanBody,
        url: cleanUrl || null,
      }, currentUser.id);
      setTitle('');
      setBody('');
      setUrl('');
      setNotice({ text: tr('Bildiriş barça foydalanuvçilarga yuborildi.', 'Уведомление отправлено всем пользователям.', 'Notification sent to all users.') , type: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : tr('Bildiriş yubörilmadi.', 'Не удалось отправить уведомление.', 'Could not send notification.');
      console.error('Admin bildirishnomasi yuborilmadi.', error);
      setNotice({ text: message, type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const categoryLabel = (item: AppNotification['category']) => {
    if (item === 'lesson') return tr('Yangi dars', 'Новый урок', 'New lesson');
    if (item === 'news') return tr('Yangilik', 'Новость', 'News');
    return tr('Xabar', 'Сообщение', 'Message');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="border-b border-white/10 pb-5">
        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
          {tr('FOYDALANUVÇILAR BILAN ALOQA', 'СВЯЗЬ С ПОЛЬЗОВАТЕЛЯМИ', 'COMMUNICATE WITH USERS')}
        </p>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {tr('Bildirishnomalar', 'Уведомления', 'Notifications')}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {tr('Yangilik yoki xabar yuboring. Xabarlar tizimga kirgan foydalanuvchilarga darhol körinadi.', 'Отправляйте новости и сообщения. Они сразу появятся у вошедших пользователей.', 'Send news and messages that appear immediately for signed-in users.')}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-xs font-semibold text-slate-300">
            {tr('Bildiriş turi', 'Тип уведомления', 'Notification type')}
            <select
              value={category}
              onChange={event => setCategory(event.target.value as 'news' | 'message')}
              className="w-full rounded-xl border border-white/10 bg-[#0a0f24] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            >
              <option value="news">{tr('Yangilik', 'Новость', 'News')}</option>
              <option value="message">{tr('Umumiy xabar', 'Общее сообщение', 'General message')}</option>
            </select>
          </label>
          <label className="space-y-2 text-xs font-semibold text-slate-300">
            {tr('Sarlavha', 'Заголовок', 'Title')}
            <input
              value={title}
              onChange={event => setTitle(event.target.value)}
              maxLength={160}
              required
              className="w-full rounded-xl border border-white/10 bg-[#0a0f24] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
              placeholder={tr('Masalan: Yangi kurs qöşildi', 'Например: Добавлен новый курс', 'For example: A new course is available')}
            />
          </label>
        </div>

        <label className="block space-y-2 text-xs font-semibold text-slate-300">
          {tr('Xabar matni', 'Текст сообщения', 'Message')}
          <textarea
            value={body}
            onChange={event => setBody(event.target.value)}
            maxLength={2000}
            rows={4}
            required
            className="w-full resize-y rounded-xl border border-white/10 bg-[#0a0f24] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            placeholder={tr('Xabar mazmunini yozing...', 'Введите текст сообщения...', 'Write your message...')}
          />
        </label>

        <label className="block space-y-2 text-xs font-semibold text-slate-300">
          {tr('Ixtiyoriy ichki havola', 'Внутренняя ссылка (необязательно)', 'Optional internal link')}
          <input
            value={url}
            onChange={event => setUrl(event.target.value)}
            maxLength={500}
            className="w-full rounded-xl border border-white/10 bg-[#0a0f24] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            placeholder="/courses"
          />
          <span className="block font-normal text-slate-500">
            {tr('Tashqi havolalar qöllab-quvvatlanmaydi.', 'Внешние ссылки не поддерживаются.', 'External links are not supported.')}
          </span>
        </label>

        {notice && (
          <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'}`}>
            {notice.text}
          </p>
        )}

        <button
          type="submit"
          disabled={sending || !currentUser}
          className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-bold text-white shadow-lg shadow-neon-blue/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? tr('Yubörilmoqda...', 'Отправка...', 'Sending...') : tr('Bildirish yuböriş', 'Отправить уведомление', 'Send notification')}
        </button>
      </form>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-white">{tr('Oxirgi bildirishnomalar', 'Последние уведомления', 'Recent notifications')}</h2>
          <p className="mt-1 text-xs text-slate-500">{tr('Bu xabarlar barcha tizimga kirgan foydalanuvçilarga körinadi.', 'Эти сообщения видны всем вошедшим пользователям.', 'These messages are visible to all signed-in users.')}</p>
        </div>
        {loading && notifications.length === 0 ? (
          <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400">{tr('Yuklanmoqda...', 'Загрузка...', 'Loading...')}</p>
        ) : notifications.length === 0 ? (
          <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400">{tr('Hali bildirishnomalar yöq.', 'Уведомлений пока нет.', 'No notifications yet.')}</p>
        ) : notifications.slice(0, 20).map(notification => (
          <article key={notification.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-200">{categoryLabel(notification.category)}</span>
              <time className="text-[10px] text-slate-500">
                {new Intl.DateTimeFormat(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.createdAt))}
              </time>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-white">{notification.title}</h3>
            <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-slate-400">{notification.body}</p>
            {notification.url && <p className="mt-2 break-all text-[10px] text-cyan-300">{notification.url}</p>}
          </article>
        ))}
      </section>
    </div>
  );
}
