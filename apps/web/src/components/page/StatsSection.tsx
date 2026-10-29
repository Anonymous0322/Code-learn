interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  statusLabel?: string;
  statusError?: string;
}

function StatIcon({ name }: { name: string }) {
  const className = 'h-6 w-6';
  if (name === 'lessons') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 4.5h11a2 2 0 0 1 2 2V20H7a2 2 0 0 0-2 2z" /><path d="M5 4.5v17M8.5 8h6M8.5 11.5h6M8.5 15h4" /></svg>;
  if (name === 'exercises') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m14.5 5.5 4 4M4 20l2.2-6.4L16.8 3a2 2 0 0 1 2.8 2.8L9 16.2z" /><path d="M4 20h6" /></svg>;
  if (name === 'learners') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2.2" /><path d="M3.5 19c.5-3.4 2.3-5 5.5-5s5 1.6 5.5 5M14.5 15.2c2.8-.4 4.7.8 5.2 3.8" /></svg>;
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 9h8M8 13h5M8 16h3" /><path d="m15.5 15 1.2 1.2 2.3-2.5" /></svg>;
}

export function StatsSection({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="stats-card group bg-glass border border-border-subtle rounded-xl p-6 text-center backdrop-blur-sm glass-hover"
          style={{ animation: `fadeIn 400ms ease-out ${i * 100}ms both` }}
        >
          <div className="stats-icon mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neon-blue/25 bg-neon-blue/10 text-neon-cyan"><StatIcon name={stat.icon} /></div>
          <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
          <div className="text-sm text-text-secondary">{stat.label}</div>
          {stat.statusLabel && <div className={`mt-2 text-[10px] ${stat.statusError ? 'text-amber-300' : 'text-emerald-300'}`} role={stat.statusError ? 'status' : undefined}>
            {!stat.statusError && <span aria-hidden="true" className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" />}
            {stat.statusError || stat.statusLabel}
          </div>}
        </div>
      ))}
    </div>
  );
}
