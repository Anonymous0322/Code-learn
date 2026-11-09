'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/components/providers';

// Replace these profile URLs with your own social media links.
const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/uletaaay/', icon: 'instagram' },
  { name: 'GitHub', href: 'https://github.com/Anonymous0322', icon: 'github' },
  { name: 'Telegram', href: 'https://t.me/code_learnuz', icon: 'telegram' },
] as const;

export function Footer() {
  const pathname = usePathname();
  const { t, tr } = useI18n();

  if (pathname?.startsWith('/auth') || pathname?.startsWith('/admin') || pathname?.startsWith('/learn/')) {
    return null;
  }

  return (
    <footer className="border-t border-border-subtle bg-bg-secondary/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                  <Link href={`/courses/${course.toLowerCase()}`} className="text-sm text-text-secondary hover:text-neon-blue transition-colors">
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('footerResources')}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-neon-blue transition-colors">{t('about')}</Link></li>
              <li><Link href="/faq" className="text-sm text-text-secondary hover:text-neon-blue transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-text-primary">{tr('Bizni kuzating', 'Мы в соцсетях', 'Follow CodeLearn')}</h4>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`CodeLearn on ${social.name}`}
                  title={social.name}
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-text-secondary shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 hover:border-white/25 hover:text-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`h-5 w-5 transition-transform duration-300 group-hover:rotate-[-8deg] ${
                      social.icon === 'instagram' ? 'group-hover:text-fuchsia-400' :
                      social.icon === 'github' ? 'group-hover:text-white' :
                      'group-hover:text-sky-400'
                    }`}
                  >
                    {social.icon === 'instagram' && (
                      <>
                        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
                      </>
                    )}
                    {social.icon === 'github' && (
                      <path
                        fill="currentColor"
                        d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76 2.44 4.12 1.74.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.24-5.06-5.5 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.27-2.6 5.21-5.08 5.49.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
                      />
                    )}
                    {social.icon === 'telegram' && (
                      <path
                        fill="currentColor"
                        d="M21.8 4.2 18.5 20c-.25 1.12-.91 1.4-1.85.87l-5.1-3.76-2.46 2.37c-.27.27-.5.5-1.02.5l.36-5.18 9.43-8.52c.41-.36-.09-.56-.64-.2L5.56 13.42.53 11.85c-1.09-.34-1.11-1.09.23-1.62L20.45 2.7c.9-.33 1.69.22 1.35 1.5Z"
                      />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} CodeLearn. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
