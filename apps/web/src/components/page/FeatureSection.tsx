interface FeatureSectionProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureIcon({ name }: { name: string }) {
  const common = 'h-6 w-6';
  if (name === 'practice') return <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m8 8 3-3 3 3-3 3zM5 16h14M7 20h10M5 12h14" /><path d="M17 5h2v4h-2z" /></svg>;
  if (name === 'progress') return <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19V5M4 19h16" /><path d="m7 15 3-4 3 2 5-7" /><circle cx="18" cy="6" r="1.5" /></svg>;
  if (name === 'language') return <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="8.5" /><path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.2-3.3-8.5S9.8 5.9 12 3.5Z" /></svg>;
  return <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 4.5h9.5a2 2 0 0 1 2 2V19H7.5A1.5 1.5 0 0 0 6 20.5z" /><path d="M6 4.5v16M6 20.5h11.5M10 8h5M10 11h5" /><path d="m18 9 1.3 1.3L22 7.6" /></svg>;
}

export function FeatureSection({ icon, title, description }: FeatureSectionProps) {
  return (
    <div className="feature-card group bg-glass border border-border-subtle rounded-xl p-6 backdrop-blur-sm glass-hover">
      <div className="feature-icon mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-neon-purple/30 bg-neon-purple/10 text-neon-cyan"><FeatureIcon name={icon} /></div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}
