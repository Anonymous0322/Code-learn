interface LanguageCardsProps {
  languages: { label: string; desc: string; icon: string }[];
}

export function LanguageCards({ languages }: LanguageCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {languages.map((lang) => (
        <a
          key={lang.label}
          href={`/courses/${lang.label.toLowerCase()}`}
          className="bg-glass border border-border-subtle rounded-xl p-6 hover:border-neon-blue/30 hover:shadow-lg hover:shadow-neon-blue/10 transition-all duration-300 group block"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{lang.icon}</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">{lang.label}</h3>
          <p className="text-sm text-text-secondary">{lang.desc}</p>
        </a>
      ))}
    </div>
  );
}
