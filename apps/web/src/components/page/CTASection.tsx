interface CTASectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export function CTASection({ title, description, ctaText, ctaLink }: CTASectionProps) {
  return (
    <section className="py-16">
      <div className="bg-glass border border-border-subtle rounded-2xl p-12 text-center backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-text-primary mb-4 gradient-text">{title}</h2>
        <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">{description}</p>
        <a
          href={ctaLink}
          className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-neon-blue/20"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}
