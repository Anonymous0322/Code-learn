import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  hover?: boolean;
  glow?: boolean;
  children: ReactNode;
  className?: string;
}

export function Card({ hover = true, glow = false, className, children, ...props }: CardProps) {
  return (
    <motion.div
      {...(hover && { whileHover: { y: -4, transition: { duration: 0.2 } } })}
      {...(hover && { whileTap: { scale: 0.98 } })}
      className={cn(
        'glass-card',
        glow && 'neon-glow',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface GlassCardProps extends HTMLMotionProps<'div'> {
  hover?: boolean;
  children: ReactNode;
  className?: string;
}

export function GlassCard({ hover = true, className, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      {...(hover && { whileHover: { y: -4 } })}
      className={cn('glass-card', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
