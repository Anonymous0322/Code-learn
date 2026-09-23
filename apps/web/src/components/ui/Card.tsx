import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export function Card({ children, className, hover = false, padding = true }: CardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 300 }}
      whileHover={hover ? { scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)' } : {}}
      className={clsx(
        'bg-glass border border-border-subtle rounded-xl backdrop-blur-sm',
        hover && 'glass-hover',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
