import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — CodeLearn',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Page Not Found</h2>
        <p className="text-text-secondary mb-8">The page you are looking for does not exist.</p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
