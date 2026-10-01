'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, initialized, initialize, loginAs, logout } = useAuthStore();
  const { initialize: initCourses } = useCourseStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initialize();
    initCourses();
  }, [initialize, initCourses]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          <span>Tizim yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  // 1. Agar foydalanuvchi tizimga kirmagan bo'lsa
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a0f24] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Panelga Kirish</h2>
          <p className="text-sm text-slate-400 mb-6">
            Admin panelni boshqarish uchun avval tizimga Administrator yoki Creator sifatida kiring.
          </p>

          <div className="space-y-3 mb-6">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Tezkor sinov uchun tanlang:</p>
            <button
              onClick={() => loginAs('creator')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 text-white transition-all text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <span>👑</span>
                <span>Bosh Admin (Creator)</span>
              </div>
              <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded font-mono">Barcha huquqlar</span>
            </button>

            <button
              onClick={() => loginAs('admin')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 text-white transition-all text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>Admin Nazoratchi</span>
              </div>
              <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-mono">Admin</span>
            </button>
          </div>

          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-lg shadow-neon-blue/20"
            >
              Login sahifasiga o'tish
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 text-xs font-medium"
            >
              Bosh sahifa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Agar foydalanuvchi oddiy USER bo'lsa (Ruxsat yo'q - 403)
  if (currentUser.role === 'user') {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a0f24] border border-red-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl">
            🚫
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-mono font-semibold mb-3">
            403 - RUXSAT BERILMAGAN
          </span>
          <h2 className="text-2xl font-bold text-white mb-2">Kirish Cheklangan!</h2>
          <p className="text-sm text-slate-400 mb-4">
            Sizning hisobingiz: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email}).
            Sizning rolingiz oddiy <strong className="text-neon-cyan">Foydalanuvchi (User)</strong> bo'lgani sababli Admin Panelga kirish taqiqlanadi.
          </p>
          <p className="text-xs text-slate-400 mb-6">
            Admin panel faqat <strong className="text-purple-300">Creator (Bosh admin)</strong> va <strong className="text-blue-300">Admin</strong> larga ochiladi.
          </p>

          <div className="p-3 mb-6 rounded-xl bg-white/[0.03] border border-white/10 text-left">
            <p className="text-xs text-slate-400 mb-2 font-semibold">Tezkor test: rolni almashtirish:</p>
            <button
              onClick={() => loginAs('creator')}
              className="w-full py-2 px-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-between"
            >
              <span>👑 Bosh Admin (Creator) sifatida kirish</span>
              <span>→</span>
            </button>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 py-2.5 rounded-xl bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-cyan text-xs font-bold border border-neon-cyan/30"
            >
              Bosh sahifaga qaytish
            </Link>
            <button
              onClick={() => logout()}
              className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 text-xs font-medium"
            >
              Chiqish (Logout)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Agar foydalanuvchi CREATOR yoki ADMIN bo'lsa -> ADMIN PANEL TO'LIQ OCHILADI
  const isCreator = currentUser.role === 'creator';

  const navItems = [
    { label: 'Boshqaruv', href: '/admin', icon: '📊' },
    { label: 'Kurslar boshqaruvi', href: '/admin/courses', icon: '📚' },
    { label: 'Darslar va Modullar', href: '/admin/lessons', icon: '📖' },
    { label: 'Foydalanuvchilar & Rollar', href: '/admin/users', icon: '👥' },
    { label: 'Tizim Sozlamalari', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0f24] border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-xs font-bold text-white">CL</span>
          <span className="font-bold text-white text-sm">Admin Panel</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#080d1f] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div>
          {/* Brand header */}
          <div className="h-[68px] flex items-center justify-between px-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon-cyan/40 bg-neon-blue/15 font-mono text-xs font-bold text-neon-cyan shadow-[0_0_18px_rgba(25,212,255,0.16)]">
                &lt;/&gt;
              </div>
              <div>
                <span className="font-[Space_Grotesk] text-base font-semibold tracking-tight text-white block leading-none">CodeLearn</span>
                <span className="text-[10px] text-neon-cyan font-mono leading-none tracking-widest uppercase">Admin Panel</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">✕</button>
          </div>

          {/* Current Admin badge */}
          <div className="p-4 mx-3 my-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-lg',
                  isCreator
                    ? 'bg-gradient-to-br from-amber-400 to-purple-600 text-white shadow-purple-500/20'
                    : 'bg-gradient-to-br from-neon-blue to-neon-cyan text-white shadow-cyan-500/20'
                )}
              >
                {isCreator ? '👑' : '🛡️'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={clsx(
                      'text-[9px] font-bold font-mono px-1.5 py-0.5 rounded tracking-wider uppercase',
                      isCreator
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    )}
                  >
                    {isCreator ? 'CREATOR (BOSH)' : 'ADMIN'}
                  </span>
                </div>
              </div>
            </div>
            {isCreator ? (
              <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                <span>✓</span> Barcha huquqlarga ega boshqaruvchi
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-2">
                Kontent boshqaruvchisi (Creator dan kichik)
              </p>
            )}
          </div>

          {/* Nav links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                    active
                      ? 'bg-gradient-to-r from-neon-blue/20 to-neon-cyan/15 text-white border border-neon-cyan/30 shadow-[0_0_15px_rgba(25,212,255,0.12)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* Fast Role Switcher */}
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">Rolni sinash:</p>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => loginAs('creator')}
                className={clsx(
                  'px-2 py-1 rounded text-[10px] font-bold font-mono transition-all',
                  isCreator ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                )}
              >
                👑 Creator
              </button>
              <button
                onClick={() => loginAs('admin')}
                className={clsx(
                  'px-2 py-1 rounded text-[10px] font-bold font-mono transition-all',
                  currentUser.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                )}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-white/10 hover:border-white/20 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <span>←</span> Saytga qaytish
          </Link>

          <button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            className="w-full py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-300 border border-red-500/20 transition-colors"
          >
            Chiqish (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#060913] p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
