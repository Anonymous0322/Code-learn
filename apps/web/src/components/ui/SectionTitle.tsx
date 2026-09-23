interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className }: SectionTitleProps) {
  return (
    <div className={`mb-12 ${className || ''}`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 gradient-text">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-text-secondary max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
