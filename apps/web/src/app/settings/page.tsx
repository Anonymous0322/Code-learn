'use client';

import { useI18n } from '@/components/providers';

const choices = [
  { code: 'uz', label: 'O‘zbekcha' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
] as const;

export default function SettingsPage() {
  const { language, setLanguage, tr } = useI18n();

  return <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
    <h1 className="font-[Space_Grotesk] text-4xl font-semibold text-white">{tr('Sozlamalar', 'Настройки', 'Settings')}</h1>
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <h2 className="font-semibold text-white">{tr('Sayt tili', 'Язык сайта', 'Site language')}</h2>
      <p className="mt-1 text-sm text-slate-400">{tr('Interfeys tilini tanlang.', 'Выберите язык интерфейса.', 'Choose the interface language.')}</p>
      <div className="mt-4 flex flex-wrap gap-2">{choices.map(choice => <button key={choice.code} type="button" aria-pressed={language === choice.code} onClick={() => setLanguage(choice.code)} className={`rounded-lg border px-4 py-2 text-sm ${language === choice.code ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-white/15 text-slate-300 hover:border-white/30'}`}>{choice.label}</button>)}</div>
    </section>
  </main>;
}
