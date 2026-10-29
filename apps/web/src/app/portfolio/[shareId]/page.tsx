'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PublicPortfolio, usePortfolioSharingStore } from '@/store/portfolioSharingStore';

function previewDocument(code: string) {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'">`;
  return `<!doctype html><html><head><meta charset="utf-8">${policy}</head><body>${code}</body></html>`;
}

export default function SharedPortfolioPage({ params }: { params: { shareId: string } }) {
  const loadPublic = usePortfolioSharingStore(state => state.loadPublic);
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadPublic(params.shareId)
      .then(result => { if (!cancelled) setPortfolio(result); })
      .catch(() => { if (!cancelled) setError('Portfolio hozircha ochilmayapti. Keyinroq qayta urinib ko‘ring.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [loadPublic, params.shareId]);

  if (loading) return <main className="mx-auto max-w-5xl px-4 py-16 text-slate-400">Portfolio yuklanmoqda...</main>;
  if (error || !portfolio) return <main className="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 className="text-2xl font-semibold text-white">Portfolio topilmadi</h1>
    <p className="mt-2 text-sm text-slate-400">{error || 'Bu portfolio egasi tomonidan o‘chirilgan yoki havola noto‘g‘ri.'}</p>
    <Link href="/" className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200">CodeLearn bosh sahifasi</Link>
  </main>;

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#142044] via-[#0d1428] to-[#11102a] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">O‘quvchi portfolio’si</p>
      <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">{portfolio.displayName}</h1>
      <p className="mt-2 text-sm text-slate-400">CodeLearn’da yaratilgan amaliy ishlar.</p>
    </header>
    {portfolio.projects.length === 0 ? <p className="mt-6 rounded-xl border border-white/10 p-5 text-sm text-slate-400">Hozircha namoyish qilinadigan loyiha yo‘q.</p> : <section className="mt-6 grid gap-5 lg:grid-cols-2">
      {portfolio.projects.map(project => <article key={project.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
        <h2 className="p-5 font-semibold text-white">{project.title}</h2>
        <iframe title={`${project.title} namoyishi`} sandbox="allow-scripts" srcDoc={previewDocument(project.code)} className="h-80 w-full border-t border-white/10 bg-white" />
      </article>)}
    </section>}
    <footer className="mt-8 border-t border-white/10 pt-5 text-sm text-slate-500">Ushbu sahifani portfolioni egasi ulashgan havola orqali ko‘rishingiz mumkin. <Link href="/" className="text-neon-cyan hover:underline">CodeLearn</Link></footer>
  </main>;
}
