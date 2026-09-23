'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, Search, Moon, Sun, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { commonTranslations } from '@/i18n/translations';
import { Language } from '@/types';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Language>('en');

  const navLinks = [
    { href: '/', label: commonTranslations.learn[lang] },
    { href: '/courses', label: commonTranslations.courses[lang] },
    { href: '/about', label: 'About' },
    { href: '/dashboard', label: commonTranslations.dashboard[lang] },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-white/5 bg-neon-dark-950/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center neon-glow">
              <span className="text-xl font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold gradient-text">CodeLearn</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 w-48 lg:w-64"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'en' ? 'uz' : lang === 'uz' ? 'ru' : 'en')}>
              <span className="text-xs font-mono">{lang.toUpperCase()}</span>
            </Button>
            <Button variant="outline" size="sm">
              {commonTranslations.signIn[lang]}
            </Button>
            <Button variant="primary" size="sm">
              {commonTranslations.signUp[lang]}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              <Button variant="primary" className="w-full" size="sm">
                {commonTranslations.signUp[lang]}
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                {commonTranslations.signIn[lang]}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
