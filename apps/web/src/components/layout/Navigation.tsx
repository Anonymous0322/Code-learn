'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useI18n, Language } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';

// ===== SVG FLAGS =====
function FlagEN({ size = 'sm' }: { size?: 'sm'|'md' }) {
  const cls = size === 'sm' ? 'w-4 h-[11px]' : 'w-5 h-[14px]';
  return (
    <svg viewBox="0 0 32 20" className={`${cls} overflow-hidden rounded-[2px] border border-white/20 flex-shrink-0`} fill="none" aria-hidden="true">
      <rect width="32" height="20" fill="#012169"/>
      <path d="M0 0L32 20M32 0L0 20" stroke="#FFF" strokeWidth="4.5"/>
      <path d="M0 0L32 20M32 0L0 20" stroke="#C8102E" strokeWidth="2.2"/>
      <path d="M16 0V20M0 10H32" stroke="#FFF" strokeWidth="6"/>
      <path d="M16 0V20M0 10H32" stroke="#C8102E" strokeWidth="3.6"/>
    </svg>
  );
}

function FlagRU({ size = 'sm' }: { size?: 'sm'|'md' }) {
  const cls = size === 'sm' ? 'w-4 h-[11px]' : 'w-5 h-[14px]';
  return (
    <svg viewBox="0 0 32 20" className={`${cls} overflow-hidden rounded-[2px] border border-white/20 flex-shrink-0`} fill="none" aria-hidden="true">
      <rect width="32" height="6.67" fill="#FFF"/>
      <rect y="6.67" width="32" height="6.67" fill="#0039A6"/>
      <rect y="13.34" width="32" height="6.66" fill="#D52B1E"/>
    </svg>
  );
}

function FlagUZ({ size = 'sm' }: { size?: 'sm'|'md' }) {
  const cls = size === 'sm' ? 'w-4 h-[11px]' : 'w-5 h-[14px]';
  return (
    <svg viewBox="0 0 32 20" className={`${cls} overflow-hidden rounded-[2px] border border-white/20 flex-shrink-0`} fill="none" aria-hidden="true">
      <rect width="32" height="6.5" fill="#0099B5"/>
      <rect y="6.5" width="32" height="0.5" fill="#CE1126"/>
      <rect y="7" width="32" height="6" fill="#FFF"/>
      <rect y="13" width="32" height="0.5" fill="#CE1126"/>
      <rect y="13.5" width="32" height="6.5" fill="#1EB53A"/>
      <circle cx="5.2" cy="3.25" r="2.1" fill="#FFF"/>
      <circle cx="5.9" cy="3.25" r="1.8" fill="#0099B5"/>
      <circle cx="8.5" cy="1.9" r="0.42" fill="#FFF"/>
      <circle cx="9.8" cy="1.9" r="0.42" fill="#FFF"/>
      <circle cx="11.1" cy="1.9" r="0.42" fill="#FFF"/>
      <circle cx="8.5" cy="3.25" r="0.42" fill="#FFF"/>
      <circle cx="9.8" cy="3.25" r="0.42" fill="#FFF"/>
      <circle cx="11.1" cy="3.25" r="0.42" fill="#FFF"/>
      <circle cx="12.4" cy="3.25" r="0.42" fill="#FFF"/>
      <circle cx="8.5" cy="4.6" r="0.42" fill="#FFF"/>
      <circle cx="9.8" cy="4.6" r="0.42" fill="#FFF"/>
      <circle cx="11.1" cy="4.6" r="0.42" fill="#FFF"/>
      <circle cx="12.4" cy="4.6" r="0.42" fill="#FFF"/>
      <circle cx="13.7" cy="4.6" r="0.42" fill="#FFF"/>
    </svg>
  );
}

const LANGS = [
  { code: 'uz' as Language, short: 'UZ', label: "O'zbekcha", sub: "O'zbek tili", Flag: FlagUZ },
  { code: 'ru' as Language, short: 'RU', label: 'Русский',   sub: 'Русский язык', Flag: FlagRU },
  { code: 'en' as Language, short: 'EN', label: 'English',   sub: 'English (US)', Flag: FlagEN },
];

