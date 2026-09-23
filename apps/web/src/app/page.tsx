import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CodeLearn — Learn Programming',
  description: 'Master programming from zero to hero. Learn HTML, CSS, JavaScript, and Python.',
};

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.08),transparent_50%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Learn to Code
          </h1>
          <p className="text-xl sm:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Master programming from absolute zero. Interactive lessons, real-time code
            practice, and progress tracking — all in your language.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-lg hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-neon-blue/20"
            >
              Start Learning
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'HTML', desc: 'Structure the Web' },
              { label: 'CSS', desc: 'Style the Web' },
              { label: 'JavaScript', desc: 'Make it Alive' },
              { label: 'Python', desc: 'General Purpose' },
            ].map((lang) => (
              <div
                key={lang.label}
                className="bg-glass border border-border-subtle rounded-xl p-6 backdrop-blur-sm hover:border-neon-blue/30 transition-all duration-300"
              >
                <div className="text-2xl font-bold text-text-primary mb-1">{lang.label}</div>
                <div className="text-sm text-text-secondary">{lang.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
