interface EmptyStateProps {
  title: string;
  description: string;
  action?: string;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] px-6 py-12 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-neon-cyan/25 bg-neon-cyan/10 text-xl text-neon-cyan">+</div><h2 className="mt-4 font-[Space_Grotesk] text-lg font-semibold text-white">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>{action && <button className="mt-5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-neon-cyan/40 hover:text-white">{action}</button>}</div>;
}
