import { useI18n } from '@/components/providers';

interface LanguageCardsProps {
  languages: { label: string; desc: string; iconPath: string; slug?: string }[];
}

export function LanguageCards({ languages }: LanguageCardsProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:gap-3">
      {languages.map((lang, index) => (
        <a
          key={lang.label}
          href={`/courses/${lang.slug || lang.label.toLowerCase()}`}
          className="group block rounded-xl border border-indigo-300/20 bg-[#0b1024]/90 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-neon-cyan/50 hover:bg-[#101735] hover:shadow-[0_14px_35px_rgba(25,212,255,0.1)] sm:p-4"
        >
          <div className="relative mb-5 flex items-center justify-center">
            <div className="language-logo flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-[#111a32] p-2.5 transition-transform group-hover:scale-105">
              <img src={lang.iconPath} alt={`${lang.label} logo`} className="h-full w-full object-contain" />
            </div>
            <span className="absolute right-0 top-1 font-mono text-[10px] text-slate-600">0{index + 1}</span>
          </div>
          <h3 className="mb-1 font-[Space_Grotesk] text-sm font-semibold text-white">{lang.label}</h3>
          <p className="min-h-10 text-[10px] leading-4 text-slate-400">{lang.desc}</p>
          <div className="mt-3 inline-flex rounded-full border border-white/15 px-2.5 py-1 text-[9px] font-semibold text-slate-300 transition-colors group-hover:border-neon-purple/50 group-hover:text-white">{t('startLearning')} →</div>
        </a>
      ))}
    </div>
  );
}
