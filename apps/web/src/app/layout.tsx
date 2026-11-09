import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppAccess } from '@/components/auth/AppAccess';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CodeLearn — Learn Programming',
    template: '%s — CodeLearn',
  },
  description: 'Master programming from zero to hero. Interactive lessons, real-time code practice, and progress tracking.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://codelearn.uz'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg-primary text-text-primary antialiased">
        <Providers>
          <AppAccess>{children}</AppAccess>
        </Providers>
      </body>
    </html>
  );
}
