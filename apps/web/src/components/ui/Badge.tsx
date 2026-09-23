import clsx from 'clsx';

interface BadgeProps {
  text: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'pink';
  size?: 'sm' | 'md';
}

export function Badge({ text, color = 'blue', size = 'sm' }: BadgeProps) {
  const colors = {
    blue: 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30',
    green: 'bg-neon-green/20 text-neon-green border border-neon-green/30',
    yellow: 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30',
    purple: 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30',
    pink: 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30',
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-full font-medium border', colors[color], sizes[size])}>
      {text}
    </span>
  );
}
