'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-bg-secondary/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-neon-blue/20">
              CL
            </div>
            <span className="text-xl font-bold text-text-primary">CodeLearn</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {['/courses'].map((path) => (
              <Link
                key={path}
                href={path}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(path)
                    ? 'bg-neon-blue/10 text-neon-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-glass',
                )}
              >
                {path === '/courses' ? 'Courses' : ''}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {['en', 'ru', 'uz'].map((lang) => (
              <button
                key={lang}
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
                  'bg-neon-blue/20 text-neon-blue border border-neon-blue/30',
                )}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border-subtle animate-fade-in">
            <Link href="/courses" className="block px-4 py-2 rounded-lg text-text-secondary hover:text-neon-blue">
              Courses
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
