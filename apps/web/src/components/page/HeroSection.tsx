'use client';

import { useI18n } from '@/components/providers';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export function HeroSection({ ctaLink }: HeroSectionProps) {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050711]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(39,73,224,0.22),transparent_33%),radial-gradient(circle_at_20%_35%,rgba(126,47,255,0.12),transparent_32%),linear-gradient(180deg,#080b18_0%,#050711_100%)]" />
      <div className="premium-grid absolute inset-0 opacity-50" />

      <div className="relative z-10 mx-auto max-w-[1220px] px-4 pb-6 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-2">
          <div className="relative z-20 max-w-xl animate-fade-in lg:pr-4">
            <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-slate-300 shadow-lg">
              {t('heroBadge')}
            </div>
            <h1 className="font-[Space_Grotesk] text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.7rem]">
              {t('heroTitle')}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400 sm:text-base">{t('heroText')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={ctaLink} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7346ff] to-[#a83dff] px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_25px_rgba(132,65,255,0.32)] transition-transform hover:-translate-y-0.5">{t('start')}<span>→</span></a>
              <a href="#languages" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-slate-200 hover:border-white/40"><span>◎</span> {t('explore')}</a>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-[#070b19] shadow-[0_20px_70px_rgba(0,0,0,0.45)] sm:min-h-[370px] lg:-mr-8 lg:min-h-[410px]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/hero-coding.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Developer working at a computer"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,20,0.55),transparent_48%,rgba(4,7,20,0.28))]" />
            <div className="pointer-events-none absolute inset-x-3 top-3 bottom-[4.75rem] border-x border-white/25 sm:inset-x-5 sm:top-4 sm:bottom-20" />
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#050711]/65 to-transparent sm:w-4" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-[#050711]/65 to-transparent sm:w-4" />
            <div className="absolute inset-x-0 bottom-0 flex min-h-14 items-center justify-center bg-[#050711]/[0.98] px-4 py-2.5 text-center sm:min-h-16 sm:px-6 sm:py-3">
              <span className="text-xs font-semibold leading-5 text-slate-100 sm:text-base">{t('heroFloatingNote')}</span>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-7 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-[#10152b]/80 shadow-[0_12px_35px_rgba(0,0,0,0.25)] backdrop-blur sm:grid-cols-4">
          {[
            ['◉', t('interactiveLessons'), t('learnByDoing')],
            ['✥', t('realProjects'), t('buildPortfolio')],
            ['◎', t('multiLanguage'), 'EN / RU / UZ'],
            ['⌁', t('trackProgress'), t('seeGrowth')],
          ].map(([icon, label, text]) => (
            <div
              key={label}
              className="group relative flex items-center gap-2 border-white/10 px-3 py-3 transition-colors duration-300 hover:bg-indigo-400/[0.08] active:bg-indigo-400/[0.12] first:border-0 sm:border-l sm:px-5 motion-reduce:transition-none"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/[0.09] via-purple-500/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" />
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-indigo-300/10 bg-indigo-500/15 text-sm text-purple-300 shadow-[0_0_0_rgba(99,102,241,0)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:border-indigo-300/30 group-hover:bg-indigo-500/25 group-hover:text-white group-hover:shadow-[0_0_18px_rgba(99,102,241,0.3)] motion-reduce:transform-none motion-reduce:transition-none">
                {icon}
              </span>
              <span className="relative min-w-0">
                <strong className="block truncate text-[9px] font-medium text-white transition-colors duration-300 group-hover:text-indigo-100 sm:text-[10px] motion-reduce:transition-none">{label}</strong>
                <small className="block truncate text-[8px] text-slate-500 transition-colors duration-300 group-hover:text-slate-300 motion-reduce:transition-none">{text}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
