import { Metadata } from 'next';
import { HeroSection } from '@/components/page/HeroSection';
import { LanguageCards } from '@/components/page/LanguageCards';
import { StatsSection } from '@/components/page/StatsSection';
import { FeatureSection } from '@/components/page/FeatureSection';

export const metadata: Metadata = {
  title: 'CodeLearn — Learn Programming',
  description: 'Master programming from zero to hero. Interactive lessons, real-time code practice, and progress tracking.',
};

const languages = [
  { label: 'HTML', desc: 'Structure the Web', icon: '🌐' },
  { label: 'CSS', desc: 'Style the Web', icon: '🎨' },
  { label: 'JavaScript', desc: 'Make it Alive', icon: '⚡' },
  { label: 'Python', desc: 'General Purpose', icon: '🐍' },
];

const features = [
  { icon: '🎓', title: 'Interactive Lessons', description: 'Learn with step-by-step explanations and code examples.' },
  { icon: '💻', title: 'Code Practice', description: 'Write and run code directly in your browser.' },
  { icon: '📊', title: 'Progress Tracking', description: 'Track your XP, streaks, and achievements.' },
  { icon: '🌍', title: 'Multilingual', description: 'Learn in Uzbek, Russian, or English.' },
];

const stats = [
  { label: 'Courses', value: '4', icon: '📚' },
  { label: 'Lessons', value: '80+', icon: '📖' },
  { label: 'Exercises', value: '200+', icon: '✏️' },
  { label: 'Learners', value: '10K+', icon: '👥' },
];

export default function HomePage() {
  return (
    <div>
      <HeroSection
        title="Learn to Code. From Zero to Developer."
        subtitle="Master programming from absolute zero. Interactive lessons, real-time code practice, and progress tracking — all in your language."
        ctaText="Start Learning"
        ctaLink="/courses"
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center gradient-text">Choose Your Language</h2>
          <LanguageCards languages={languages} />
        </div>
      </section>

      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center gradient-text">Why CodeLearn?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <FeatureSection key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center gradient-text">By The Numbers</h2>
          <StatsSection stats={stats} />
        </div>
      </section>

      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center gradient-text">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: 1, title: 'Choose a Language', description: 'Pick from HTML, CSS, JavaScript, or Python.' },
              { number: 2, title: 'Start from Zero', description: 'Every course starts with absolute basics.' },
              { number: 3, title: 'Learn + Practice', description: 'Watch, read, and write code interactively.' },
              { number: 4, title: 'Build Projects', description: 'Apply your skills to real-world projects.' },
            ].map((step, i) => (
              <div key={step.number} className="text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
