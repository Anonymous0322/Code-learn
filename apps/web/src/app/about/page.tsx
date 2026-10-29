'use client';

import { useI18n } from '@/components/providers';

export default function AboutPage() {
  const { t } = useI18n();

  const principles = [
    ['01', t('principleZeroTitle'), t('principleZeroText')],
    ['02', t('principleBuildTitle'), t('principleBuildText')],
    ['03', t('principlePurposeTitle'), t('principlePurposeText')],
  ];

  return (
    <main className="relative overflow-hidden">
      <div className="premium-grid pointer-events-none absolute inset-0 opacity-40" />
      <section className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 lg:pt-28">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">{t('aboutStory')}</p>
        <h1 className="max-w-3xl font-[Space_Grotesk] text-5xl font-semibold leading-tight text-white sm:text-7xl">{t('aboutTitle')}</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">{t('aboutIntro')}</p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-24 sm:px-8 md:grid-cols-3">
        {principles.map(([number, title, text]) => <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-neon-cyan/35"><span className="font-mono text-xs text-neon-purple">{number}</span><h2 className="mt-12 font-[Space_Grotesk] text-xl font-semibold text-white">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></article>)}
      </section>
    </main>
  );
}
