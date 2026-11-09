'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/components/providers';
import { toModernUzbek } from '@/lib/utils';
import { ForumCategory, ForumPost, useForumStore } from '@/store/forumStore';

const categories: ForumCategory[] = ['general', 'html', 'css', 'javascript', 'python', 'career'];

function categoryName(category: ForumCategory, tr: (uz: string, ru: string, en: string) => string) {
  const names: Record<ForumCategory, [string, string, string]> = {
    general: ['Umumiy', 'Общее', 'General'],
    html: ['HTML', 'HTML', 'HTML'],
    css: ['CSS', 'CSS', 'CSS'],
    javascript: ['JavaScript', 'JavaScript', 'JavaScript'],
    python: ['Python', 'Python', 'Python'],
    career: ['Kasb va tajriba', 'Карьера и опыт', 'Career & experience'],
  };
  return tr(...names[category]);
}

function localizedDate(date: string, language: string) {
  const locale = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';
  const formatted = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
  return language === 'uz' ? toModernUzbek(formatted) : formatted;
}

function Author({ name, avatar, date }: { name: string; avatar: string | null; date: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : name.trim().charAt(0).toUpperCase()}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-slate-200">{name}</span>
        <time className="block text-[10px] text-slate-500">{date}</time>
      </span>
    </div>
  );
}

