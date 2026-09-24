'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useI18n, Language } from '@/components/providers';

// ==================== VECTOR FLAGS ====================
export function FlagUZ({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 20"
      className={clsx('overflow-hidden rounded-[3px] shadow-sm flex-shrink-0 border border-white/20', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top blue stripe */}
      <rect width="32" height="6.5" fill="#0099B5" />
      {/* Red divider */}
      <rect y="6.5" width="32" height="0.5" fill="#CE1126" />
      {/* Middle white stripe */}
      <rect y="7" width="32" height="6" fill="#FFFFFF" />
      {/* Red divider */}
      <rect y="13" width="32" height="0.5" fill="#CE1126" />
      {/* Bottom green stripe */}
      <rect y="13.5" width="32" height="6.5" fill="#1EB53A" />
      {/* Crescent */}
      <circle cx="5.2" cy="3.25" r="2.1" fill="#FFFFFF" />
      <circle cx="5.9" cy="3.25" r="1.8" fill="#0099B5" />
      {/* 12 Stars: 3 on row 1, 4 on row 2, 5 on row 3 */}
      <circle cx="8.5" cy="1.9" r="0.45" fill="#FFFFFF" />
      <circle cx="9.8" cy="1.9" r="0.45" fill="#FFFFFF" />
      <circle cx="11.1" cy="1.9" r="0.45" fill="#FFFFFF" />
      <circle cx="8.5" cy="3.25" r="0.45" fill="#FFFFFF" />
      <circle cx="9.8" cy="3.25" r="0.45" fill="#FFFFFF" />
      <circle cx="11.1" cy="3.25" r="0.45" fill="#FFFFFF" />
      <circle cx="12.4" cy="3.25" r="0.45" fill="#FFFFFF" />
      <circle cx="8.5" cy="4.6" r="0.45" fill="#FFFFFF" />
      <circle cx="9.8" cy="4.6" r="0.45" fill="#FFFFFF" />
      <circle cx="11.1" cy="4.6" r="0.45" fill="#FFFFFF" />
      <circle cx="12.4" cy="4.6" r="0.45" fill="#FFFFFF" />
      <circle cx="13.7" cy="4.6" r="0.45" fill="#FFFFFF" />
    </svg>
  );
}

export function FlagRU({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 20"
      className={clsx('overflow-hidden rounded-[3px] shadow-sm flex-shrink-0 border border-white/20', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="6.67" fill="#FFFFFF" />
      <rect y="6.67" width="32" height="6.67" fill="#0039A6" />
      <rect y="13.34" width="32" height="6.66" fill="#D52B1E" />
    </svg>
  );
}

export function FlagEN({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 20"
      className={clsx('overflow-hidden rounded-[3px] shadow-sm flex-shrink-0 border border-white/20', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="20" fill="#012169" />
      <path d="M0 0L32 20M32 0L0 20" stroke="#FFFFFF" strokeWidth="4.5" />
      <path d="M0 0L32 20M32 0L0 20" stroke="#C8102E" strokeWidth="2.2" />
      <path d="M16 0V20M0 10H32" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M16 0V20M0 10H32" stroke="#C8102E" strokeWidth="3.6" />
    </svg>
  );
}

export interface LanguageItem {
  code: Language;
  label: string;
  shortLabel: string;
  nativeName: string;
  flag: (props: { className?: string }) => JSX.Element;
}

export const LANGUAGES: LanguageItem[] = [
  {
    code: 'uz',
    label: "O'zbekcha",
    shortLabel: 'UZ',
    nativeName: "O'zbek tili",
    flag: FlagUZ,
  },
  {
    code: 'ru',
    label: 'Русский',
    shortLabel: 'RU',
    nativeName: 'Русский язык',
    flag: FlagRU,
  },
  {
    code: 'en',
    label: 'English',
    shortLabel: 'EN',
    nativeName: 'English (US)',
    flag: FlagEN,
  },
];

// ==================== LANGUAGE SWITCHER ====================
export function LanguageSwitcher({
  variant = 'dropdown',
  className,
  onSelect,
}: {
  variant?: 'dropdown' | 'segmented';
  className?: string;
  onSelect?: () => void;
}) {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];
  const CurrentFlag = currentLang.flag;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent | MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const headingText =
    language === 'uz' ? 'Tilni tanlang' : language === 'ru' ? 'Выберите язык' : 'Select language';

  const selectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    onSelect?.();
  };

  if (variant === 'segmented') {
    return (
      <div className={clsx('w-full select-none', className)}>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-400">{headingText}</span>
          <span className="font-mono text-[11px] font-semibold text-neon-cyan">
            {currentLang.label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
          {LANGUAGES.map((item) => {
            const isSelected = item.code === language;
            const ItemFlag = item.flag;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => selectLanguage(item.code)}
                className={clsx(
                  'group flex flex-col items-center justify-center gap-1.5 rounded-lg py-2.5 px-1.5 transition-all duration-200 outline-none cursor-pointer',
                  isSelected
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg shadow-neon-blue/25 font-semibold scale-[1.02]'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 active:scale-95'
                )}
              >
                <ItemFlag className="w-5 h-3.5 shadow-sm" />
                <span className="text-[11px] leading-none font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={clsx('relative inline-block text-left select-none', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Tilni o'zgartirish / Change language"
        className={clsx(
          'group flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 outline-none cursor-pointer',
          isOpen
            ? 'border-neon-cyan/50 bg-neon-blue/15 text-white shadow-[0_0_16px_rgba(25,212,255,0.25)] ring-1 ring-neon-cyan/40'
            : 'border-white/15 bg-white/[0.05] text-slate-200 hover:border-neon-cyan/40 hover:bg-white/[0.09] hover:text-white shadow-sm'
        )}
      >
        <CurrentFlag className="w-4 h-2.5" />
        <span className="font-mono text-xs font-semibold tracking-wider uppercase text-slate-200 group-hover:text-white">
          {currentLang.shortLabel}
        </span>
        <svg
          className={clsx(
            'h-3 w-3 text-slate-400 transition-transform duration-200 group-hover:text-neon-cyan',
            isOpen && 'rotate-180 text-neon-cyan'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#0a0f20]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(25,212,255,0.15)] backdrop-blur-2xl animate-fade-in z-50"
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-1.5">
              <svg className="h-3 w-3 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{headingText}</span>
            </div>
            <span className="rounded bg-neon-cyan/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-neon-cyan">
              i18n
            </span>
          </div>

          {/* Languages list */}
          <div className="mt-1 space-y-1">
            {LANGUAGES.map((item) => {
              const isSelected = item.code === language;
              const ItemFlag = item.flag;
              return (
                <button
                  key={item.code}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => selectLanguage(item.code)}
                  className={clsx(
                    'group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all duration-150 outline-none cursor-pointer',
                    isSelected
                      ? 'bg-gradient-to-r from-neon-blue/20 to-neon-cyan/15 text-white font-medium shadow-[inset_0_0_0_1px_rgba(25,212,255,0.3)]'
                      : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <ItemFlag className="w-5 h-3.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium leading-none text-white">{item.label}</span>
                      <span className="mt-1 text-[10px] leading-none text-slate-400 group-hover:text-slate-300">
                        {item.nativeName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {item.shortLabel}
                    </span>
                    {isSelected ? (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan">
                        <svg
                          className="h-2.5 w-2.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== NAVIGATION COMPONENT ====================
export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080c17]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon-cyan/40 bg-neon-blue/15 font-mono text-xs font-bold text-neon-cyan shadow-[0_0_18px_rgba(25,212,255,0.16)]">
              &lt;/&gt;
            </div>
            <span className="font-[Space_Grotesk] text-base font-semibold tracking-tight text-white">CodeLearn</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {['/', '/courses', '/roadmap', '/about'].map((path) => (
              <Link
                key={path}
                href={path}
                className={clsx(
                  'rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200',
                  isActive(path)
                    ? 'bg-neon-blue/10 text-neon-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-glass',
                )}
              >
                {path === '/' ? t('home') : path === '/courses' ? t('courses') : path === '/roadmap' ? t('roadmap') : t('about')}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <LanguageSwitcher variant="dropdown" />
            <span className="h-4 w-px bg-white/10" />
            <Link href="/auth/login" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-neon-cyan/40 hover:text-white">{t('login')}</Link>
            <Link href="/auth/register" className="rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-3 py-2 text-xs font-bold text-white shadow-lg shadow-neon-blue/15">{t('signup')}</Link>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <LanguageSwitcher variant="dropdown" />
            <button
              aria-label="Toggle menu"
              className="rounded-lg p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="animate-fade-in border-t border-border-subtle py-4 md:hidden">
            <div className="grid gap-1">
              {[
                ['/', t('home')],
                ['/courses', t('courses')],
                ['/roadmap', t('roadmap')],
                ['/about', t('about')],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive(href)
                      ? 'bg-neon-blue/10 text-neon-cyan'
                      : 'text-text-secondary hover:bg-white/[0.04] hover:text-white'
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 px-2 pt-4">
              <LanguageSwitcher variant="segmented" onSelect={() => setMobileOpen(false)} />
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-white/10 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-neon-cyan/40 hover:text-white"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple py-2.5 text-xs font-bold text-white shadow-md shadow-neon-blue/20"
                >
                  {t('signup')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
