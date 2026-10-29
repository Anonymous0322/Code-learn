import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CodeLearn — Learn Programming',
    template: '%s — CodeLearn',
  },
  description: 'Master programming from zero to hero. Interactive lessons, real-time code practice, and progress tracking.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://codelearn.uz'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg-primary text-text-primary antialiased">
        <Providers>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
