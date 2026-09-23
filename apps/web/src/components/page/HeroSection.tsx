interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export function HeroSection({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.08),transparent_50%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center animate-fade-in">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text">
          {title}
        </h1>
        <p className="text-xl sm:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <a
          href={ctaLink}
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-neon-blue/20"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}