export default function ForumPage() {
  const { tr, language } = useI18n();
  const user = useAuthStore(state => state.currentUser);
  const posts = useForumStore(state => state.posts);
  const replies = useForumStore(state => state.replies);
  const activePostId = useForumStore(state => state.activePostId);
  const loadingPosts = useForumStore(state => state.loadingPosts);
  const loadingReplies = useForumStore(state => state.loadingReplies);
  const saving = useForumStore(state => state.saving);
  const error = useForumStore(state => state.error);
  const initialize = useForumStore(state => state.initialize);
  const selectPost = useForumStore(state => state.selectPost);
  const createPost = useForumStore(state => state.createPost);
  const createReply = useForumStore(state => state.createReply);
  const setSolved = useForumStore(state => state.setSolved);
  const deletePost = useForumStore(state => state.deletePost);
  const deleteReply = useForumStore(state => state.deleteReply);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [postCategory, setPostCategory] = useState<ForumCategory>('general');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const activePost = posts.find(post => post.id === activePostId) || null;
  const postReplies = useMemo(
    () => replies.filter(reply => reply.postId === activePostId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [activePostId, replies],
  );
  const filteredPosts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return posts.filter(post => (
      (selectedCategory === 'all' || post.category === selectedCategory)
      && (!query || `${post.title} ${post.body} ${post.authorName}`.toLocaleLowerCase().includes(query))
    ));
  }, [posts, search, selectedCategory]);

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const title = postTitle.trim();
    const body = postBody.trim();
    if (title.length < 5 || body.length < 10) {
      setActionError(tr('Sarlavha kamida 5, matn kamida 10 belgidan iborat bo‘lsin.', 'Заголовок должен содержать не менее 5 символов, текст — не менее 10.', 'Use at least 5 characters for the title and 10 for the post.'));
      return;
    }
    try {
      await createPost({ category: postCategory, title, body }, user.id);
      setPostTitle('');
      setPostBody('');
      setComposeOpen(false);
      setActionError(null);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : tr('Mavzuni yuborib bo‘lmadi.', 'Не удалось создать тему.', 'Could not create the topic.'));
    }
  };

  const handleCreateReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !activePost) return;
    const body = replyBody.trim();
    if (body.length < 2) {
      setActionError(tr('Javob kamida 2 ta belgidan iborat bo‘lsin.', 'Ответ должен содержать не менее 2 символов.', 'Replies must be at least 2 characters.'));
      return;
    }
    try {
      await createReply(activePost.id, body, user.id);
      setReplyBody('');
      setActionError(null);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : tr('Javob yuborilmadi.', 'Не удалось отправить ответ.', 'Could not send the reply.'));
    }
  };

  const handleDeletePost = async (post: ForumPost) => {
    if (!confirm(tr('Bu mavzuni va barcha javoblarni o‘chirmoqchimisiz?', 'Удалить эту тему и все ответы?', 'Delete this topic and all its replies?'))) return;
    try {
      await deletePost(post.id);
      setActionError(null);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : tr('Mavzuni o‘chirib bo‘lmadi.', 'Не удалось удалить тему.', 'Could not delete the topic.'));
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm(tr('Ushbu javobni o‘chirmoqchimisiz?', 'Удалить этот ответ?', 'Delete this reply?'))) return;
    try {
      await deleteReply(replyId);
      setActionError(null);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : tr('Javobni o‘chirib bo‘lmadi.', 'Не удалось удалить ответ.', 'Could not delete the reply.'));
    }
  };

  const toggleSolved = async (post: ForumPost) => {
    try {
      await setSolved(post.id, !post.isSolved);
      setActionError(null);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : tr('Mavzu holatini o‘zgartirib bo‘lmadi.', 'Не удалось изменить статус темы.', 'Could not update the topic status.'));
    }
  };

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-[#112142] via-[#11152c] to-[#17102a] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {tr('CodeLearn hamjamiyati', 'Сообщество CodeLearn', 'CodeLearn community')}
            </span>
            <h1 className="mt-4 font-[Space_Grotesk] text-3xl font-bold text-white sm:text-4xl">
              {tr('Birga o‘rganamiz, birga o‘samiz.', 'Учимся и растём вместе.', 'Learn together. Grow together.')}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {tr('Savol bering, bilim va tajribangizni ulashing, boshqa dasturchilarga yordam bering.', 'Задавайте вопросы, делитесь знаниями и опытом, помогайте другим разработчикам.', 'Ask questions, share what you know, and help other developers.')}
            </p>
          </div>
          {user ? (
            <button type="button" onClick={() => { setComposeOpen(value => !value); setActionError(null); }} className="shrink-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl">
              {composeOpen ? tr('Yopish', 'Закрыть', 'Close') : `+ ${tr('Mavzu yaratish', 'Создать тему', 'Start a discussion')}`}
            </button>
          ) : (
            <Link href="/auth/login" className="shrink-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5">
              {tr('Savol berish uchun kiring', 'Войдите, чтобы задать вопрос', 'Sign in to participate')}
            </Link>
          )}
        </div>
      </header>

      {composeOpen && user && (
        <form onSubmit={event => void handleCreatePost(event)} className="mb-6 space-y-4 rounded-2xl border border-cyan-400/20 bg-white/[0.035] p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[200px_minmax(0,1fr)]">
            <label className="space-y-2 text-xs font-semibold text-slate-300">
              {tr('Bo‘lim', 'Раздел', 'Category')}
              <select value={postCategory} onChange={event => setPostCategory(event.target.value as ForumCategory)} className="w-full rounded-xl border border-white/10 bg-[#0a0f24] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/50">
                {categories.map(category => <option key={category} value={category}>{categoryName(category, tr)}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-xs font-semibold text-slate-300">
              {tr('Mavzu sarlavhasi', 'Заголовок темы', 'Topic title')}
              <input value={postTitle} onChange={event => setPostTitle(event.target.value)} minLength={5} maxLength={160} required placeholder={tr('Masalan: JavaScript’da array qanday ishlaydi?', 'Например: Как работают массивы в JavaScript?', 'For example: How do arrays work in JavaScript?')} className="w-full rounded-xl border border-white/10 bg-[#0a0f24] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50" />
            </label>
          </div>
          <label className="block space-y-2 text-xs font-semibold text-slate-300">
            {tr('Savol yoki tajribangiz', 'Вопрос или ваш опыт', 'Question or experience')}
            <textarea value={postBody} onChange={event => setPostBody(event.target.value)} minLength={10} maxLength={10000} required rows={5} placeholder={tr('Batafsil yozing: nima sinab ko‘rdingiz, qayerida qiyinchilik bo‘ldi?', 'Опишите подробнее: что вы пробовали и где возникла сложность?', 'Add details: what have you tried, and where did you get stuck?')} className="w-full resize-y rounded-xl border border-white/10 bg-[#0a0f24] px-3 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50" />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">{tr('Sarlavha 5–160, matn 10–10 000 belgi.', 'Заголовок: 5–160, текст: 10–10 000 символов.', 'Title: 5–160, post: 10–10,000 characters.')}</p>
            <button type="submit" disabled={saving} className="rounded-xl bg-cyan-400/15 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/25 disabled:opacity-50">
              {saving ? tr('Yuborilmoqda...', 'Отправка...', 'Posting...') : tr('Mavzuni joylash', 'Опубликовать', 'Publish topic')}
            </button>
          </div>
        </form>
      )}

      {actionError && (
        <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          <span>{actionError}</span>
          <button type="button" aria-label={tr('Yopish', 'Закрыть', 'Dismiss')} onClick={() => setActionError(null)} className="shrink-0 text-rose-200">×</button>
        </div>
      )}
      {error && (
        <div role="alert" className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          <span>{error === 'FORUM_MIGRATION_REQUIRED'
            ? tr(
              'Forumni yoqish uchun Supabase SQL Editor’da supabase/migrations/20261109000200_community_forum.sql migratsiyasini ishga tushiring.',
              'Чтобы включить форум, выполните миграцию supabase/migrations/20261109000200_community_forum.sql в Supabase SQL Editor.',
              'To enable the forum, run supabase/migrations/20261109000200_community_forum.sql in the Supabase SQL Editor.',
            )
            : error}
          </span>
          <button type="button" onClick={() => void initialize()} className="shrink-0 underline">{tr('Qayta urinish', 'Повторить', 'Retry')}</button>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className={activePost ? 'hidden lg:block' : ''}>
          <div className="mb-4 space-y-3">
            <label className="relative block">
              <span className="sr-only">{tr('Forumdan qidirish', 'Поиск по форуму', 'Search the forum')}</span>
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m16 16 4 4" />
              </svg>
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder={tr('Savol yoki mavzuni qidiring...', 'Найдите вопрос или тему...', 'Search questions and discussions...')} className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40" />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button type="button" onClick={() => setSelectedCategory('all')} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${selectedCategory === 'all' ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                {tr('Barchasi', 'Все', 'All')}
              </button>
              {categories.map(category => (
                <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${selectedCategory === category ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                  {categoryName(category, tr)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            {error ? (
              <p className="px-5 py-12 text-center text-sm text-slate-400">{tr('Forumga ulanish sozlamasini tekshiring.', 'Проверьте подключение форума.', 'Check the forum setup above.')}</p>
            ) : loadingPosts && posts.length === 0 ? (
              <p className="px-5 py-12 text-center text-sm text-slate-400">{tr('Mavzular yuklanmoqda...', 'Загрузка тем...', 'Loading discussions...')}</p>
            ) : filteredPosts.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <span className="text-3xl" aria-hidden="true">💬</span>
                <p className="mt-3 text-sm font-medium text-slate-300">{tr('Hozircha mavzular yo‘q.', 'Пока нет тем.', 'No discussions yet.')}</p>
                <p className="mt-1 text-xs text-slate-500">{tr('Birinchi savol yoki tajribani siz ulashing.', 'Поделитесь первым вопросом или опытом.', 'Be the first to share a question or experience.')}</p>
              </div>
            ) : filteredPosts.map(post => {
              return (
                <button key={post.id} type="button" onClick={() => { setActionError(null); void selectPost(post.id); }} className={`block w-full border-b border-white/[0.06] p-4 text-left transition last:border-b-0 hover:bg-white/[0.035] sm:p-5 ${activePostId === post.id ? 'bg-cyan-400/[0.06]' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="line-clamp-2 text-sm font-semibold leading-relaxed text-white">{post.title}</span>
                    {post.isSolved && <span className="shrink-0 rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-300">{tr('Hal qilindi', 'Решено', 'Solved')}</span>}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{post.body}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="max-w-36 truncate rounded-full border border-white/10 px-2 py-1 text-[9px] text-slate-400">{categoryName(post.category, tr)}</span>
                      <span className="text-[10px] text-slate-500">◌ {post.replyCount} {tr('javob', 'ответов', 'replies')}</span>
                    </div>
                    <Author name={post.authorName} avatar={post.authorAvatar} date={localizedDate(post.updatedAt, language)} />
                  </div>
                </button>
              );
            })}
          </div>
          {posts.length >= 100 && <p className="mt-3 text-center text-[10px] text-slate-500">{tr('Oxirgi 100 ta mavzu ko‘rsatilyapti.', 'Показаны последние 100 тем.', 'Showing the latest 100 topics.')}</p>}
        </section>

        <section className={activePost ? '' : 'hidden lg:block'}>
          {!activePost ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] text-2xl" aria-hidden="true">✦</span>
              <h2 className="mt-4 text-sm font-semibold text-white">{tr('Suhbatni tanlang', 'Выберите обсуждение', 'Choose a discussion')}</h2>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">{tr('Mavzuni ochib javoblarni o‘qing yoki o‘z fikringizni qo‘shing.', 'Откройте тему, чтобы прочитать ответы и поделиться своим мнением.', 'Open a topic to read replies and add your thoughts.')}</p>
            </div>
          ) : (
            <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="border-b border-white/[0.07] p-5 sm:p-6">
                <button type="button" onClick={() => { setActionError(null); void selectPost(null); }} className="mb-4 text-xs font-medium text-cyan-300 hover:text-cyan-200 lg:hidden">
                  ← {tr('Mavzular ro‘yxatiga', 'К списку тем', 'Back to discussions')}
                </button>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-2.5 py-1 text-[10px] font-semibold text-cyan-200">{categoryName(activePost.category, tr)}</span>
                  {activePost.isSolved && <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">✓ {tr('Hal qilindi', 'Решено', 'Solved')}</span>}
                </div>
                <h2 className="mt-4 text-xl font-bold leading-snug text-white">{activePost.title}</h2>
                <div className="mt-4"><Author name={activePost.authorName} avatar={activePost.authorAvatar} date={localizedDate(activePost.createdAt, language)} /></div>
                <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">{activePost.body}</p>
                {user && (user.id === activePost.authorId || user.role === 'admin' || user.role === 'creator') && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.07] pt-4">
                    {user.id === activePost.authorId && (
                      <button type="button" onClick={() => void toggleSolved(activePost)} className="rounded-lg border border-emerald-400/20 px-3 py-2 text-[10px] font-semibold text-emerald-300 transition hover:bg-emerald-400/10">
                        {activePost.isSolved ? tr('Qayta ochish', 'Переоткрыть', 'Reopen question') : tr('Hal qilindi deb belgilash', 'Отметить решённым', 'Mark as solved')}
                      </button>
                    )}
                    <button type="button" onClick={() => void handleDeletePost(activePost)} className="rounded-lg border border-rose-400/20 px-3 py-2 text-[10px] font-semibold text-rose-300 transition hover:bg-rose-400/10">
                      {tr('Mavzuni o‘chirish', 'Удалить тему', 'Delete topic')}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-sm font-bold text-white">
                  {tr('Javoblar', 'Ответы', 'Replies')} <span className="ml-1 text-slate-500">{postReplies.length}</span>
                </h3>
                {loadingReplies ? (
                  <p className="py-6 text-xs text-slate-400">{tr('Javoblar yuklanmoqda...', 'Загрузка ответов...', 'Loading replies...')}</p>
                ) : postReplies.length === 0 ? (
                  <p className="py-6 text-xs text-slate-500">{tr('Hali javob yo‘q. Birinchi bo‘lib yordam bering.', 'Ответов пока нет. Помогите первым.', 'No replies yet. Be the first to help.')}</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {postReplies.map(reply => (
                      <div key={reply.id} className="rounded-xl border border-white/[0.07] bg-black/10 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <Author name={reply.authorName} avatar={reply.authorAvatar} date={localizedDate(reply.createdAt, language)} />
                          {user && (user.id === reply.authorId || user.role === 'admin' || user.role === 'creator') && (
                            <button type="button" onClick={() => void handleDeleteReply(reply.id)} aria-label={tr('Javobni o‘chirish', 'Удалить ответ', 'Delete reply')} className="rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300">×</button>
                          )}
                        </div>
                        <p className="mt-3 whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {user ? (
                  <form onSubmit={event => void handleCreateReply(event)} className="mt-5 border-t border-white/[0.07] pt-5">
                    <label className="mb-2 block text-xs font-semibold text-slate-300" htmlFor="forum-reply">{tr('Javobingiz', 'Ваш ответ', 'Your reply')}</label>
                    <textarea id="forum-reply" value={replyBody} onChange={event => setReplyBody(event.target.value)} maxLength={5000} minLength={2} required rows={3} placeholder={tr('Fikringizni hurmat bilan yozing...', 'Напишите ответ с уважением...', 'Share your thoughts respectfully...')} className="w-full resize-y rounded-xl border border-white/10 bg-[#0a0f24] px-3 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40" />
                    <div className="mt-3 flex justify-end">
                      <button type="submit" disabled={saving} className="rounded-xl bg-cyan-400/15 px-4 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/25 disabled:opacity-50">
                        {saving ? tr('Yuborilmoqda...', 'Отправка...', 'Sending...') : tr('Javob yuborish', 'Отправить ответ', 'Post reply')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-center">
                    <p className="text-xs text-slate-400">{tr('Suhbatga qo‘shilish uchun tizimga kiring.', 'Войдите, чтобы участвовать в обсуждении.', 'Sign in to join the discussion.')}</p>
                    <Link href="/auth/login" className="mt-3 inline-flex rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15">{tr('Kirish', 'Войти', 'Sign in')}</Link>
                  </div>
                )}
              </div>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