// ===== LANGUAGE DROPDOWN =====
function LangDropdown() {
  const { language, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = LANGS.find(l => l.code === language) || LANGS[2];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) { if (e.key === 'Escape') setOpen(false); return; }
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', handler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', handler); };
  }, [open]);

  const hint = language === 'uz' ? 'Tilni tanlang' : language === 'ru' ? 'Выберите язык' : 'Select language';

  return (
    <div ref={ref} className="relative select-none">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 outline-none cursor-pointer border',
          open
            ? 'border-[#19d4ff]/60 bg-[#3b82f6]/15 text-white shadow-[0_0_14px_rgba(25,212,255,0.28)]'
            : 'border-white/15 bg-white/[0.06] text-slate-200 hover:border-[#19d4ff]/40 hover:bg-white/10 hover:text-white'
        )}
      >
        <cur.Flag size="sm" />
        <span className="font-mono tracking-wide">{cur.short}</span>
        <svg className={clsx('w-3 h-3 text-slate-400 transition-transform duration-200', open && 'rotate-180 text-[#19d4ff]')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-[220px] rounded-2xl border border-white/15 bg-[#090e1f]/96 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(25,212,255,0.14)] backdrop-blur-2xl z-50 animate-fade-in"
        >
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              <svg className="w-3 h-3 text-[#19d4ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {hint}
            
          </div>

          {LANGS.map(({ code, short, label, sub, Flag }) => {
            const active = code === language;
            return (
              <button
                key={code}
                role="option"
                aria-selected={active}
                onClick={() => { setLanguage(code); setOpen(false); }}
                className={clsx(
                  'w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition-all duration-150 outline-none cursor-pointer',
                  active
                    ? 'bg-gradient-to-r from-[#3b82f6]/25 to-[#19d4ff]/15 shadow-[inset_0_0_0_1px_rgba(25,212,255,0.35)]'
                    : 'hover:bg-white/[0.08]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Flag size="md" />
                  <div>
                    <div className="text-xs font-semibold text-white leading-none">{label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-none">{sub}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400">{short}</span>
                  {active
                    ? <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#19d4ff]/20"><svg className="w-2.5 h-2.5 text-[#19d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                    : <span className="w-4 h-4"/>
                  }
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== LANG PILLS (mobile) =====
function LangPills({ onClose }: { onClose: () => void }) {
  const { language, setLanguage } = useI18n();
  const hint = language === 'uz' ? 'Tilni tanlang' : language === 'ru' ? 'Выберите язык' : 'Select language';
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-slate-400 font-medium">{hint}</span>
        <span className="font-mono text-[11px] font-semibold text-[#19d4ff]">{LANGS.find(l=>l.code===language)?.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {LANGS.map(({ code, label, Flag }) => {
          const active = code === language;
          return (
            <button
              key={code}
              onClick={() => { setLanguage(code); onClose(); }}
              className={clsx(
                'flex flex-col items-center gap-1.5 rounded-lg py-2.5 px-2 transition-all duration-200 outline-none cursor-pointer',
                active ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white shadow-lg shadow-[#3b82f6]/25 scale-[1.02]'
                       : 'text-slate-400 hover:bg-white/[0.07] hover:text-slate-200'
              )}
            >
              <Flag size="md" />
              <span className="text-[11px] font-medium leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===== NAVIGATION =====
export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();
  const currentUser = useAuthStore(state => state.currentUser);
  const logout = useAuthStore(state => state.logout);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (p: string) => pathname === p;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080c17]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#19d4ff]/40 bg-[#3b82f6]/15 font-mono text-xs font-bold text-[#19d4ff] shadow-[0_0_18px_rgba(25,212,255,0.16)]">&lt;/&gt;</div>
            <span className="font-[Space_Grotesk] text-base font-semibold tracking-tight text-white">CodeLearn</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {['/', '/courses', '/roadmap', '/projects', '/challenge', '/achievements', '/about'].map(path => (
              <Link
                key={path}
                href={path}
                className={clsx(
                  'rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200',
                  isActive(path) ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                {path === '/' ? t('home') : path === '/courses' ? t('courses') : path === '/roadmap' ? t('roadmap') : path === '/projects' ? 'Loyihalar' : path === '/challenge' ? 'Kunlik mashq' : path === '/achievements' ? 'Yutuqlar' : t('about')}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden items-center gap-3 sm:flex">
            <LangDropdown />
            <span className="h-4 w-px bg-white/10"/>
            {currentUser ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(open => !open)} aria-expanded={profileOpen} aria-label="Open profile menu" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-1.5 pl-1.5 pr-3 text-left hover:border-[#19d4ff]/40">
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-xs font-bold text-white">
                    {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="h-full w-full object-cover" /> : currentUser.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-28 truncate text-xs font-semibold text-slate-200">{currentUser.name}</span>
                  <svg className={clsx('h-3 w-3 text-slate-400 transition-transform', profileOpen && 'rotate-180')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {profileOpen && <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-white/10 bg-[#090e1f] p-1.5 shadow-xl">
                  <div className="border-b border-white/10 px-3 py-2"><p className="truncate text-sm font-semibold text-white">{currentUser.name}</p><p className="truncate text-xs text-slate-400">{currentUser.email}</p></div>
                  <Link href="/profile" onClick={() => setProfileOpen(false)} className="mt-1 block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.07]">{t('profile')}</Link>
                  <Link href="/study-plan" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.07]">Haftalik reja</Link>
                  <Link href="/portfolio" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.07]">Mening portfolioim</Link>
                  {(currentUser.role === 'admin' || currentUser.role === 'creator') && <Link href="/admin" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.07]">{t('adminPanel')}</Link>}
                  <button onClick={() => { setProfileOpen(false); void logout(); }} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10">{t('signOut')}</button>
                </div>}
              </div>
            ) : <>
              <Link href="/auth/login" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-[#19d4ff]/40 hover:text-white transition-colors">{t('login')}</Link>
              <Link href="/auth/register" className="rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-3 py-2 text-xs font-bold text-white shadow-lg shadow-[#3b82f6]/20">{t('signup')}</Link>
            </>}
          </div>

          {/* Mobile: lang + burger */}
          <div className="flex items-center gap-2 sm:hidden">
            <LangDropdown />
            <button
              aria-label="Toggle menu"
              className="rounded-lg p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(v => !v)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="animate-fade-in border-t border-white/10 py-4 md:hidden">
            <div className="grid gap-1 mb-4">
              {[[ '/', t('home')], ['/courses', t('courses')], ['/roadmap', t('roadmap')], ['/projects', 'Loyihalar'], ['/challenge', 'Kunlik mashq'], ['/achievements', 'Yutuqlar'], ['/about', t('about')]].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive(href) ? 'bg-[#3b82f6]/10 text-[#19d4ff]' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 px-1">
              <LangPills onClose={() => setMobileOpen(false)} />
              {currentUser ? <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-white">{currentUser.name} · {t('profile')}</Link>
                <Link href="/study-plan" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 text-sm text-slate-300">Haftalik reja</Link>
                <Link href="/portfolio" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 text-sm text-slate-300">Mening portfolioim</Link>
                {(currentUser.role === 'admin' || currentUser.role === 'creator') && <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 text-sm text-slate-300">{t('adminPanel')}</Link>}
                <button onClick={() => { setMobileOpen(false); void logout(); }} className="rounded-lg px-4 py-2 text-left text-sm text-red-300">{t('signOut')}</button>
              </div> : <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center rounded-lg border border-white/10 py-2.5 text-xs font-semibold text-slate-300 hover:border-white/30 hover:text-white transition-colors">{t('login')}</Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] py-2.5 text-xs font-bold text-white shadow-md">{t('signup')}</Link>
              </div>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
