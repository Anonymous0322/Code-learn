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

          <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-indigo-400/20 bg-[#070b19] shadow-[0_20px_70px_rgba(0,0,0,0.45)] sm:min-h-[370px] lg:-mr-8 lg:min-h-[410px]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/hero-coding.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Developer working at a computer"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,20,0.6),transparent_48%,rgba(4,7,20,0.22)),linear-gradient(0deg,rgba(4,6,18,0.72),transparent_42%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#050711] via-[#050711]/90 to-[#050711]/45 sm:h-[4.5rem]" />
            <div className="absolute bottom-3 left-4 rounded-md border border-white/15 bg-[#080b18]/95 px-2.5 py-1.5 text-[8px] font-medium tracking-wide text-slate-300 shadow-lg backdrop-blur sm:bottom-4 sm:left-6 sm:text-[9px]">CodeLearn Studio</div>
            <div className="absolute bottom-3 right-3 max-w-[170px] rounded-md border border-white/15 bg-[#080b18]/95 px-2.5 py-1.5 text-right text-[8px] font-medium leading-3 tracking-wide text-slate-300 shadow-lg backdrop-blur sm:bottom-4 sm:right-40 sm:max-w-none sm:text-[14px] sm:leading-5">{t('heroFloatingNote')}</div>
          </div>
        </div>

        <div className="relative z-20 mt-7 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-[#10152b]/80 shadow-[0_12px_35px_rgba(0,0,0,0.25)] backdrop-blur sm:grid-cols-4">
          {[
            ['◉', t('interactiveLessons'), t('learnByDoing')],
            ['✥', t('realProjects'), t('buildPortfolio')],
            ['◎', t('multiLanguage'), 'EN / RU / UZ'],
            ['⌁', t('trackProgress'), t('seeGrowth')],
          ].map(([icon, label, text]) => <div key={label} className="flex items-center gap-2 border-white/10 px-3 py-3 first:border-0 sm:border-l sm:px-5"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-sm text-purple-300">{icon}</span><span className="min-w-0"><strong className="block truncate text-[9px] font-medium text-white sm:text-[10px]">{label}</strong><small className="block truncate text-[8px] text-slate-500">{text}</small></span></div>)}
        </div>
      </div>
    </section>
  );
}
