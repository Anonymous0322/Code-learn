interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

export function StatsSection({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-glass border border-border-subtle rounded-xl p-6 text-center backdrop-blur-sm glass-hover"
          style={{ animation: `fadeIn 400ms ease-out ${i * 100}ms both` }}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
          <div className="text-sm text-text-secondary">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
