import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'CodeLearn — Master Programming',
    template: '%s | CodeLearn',
  },
  description: 'Learn programming from zero with interactive lessons, code editor, and gamified learning.',
  keywords: ['programming', 'learn', 'code', 'education', 'HTML', 'CSS', 'JavaScript', 'Python'],
  authors: [{ name: 'CodeLearn' }],
  openGraph: {
    title: 'CodeLearn — Master Programming',
    description: 'Learn programming from zero with interactive lessons, code editor, and gamified learning.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeLearn — Master Programming',
    description: 'Learn programming from zero with interactive lessons, code editor, and gamified learning.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neon-dark-950 text-white antialiased">{children}</body>
    </html>
  );
}
