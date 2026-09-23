import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

export function StatsSection({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 100 }}
          className="bg-glass border border-border-subtle rounded-xl p-6 text-center backdrop-blur-sm glass-hover"
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
          <div className="text-sm text-text-secondary">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
