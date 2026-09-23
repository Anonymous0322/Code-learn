'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useContext } from 'react';
import { ThemeContext } from './providers';
import clsx from 'clsx';

export function Navigation() {
  const pathname = usePathname();
  const { language, setLanguage } = useContext(ThemeContext);

  const navLinkClass = clsx(
    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
    'text-text-secondary hover:text-neon-blue hover:bg-glass',
  );

  return (
    <nav className="sticky top-0 z-50 bg-bg-secondary/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">CL</span>
            </div>
            <span className="text-xl font-bold text-text-primary">CodeLearn</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link href="/courses" className={navLinkClass}>Courses</Link>
          </div>

          <div className="flex items-center gap-2">
            {['en', 'ru', 'uz'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
                  language === lang
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'bg-glass text-text-muted border border-border-subtle',
                )}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
