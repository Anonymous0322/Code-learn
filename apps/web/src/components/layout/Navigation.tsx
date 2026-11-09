'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useI18n, Language } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { NotificationCenter } from '@/components/layout/NotificationCenter';

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
  { code: 'uz' as Language, short: 'UZ', label: "Özbekça", sub: "Özbek tili", Flag: FlagUZ },
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
          'group flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-300 outline-none cursor-pointer border focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c17] motion-reduce:transition-none',
          open
            ? 'border-[#19d4ff]/60 bg-gradient-to-r from-[#3b82f6]/20 to-[#8b5cf6]/20 text-white shadow-[0_0_18px_rgba(25,212,255,0.2)]'
            : 'border-white/10 bg-white/[0.045] text-slate-200 hover:-translate-y-0.5 hover:border-[#19d4ff]/40 hover:bg-white/[0.09] hover:text-white hover:shadow-[0_8px_24px_rgba(25,212,255,0.12)] motion-reduce:transform-none'
        )}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.08] ring-1 ring-white/10 transition-colors group-hover:bg-white/[0.12]">
          <cur.Flag size="sm" />
        </span>
        <span className="font-mono tracking-wide">{cur.short}</span>
        <svg className={clsx('h-3 w-3 text-slate-400 transition-transform duration-300', open && 'rotate-180 text-[#19d4ff]')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-[232px] overflow-hidden rounded-2xl border border-white/15 bg-[#090e1f]/95 p-1.5 shadow-[0_22px_55px_rgba(0,0,0,0.75),0_0_28px_rgba(25,212,255,0.12)] backdrop-blur-2xl language-dropdown-enter"
        >
            <div className="mb-1 flex items-center gap-2 border-b border-white/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              <svg className="w-3 h-3 text-[#19d4ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {hint}
          </div>

          {LANGS.map(({ code, short, label, sub, Flag }, index) => {
            const active = code === language;
            return (
              <button
                key={code}
                role="option"
                aria-selected={active}
                onClick={() => { setLanguage(code); setOpen(false); }}
                style={{ animationDelay: `${index * 45}ms` }}
                className={clsx(
                  'language-option-enter group/option flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-300 motion-reduce:transition-none',
                  active
                    ? 'bg-gradient-to-r from-[#3b82f6]/25 to-[#19d4ff]/15 shadow-[inset_0_0_0_1px_rgba(25,212,255,0.35)]'
                    : 'hover:translate-x-0.5 hover:bg-white/[0.07] motion-reduce:transform-none'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={clsx('flex h-9 w-9 items-center justify-center rounded-xl border transition-colors', active ? 'border-cyan-300/20 bg-cyan-300/10' : 'border-white/5 bg-white/[0.04] group-hover/option:border-white/10 group-hover/option:bg-white/[0.07]')}>
                    <Flag size="md" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold leading-none text-white">{label}</div>
                    <div className="mt-1 text-[10px] leading-none text-slate-400">{sub}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400">{short}</span>
                  {active
                    ? <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#19d4ff]/20"><svg className="h-3 w-3 text-[#19d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                    : <span className="h-5 w-5"/>
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

// ===== NAVIGATION =====
export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, tr } = useI18n();
  const currentUser = useAuthStore(state => state.currentUser);
  const logout = useAuthStore(state => state.logout);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen && !profileOpen) return;
    const handleDismiss = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === 'Escape') {
          setMobileOpen(false);
          setProfileOpen(false);
        }
        return;
      }
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (mobileOpen && navRef.current && !navRef.current.contains(target)) setMobileOpen(false);
      if (profileOpen && profileMenuRef.current && !profileMenuRef.current.contains(target)) setProfileOpen(false);
    };
    document.addEventListener('pointerdown', handleDismiss);
    document.addEventListener('keydown', handleDismiss);
    return () => {
      document.removeEventListener('pointerdown', handleDismiss);
      document.removeEventListener('keydown', handleDismiss);
    };
  }, [mobileOpen, profileOpen]);

  const isActive = (p: string) => pathname === p;

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : tr('Hisobdan chiqib bo‘lmadi.', 'Не удалось выйти из аккаунта.', 'Could not sign out.');
      console.error('Hisobdan chiqish amalga oshmadi.', error);
      setLogoutError(message);
    }
  };

  return (
    <nav ref={navRef} className="sticky top-0 z-50 border-b border-white/10 bg-[#080c17]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#19d4ff]/40 bg-[#3b82f6]/15 font-mono text-xs font-bold text-[#19d4ff] shadow-[0_0_18px_rgba(25,212,255,0.16)]">&lt;/&gt;</div>
            <span className="font-[Space_Grotesk] text-base font-semibold tracking-tight text-white">CodeLearn</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {['/', '/courses', '/roadmap', '/projects', '/challenge', '/achievements', '/forum', '/about'].map(path => (
              <Link
                key={path}
                href={path}
                aria-current={isActive(path) ? 'page' : undefined}
                className={clsx(
                  'group relative overflow-hidden rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(59,130,246,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-reduce:transform-none motion-reduce:transition-none',
                  isActive(path) ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                <span className="relative z-10">
                  {path === '/' ? t('home') : path === '/courses' ? t('courses') : path === '/roadmap' ? t('roadmap') : path === '/projects' ? tr('Loyihalar', 'Проекты', 'Projects') : path === '/challenge' ? tr('Kunlik maşq', 'Ежедневное задание', 'Daily challenge') : path === '/achievements' ? tr('Yutuqlar', 'Достижения', 'Achievements') : path === '/forum' ? tr('Forum', 'Форум', 'Forum') : t('about')}
                </span>
                <span
                  aria-hidden="true"
                  className={clsx(
                    'absolute inset-x-3 bottom-1 h-px origin-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#19d4ff] transition-transform duration-300 motion-reduce:transition-none',
                    isActive(path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden items-center gap-3 lg:flex">
            <LangDropdown />
            <NotificationCenter />
            <span className="h-4 w-px bg-white/10"/>
            {currentUser ? (
              <div ref={profileMenuRef} className="relative">
                <button type="button" onClick={() => setProfileOpen(open => !open)} aria-controls="desktop-profile-menu" aria-expanded={profileOpen} aria-label={profileOpen ? tr('Profil menyusini yopiş', 'Закрыть меню профиля', 'Close profile menu') : tr('Profil menyusini oçiş', 'Открыть меню профиля', 'Open profile menu')} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-1.5 pl-1.5 pr-3 text-left hover:border-[#19d4ff]/40">
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-xs font-bold text-white">
                    {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="h-full w-full object-cover" /> : currentUser.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-28 truncate text-xs font-semibold text-slate-200">{currentUser.name}</span>
                  <svg className={clsx('h-3 w-3 text-slate-400 transition-transform', profileOpen && 'rotate-180')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {profileOpen && <div id="desktop-profile-menu" className="absolute right-0 top-full z-50 mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-[#090e1f] p-1.5 shadow-xl animate-fade-in">
                  <div className="border-b border-white/10 px-3 py-2"><p className="truncate text-sm font-semibold text-white">{currentUser.name}</p><p className="truncate text-xs text-slate-400">{currentUser.email}</p></div>
                  <Link href="/profile" onClick={() => setProfileOpen(false)} className="mt-1 block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.07]">{t('profile')}</Link>
                  <Link href="/study-plan" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.07]">{tr('Haftalik reja', 'План на неделю', 'Weekly plan')}</Link>
                  <Link href="/portfolio" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.07]">{tr('Mening portfolioim', 'Моё портфолио', 'My portfolio')}</Link>
                  {(currentUser.role === 'admin' || currentUser.role === 'creator') && <Link href="/admin" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.07]">{t('adminPanel')}</Link>}
                  {logoutError && <p role="alert" className="px-3 py-2 text-xs text-rose-300">{logoutError}</p>}
                  <button onClick={() => void handleLogout()} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10">{t('signOut')}</button>
                </div>}
              </div>
            ) : <>
              <Link href="/auth/login" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-[#19d4ff]/40 hover:text-white transition-colors">{t('login')}</Link>
              <Link href="/auth/register" className="rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-3 py-2 text-xs font-bold text-white shadow-lg shadow-[#3b82f6]/20">{t('signup')}</Link>
            </>}
          </div>

          {/* Mobile: lang + burger */}
          <div className="flex items-center gap-2 lg:hidden">
            <LangDropdown />
            <NotificationCenter />
            <button
              type="button"
              aria-controls="mobile-navigation-menu"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? tr('Menyuni yopiş', 'Закрыть меню', 'Close menu') : tr('Menyuni oçiş', 'Открыть меню', 'Open menu')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
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
          <div id="mobile-navigation-menu" className="max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain border-t border-white/10 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] animate-fade-in lg:hidden">
            <div className="grid gap-1 mb-4">
              {[[ '/', t('home')], ['/courses', t('courses')], ['/roadmap', t('roadmap')], ['/projects', tr('Loyihalar', 'Проекты', 'Projects')], ['/challenge', tr('Kunlik maşq', 'Ежедневное задание', 'Daily challenge')], ['/achievements', tr('Yutuqlar', 'Достижения', 'Achievements')], ['/forum', tr('Forum', 'Форум', 'Forum')], ['/about', t('about')]].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-reduce:transform-none motion-reduce:transition-none',
                    isActive(href) ? 'bg-[#3b82f6]/10 text-[#19d4ff]' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 px-1">
              {currentUser ? <div className="grid gap-2">
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-white">{currentUser.name} · {t('profile')}</Link>
                <Link href="/study-plan" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 text-sm text-slate-300">{tr('Haftalik reja', 'План на неделю', 'Weekly plan')}</Link>
                <Link href="/portfolio" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 text-sm text-slate-300">{tr('Mening portfolioim', 'Моё портфолио', 'My portfolio')}</Link>
                {(currentUser.role === 'admin' || currentUser.role === 'creator') && <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2 text-sm text-slate-300">{t('adminPanel')}</Link>}
                {logoutError && <p role="alert" className="px-4 py-2 text-xs text-rose-300">{logoutError}</p>}
                <button onClick={() => void handleLogout()} className="rounded-lg px-4 py-2 text-left text-sm text-red-300">{t('signOut')}</button>
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
