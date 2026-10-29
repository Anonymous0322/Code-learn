'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { ProjectProgress, useProjectProgressStore } from '@/store/projectProgressStore';
import { usePortfolioSharingStore } from '@/store/portfolioSharingStore';

const projectInfo: Record<string, { title: string; steps: number }> = {
  'personal-portfolio': { title: 'Shaxsiy portfolio sahifasi', steps: 4 },
  'product-landing': { title: 'Mahsulot landing sahifasi', steps: 4 },
  'click-counter': { title: 'Interaktiv hisoblagich', steps: 4 },
};

function previewDocument(code: string) {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'">`;
  return `<!doctype html><html><head><meta charset="utf-8">${policy}</head><body>${code}</body></html>`;
}

export default function PortfolioPage() {
  const { tr } = useI18n();
  const user = useAuthStore(state => state.currentUser);
  const initialize = useProjectProgressStore(state => state.initialize);
  const loadAll = useProjectProgressStore(state => state.loadAll);
  const initializeSharing = usePortfolioSharingStore(state => state.initialize);
  const loadSettings = usePortfolioSharingStore(state => state.loadSettings);
  const publish = usePortfolioSharingStore(state => state.publish);
  const unpublish = usePortfolioSharingStore(state => state.unpublish);
  const shareId = usePortfolioSharingStore(state => state.shareId);
  const [works, setWorks] = useState<Record<string, ProjectProgress>>({});
  const [displayName, setDisplayName] = useState('CodeLearn o‘quvchisi');
  const [sharingBusy, setSharingBusy] = useState(false);
  const [sharingMessage, setSharingMessage] = useState('');
  const [sharingError, setSharingError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { initialize(user?.id || null); }, [initialize, user?.id]);
  useEffect(() => {
    initializeSharing(user?.id || null);
    if (!user) return;
    loadSettings(user.id).catch(() => setSharingError(tr('Ulashish sozlamasini yuklab bo‘lmadi.', 'Не удалось загрузить настройки публикации.', 'Could not load sharing settings.')));
  }, [initializeSharing, loadSettings, tr, user?.id]);
  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setWorks({});
      return () => { cancelled = true; };
    }
    setLoading(true);
    setError('');
    loadAll(user.id)
      .then(result => { if (!cancelled) setWorks(result); })
      .catch(() => { if (!cancelled) setError(tr('Portfolio loyihalarini yuklab bo‘lmadi. Internet va Supabase sozlamalarini tekshiring.', 'Не удалось загрузить проекты портфолио. Проверьте интернет и настройки Supabase.', 'Could not load portfolio projects. Check your internet connection and Supabase settings.')); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [loadAll, tr, user]);

  const entries = Object.entries(works);
  const publicUrl = shareId && typeof window !== 'undefined' ? `${window.location.origin}/portfolio/${shareId}` : '';
  const handlePublish = async () => {
    if (!user) return;
    const projects = entries.filter(([id]) => projectInfo[id]).map(([id, project]) => ({
      id,
      title: projectInfo[id].title,
      code: project.code,
    }));
    if (!projects.length) {
      setSharingError(tr('Avval kamida bitta loyihani saqlang, so‘ng portfolio ulashing.', 'Сначала сохраните хотя бы один проект, затем опубликуйте портфолио.', 'Save at least one project before sharing your portfolio.'));
      return;
    }
    setSharingBusy(true);
    setSharingError('');
    setSharingMessage('');
    try {
      await publish(user.id, displayName, projects);
      setSharingMessage(tr('Portfolioingiz ulashildi. Havolani nusxalab yuborishingiz mumkin.', 'Портфолио опубликовано. Скопируйте ссылку, чтобы поделиться.', 'Your portfolio is shared. Copy the link to send it.'));
    } catch (publishError) {
      setSharingError(publishError instanceof Error ? publishError.message : tr('Portfolio ulashilmadi. Supabase RLS va ulanish sozlamalarini tekshiring.', 'Не удалось опубликовать портфолио. Проверьте подключение и настройки RLS в Supabase.', 'Could not share portfolio. Check Supabase RLS and connection settings.'));
    } finally {
      setSharingBusy(false);
    }
  };
  const handleUnpublish = async () => {
    if (!user || !shareId) return;
    setSharingBusy(true);
    setSharingError('');
    setSharingMessage('');
    try {
      await unpublish(user.id, shareId);
      setSharingMessage(tr('Portfolio endi ommaviy havolada ko‘rinmaydi.', 'Портфолио больше не доступно по публичной ссылке.', 'Your portfolio is no longer available through the public link.'));
    } catch (unpublishError) {
      setSharingError(unpublishError instanceof Error ? unpublishError.message : tr('Portfolio ko‘rinishini o‘zgartirib bo‘lmadi.', 'Не удалось изменить видимость портфолио.', 'Could not change portfolio visibility.'));
    } finally {
      setSharingBusy(false);
    }
  };
  const handleCopyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setSharingMessage(tr('Havola nusxalandi.', 'Ссылка скопирована.', 'Link copied.'));
    } catch {
      setSharingError(tr('Havolani avtomatik nusxalab bo‘lmadi. Brauzer manzil satridan nusxa oling.', 'Не удалось скопировать ссылку автоматически. Скопируйте её из адресной строки браузера.', 'Could not copy the link automatically. Copy it from your browser address bar.'));
    }
  };
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">{tr('Ishlar to‘plami', 'Мои работы', 'My work')}</p>
        <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">{tr('Mening portfolioim', 'Моё портфолио', 'My portfolio')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{tr('Loyiha sahifasida saqlagan kodlaringiz va bajarish jarayoningiz shu yerda jamlanadi. Portfolio ulashishni o‘zingiz yoqmaguningizcha faqat sizga ko‘rinadi.', 'Здесь собраны сохранённый код и прогресс ваших проектов. Портфолио видно только вам, пока вы не включите публикацию.', 'Your saved project code and progress appear here. Your portfolio is private until you choose to share it.')}</p>
      </div>
      <Link href="/projects" className="rounded-xl border border-neon-cyan/30 px-4 py-2.5 text-sm font-semibold text-neon-cyan">{tr('Loyiha yaratish', 'Создать проект', 'Create a project')}</Link>
    </header>

    {user && <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <h2 className="font-semibold text-white">{tr('Portfolio havolasini ulashish', 'Поделиться портфолио', 'Share portfolio')}</h2>
      <p className="mt-1 text-sm text-slate-400">{tr('Ulashish yoqilganda faqat quyida kiritgan ko‘rinadigan ism va saqlangan loyiha kodlari chiqadi. Email va hisob ma’lumotlari ulashilmaydi.', 'При публикации будут показаны только указанное имя и сохранённый код проектов. Email и данные аккаунта не публикуются.', 'When shared, only the display name below and saved project code are shown. Your email and account details are not shared.')}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1 text-xs text-slate-400">{tr('Portfolio’da ko‘rinadigan ism', 'Имя в портфолио', 'Display name')}
          <input value={displayName} onChange={event => setDisplayName(event.target.value)} maxLength={80} className="mt-1 w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2.5 text-sm text-white focus:border-neon-cyan focus:outline-none" />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <button type="button" onClick={() => void handlePublish()} disabled={sharingBusy || loading} className="rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{sharingBusy ? tr('Saqlanmoqda…', 'Сохранение…', 'Saving…') : shareId ? tr('Portfolio’ni yangilash', 'Обновить портфолио', 'Update portfolio') : tr('Ulashishni yoqish', 'Включить публикацию', 'Enable sharing')}</button>
          {shareId && <button type="button" onClick={() => void handleUnpublish()} disabled={sharingBusy} className="rounded-lg border border-rose-300/20 px-4 py-2.5 text-sm text-rose-200 disabled:opacity-50">{tr('Ulashishni o‘chirish', 'Отключить публикацию', 'Disable sharing')}</button>}
        </div>
      </div>
      {shareId && <div className="mt-3 flex flex-wrap items-center gap-2">
        <a href={publicUrl} target="_blank" rel="noreferrer" className="break-all text-sm text-neon-cyan underline">{publicUrl}</a>
        <button type="button" onClick={() => void handleCopyLink()} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200">{tr('Havolani nusxalash', 'Скопировать ссылку', 'Copy link')}</button>
      </div>}
      {sharingMessage && <p role="status" className="mt-3 text-sm text-emerald-300">{sharingMessage}</p>}
      {sharingError && <p role="alert" className="mt-3 text-sm text-amber-200">{sharingError}</p>}
    </section>}

    {!user ? <section className="mt-8 rounded-2xl border border-white/10 p-8 text-center">
      <p className="text-slate-300">{tr('Portfolioingizni ko‘rish uchun hisobingizga kiring.', 'Войдите, чтобы посмотреть портфолио.', 'Sign in to view your portfolio.')}</p>
      <Link href="/auth/login?next=/portfolio" className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 text-sm font-semibold text-white">{tr('Kirish', 'Войти', 'Sign in')}</Link>
    </section> : loading ? <p className="mt-8 text-sm text-slate-400">{tr('Portfolio yuklanmoqda...', 'Загрузка портфолио...', 'Loading portfolio...')}</p> : error ? <p role="alert" className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">{error}</p> : entries.length === 0 ? <section className="mt-8 rounded-2xl border border-dashed border-white/15 p-8 text-center">
      <h2 className="font-semibold text-white">{tr('Portfolio hali bo‘sh', 'Портфолио пока пусто', 'Your portfolio is empty')}</h2>
      <p className="mt-2 text-sm text-slate-400">{tr('Loyihalardan birini ochib, kod va bajarilgan bosqichlarni saqlang.', 'Откройте проект и сохраните код и выполненные шаги.', 'Open a project and save your code and completed steps.')}</p>
      <Link href="/projects" className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 text-sm font-semibold text-white">{tr('Loyihalarni boshlash', 'Начать проект', 'Start a project')}</Link>
    </section> : <section className="mt-8 grid gap-5 lg:grid-cols-2">
      {entries.map(([id, project]) => {
        const info = projectInfo[id] || { title: id, steps: 4 };
        const completed = project.completedSteps.filter(step => step >= 0 && step < info.steps).length;
        return <article key={id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
          <div className="flex items-start justify-between gap-3 p-5">
            <div><h2 className="font-semibold text-white">{info.title}</h2><p className="mt-1 text-xs text-slate-400">{tr('Saqlangan ish', 'Сохранённая работа', 'Saved work')} · {completed}/{info.steps} {tr('bosqich', 'шагов', 'steps')}</p></div>
            <Link href="/projects" className="shrink-0 text-xs text-neon-cyan hover:underline">{tr('Tahrirlash', 'Изменить', 'Edit')}</Link>
          </div>
          <iframe title={`${info.title} portfolio ko‘rinishi`} sandbox="allow-scripts" srcDoc={previewDocument(project.code)} className="h-72 w-full border-t border-white/10 bg-white" />
        </article>;
      })}
    </section>}
  </main>;
}
