'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
    loadSettings(user.id).catch(() => setSharingError('Ulashish sozlamasini yuklab bo‘lmadi.'));
  }, [initializeSharing, loadSettings, user?.id]);
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
      .catch(() => { if (!cancelled) setError('Portfolio loyihalarini yuklab bo‘lmadi. Internet va Supabase sozlamalarini tekshiring.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [loadAll, user]);

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
      setSharingError('Avval kamida bitta loyihani saqlang, so‘ng portfolio ulashing.');
      return;
    }
    setSharingBusy(true);
    setSharingError('');
    setSharingMessage('');
    try {
      await publish(user.id, displayName, projects);
      setSharingMessage('Portfolioingiz ulashildi. Havolani nusxalab yuborishingiz mumkin.');
    } catch (publishError) {
      setSharingError(publishError instanceof Error ? publishError.message : 'Portfolio ulashilmadi. Supabase RLS va ulanish sozlamalarini tekshiring.');
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
      setSharingMessage('Portfolio endi ommaviy havolada ko‘rinmaydi.');
    } catch (unpublishError) {
      setSharingError(unpublishError instanceof Error ? unpublishError.message : 'Portfolio ko‘rinishini o‘zgartirib bo‘lmadi.');
    } finally {
      setSharingBusy(false);
    }
  };
  const handleCopyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setSharingMessage('Havola nusxalandi.');
    } catch {
      setSharingError('Havolani avtomatik nusxalab bo‘lmadi. Brauzer manzil satridan nusxa oling.');
    }
  };
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">Ishlar to‘plami</p>
        <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">Mening portfolioim</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Loyiha sahifasida saqlagan kodlaringiz va bajarish jarayoningiz shu yerda jamlanadi. Portfolio ulashishni o‘zingiz yoqmaguningizcha faqat sizga ko‘rinadi.</p>
      </div>
      <Link href="/projects" className="rounded-xl border border-neon-cyan/30 px-4 py-2.5 text-sm font-semibold text-neon-cyan">Loyiha yaratish</Link>
    </header>

    {user && <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <h2 className="font-semibold text-white">Portfolio havolasini ulashish</h2>
      <p className="mt-1 text-sm text-slate-400">Ulashish yoqilganda faqat quyida kiritgan ko‘rinadigan ism va saqlangan loyiha kodlari chiqadi. Email va hisob ma’lumotlari ulashilmaydi.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1 text-xs text-slate-400">Portfolio’da ko‘rinadigan ism
          <input value={displayName} onChange={event => setDisplayName(event.target.value)} maxLength={80} className="mt-1 w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2.5 text-sm text-white focus:border-neon-cyan focus:outline-none" />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <button type="button" onClick={() => void handlePublish()} disabled={sharingBusy || loading} className="rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{sharingBusy ? 'Saqlanmoqda…' : shareId ? 'Portfolio’ni yangilash' : 'Ulashishni yoqish'}</button>
          {shareId && <button type="button" onClick={() => void handleUnpublish()} disabled={sharingBusy} className="rounded-lg border border-rose-300/20 px-4 py-2.5 text-sm text-rose-200 disabled:opacity-50">Ulashishni o‘chirish</button>}
        </div>
      </div>
      {shareId && <div className="mt-3 flex flex-wrap items-center gap-2">
        <a href={publicUrl} target="_blank" rel="noreferrer" className="break-all text-sm text-neon-cyan underline">{publicUrl}</a>
        <button type="button" onClick={() => void handleCopyLink()} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200">Havolani nusxalash</button>
      </div>}
      {sharingMessage && <p role="status" className="mt-3 text-sm text-emerald-300">{sharingMessage}</p>}
      {sharingError && <p role="alert" className="mt-3 text-sm text-amber-200">{sharingError}</p>}
    </section>}

    {!user ? <section className="mt-8 rounded-2xl border border-white/10 p-8 text-center">
      <p className="text-slate-300">Portfolioingizni ko‘rish uchun hisobingizga kiring.</p>
      <Link href="/auth/login?next=/portfolio" className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 text-sm font-semibold text-white">Kirish</Link>
    </section> : loading ? <p className="mt-8 text-sm text-slate-400">Portfolio yuklanmoqda...</p> : error ? <p role="alert" className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">{error}</p> : entries.length === 0 ? <section className="mt-8 rounded-2xl border border-dashed border-white/15 p-8 text-center">
      <h2 className="font-semibold text-white">Portfolio hali bo‘sh</h2>
      <p className="mt-2 text-sm text-slate-400">Loyihalardan birini ochib, kod va bajarilgan bosqichlarni saqlang.</p>
      <Link href="/projects" className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 text-sm font-semibold text-white">Loyihalarni boshlash</Link>
    </section> : <section className="mt-8 grid gap-5 lg:grid-cols-2">
      {entries.map(([id, project]) => {
        const info = projectInfo[id] || { title: id, steps: 4 };
        const completed = project.completedSteps.filter(step => step >= 0 && step < info.steps).length;
        return <article key={id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
          <div className="flex items-start justify-between gap-3 p-5">
            <div><h2 className="font-semibold text-white">{info.title}</h2><p className="mt-1 text-xs text-slate-400">Saqlangan ish · {completed}/{info.steps} bosqich</p></div>
            <Link href="/projects" className="shrink-0 text-xs text-neon-cyan hover:underline">Tahrirlash</Link>
          </div>
          <iframe title={`${info.title} portfolio ko‘rinishi`} sandbox="allow-scripts" srcDoc={previewDocument(project.code)} className="h-72 w-full border-t border-white/10 bg-white" />
        </article>;
      })}
    </section>}
  </main>;
}
