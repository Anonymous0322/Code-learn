'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PublicPortfolio, usePortfolioSharingStore } from '@/store/portfolioSharingStore';
import { useI18n } from '@/components/providers';

function previewDocument(code: string) {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'">`;
  return `<!doctype html><html><head><meta charset="utf-8">${policy}</head><body>${code}</body></html>`;
}

export default function SharedPortfolioPage({ params }: { params: { shareId: string } }) {
  const { tr } = useI18n();
  const loadPublic = usePortfolioSharingStore(state => state.loadPublic);
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadPublic(params.shareId)
      .then(result => { if (!cancelled) setPortfolio(result); })
      .catch(() => { if (!cancelled) setError(tr('Portfolio hozircha ochilmayapti. Keyinroq qayta urinib ko‘ring.', 'Портфолио сейчас недоступно. Попробуйте позже.', 'Portfolio is unavailable right now. Please try again later.')); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [loadPublic, params.shareId, tr]);

  if (loading) return <main className="mx-auto max-w-5xl px-4 py-16 text-slate-400">{tr('Portfolio yuklanmoqda...', 'Загрузка портфолио...', 'Loading portfolio...')}</main>;
  if (error || !portfolio) return <main className="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 className="text-2xl font-semibold text-white">{tr('Portfolio topilmadi', 'Портфолио не найдено', 'Portfolio not found')}</h1>
    <p className="mt-2 text-sm text-slate-400">{error || tr('Bu portfolio egasi tomonidan o‘chirilgan yoki havola noto‘g‘ri.', 'Владелец удалил портфолио или ссылка неверна.', 'The owner may have deleted this portfolio, or the link is incorrect.')}</p>
    <Link href="/" className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200">{tr('CodeLearn bosh sahifasi', 'На главную CodeLearn', 'CodeLearn home page')}</Link>
  </main>;

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#142044] via-[#0d1428] to-[#11102a] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">{tr('O‘quvchi portfolio’si', 'Портфолио ученика', 'Learner portfolio')}</p>
      <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">{portfolio.displayName}</h1>
      <p className="mt-2 text-sm text-slate-400">{tr('CodeLearn’da yaratilgan amaliy ishlar.', 'Практические работы, созданные в CodeLearn.', 'Projects created with CodeLearn.')}</p>
    </header>
    {portfolio.projects.length === 0 ? <p className="mt-6 rounded-xl border border-white/10 p-5 text-sm text-slate-400">{tr('Hozircha namoyish qilinadigan loyiha yo‘q.', 'Пока нет проектов для показа.', 'There are no projects to display yet.')}</p> : <section className="mt-6 grid gap-5 lg:grid-cols-2">
      {portfolio.projects.map(project => <article key={project.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
        <h2 className="p-5 font-semibold text-white">{project.title}</h2>
        <iframe title={`${project.title} ${tr('namoyishi', 'предпросмотр', 'preview')}`} sandbox="allow-scripts" srcDoc={previewDocument(project.code)} className="h-80 w-full border-t border-white/10 bg-white" />
      </article>)}
    </section>}
    <footer className="mt-8 border-t border-white/10 pt-5 text-sm text-slate-500">{tr('Ushbu sahifani portfolio egasi ulashgan havola orqali ko‘rishingiz mumkin.', 'Эту страницу можно просмотреть по ссылке, которой поделился владелец портфолио.', 'You can view this page using the link shared by the portfolio owner.')} <Link href="/" className="text-neon-cyan hover:underline">CodeLearn</Link></footer>
  </main>;
}
