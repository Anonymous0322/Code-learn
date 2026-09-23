'use client';

import { motion, type AnimationProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neon-dark-950';

  const variants = {
    primary: 'bg-gradient-to-r from-neon-blue to-neon-cyan text-neon-dark-950 shadow-lg shadow-neon-blue/30 hover:shadow-neon-blue/50 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-neon-blue/50 hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border-2 border-neon-blue text-neon-blue hover:bg-neon-blue/10 hover:shadow-lg hover:shadow-neon-blue/20 hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5 active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-neon-red to-pink-600 text-white shadow-lg shadow-neon-red/30 hover:shadow-neon-red/50 hover:scale-[1.02] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
