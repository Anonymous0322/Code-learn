'use client';

import { useI18n } from '@/components/providers';

export default function FaqPage() {
  const { t } = useI18n();

  const questions = [
    [t('faqQ1'), t('faqA1')],
    [t('faqQ2'), t('faqA2')],
    [t('faqQ3'), t('faqA3')],
    [t('faqQ4'), t('faqA4')],
  ];

  return <main className="mx-auto max-w-4xl px-5 py-20 sm:px-8"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">{t('faqIntro')}</p><h1 className="font-[Space_Grotesk] text-5xl font-semibold text-white">{t('faqTitle')}</h1><div className="mt-10 space-y-3">{questions.map(([question, answer]) => <details key={question} className="group rounded-xl border border-white/10 bg-white/[0.035] p-5 open:border-neon-purple/35"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[Space_Grotesk] font-semibold text-white"><span>{question}</span><span className="text-xl text-neon-cyan transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-4 text-sm leading-6 text-slate-400">{answer}</p></details>)}</div></main>;
}
