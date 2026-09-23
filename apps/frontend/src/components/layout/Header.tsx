'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { commonTranslations } from '@/i18n/translations';
import { Language } from '@/types';

interface HeaderProps {
  currentPage?: string;
}

export function Header({ currentPage = 'home' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const navLinks = [
    { href: '/', label: commonTranslations.learn[lang], active: currentPage === 'home' },
    { href: '/courses', label: commonTranslations.courses[lang], active: currentPage === 'courses' },
    { href: '/about', label: 'About', active: currentPage === 'about' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-neon-dark-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center neon-glow">
              <span className="text-xl font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold gradient-text">CodeLearn</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  link.active
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 w-48"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'en' ? 'uz' : lang === 'uz' ? 'ru' : 'en')}>
              <span className="text-xs font-mono">{lang.toUpperCase()}</span>
            </Button>
            <Button variant="outline" size="sm">{commonTranslations.signIn[lang]}</Button>
            <Button size="sm">{commonTranslations.signUp[lang]}</Button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-white/5 py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
                {link.label}
              </a>
            ))}
            <div className="pt-3 space-y-2">
              <Button className="w-full" size="sm">{commonTranslations.signUp[lang]}</Button>
              <Button variant="outline" className="w-full" size="sm">{commonTranslations.signIn[lang]}</Button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
