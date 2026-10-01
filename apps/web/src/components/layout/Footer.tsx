'use client';

import { usePathname } from 'next/navigation';
import { useI18n } from '@/components/providers';

export function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname?.startsWith('/auth') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-border-subtle bg-bg-secondary/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-sm">
                CL
              </div>
              <span className="text-lg font-bold text-text-primary">CodeLearn</span>
            </div>
            <p className="text-sm text-text-secondary">
              {t('heroText')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('courses')}</h4>
            <ul className="space-y-2">
              {['HTML', 'CSS', 'JavaScript', 'Python'].map((course) => (
                <li key={course}>
                  <a href={`/courses/${course.toLowerCase()}`} className="text-sm text-text-secondary hover:text-neon-blue transition-colors">
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('footerResources')}</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-text-secondary hover:text-neon-blue transition-colors">{t('about')}</a></li>
              <li><a href="/faq" className="text-sm text-text-secondary hover:text-neon-blue transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-sm text-text-secondary hover:text-neon-blue transition-colors">{t('footerContact')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('footerConnect')}</h4>
            <div className="flex gap-3">
              {[
                { label: 'GitHub', icon: 'G' },
                { label: 'Twitter', icon: 'X' },
                { label: 'Discord', icon: 'D' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-glass border border-border-subtle flex items-center justify-center text-text-secondary hover:border-neon-blue/30 hover:text-neon-blue transition-all"
                >
                  <span className="text-xs font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} CodeLearn. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[t('footerPrivacy'), t('footerTerms'), t('footerSitemap')].map((link) => (
              <a key={link} href="#" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
