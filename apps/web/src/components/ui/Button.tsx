'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({ children, variant = 'primary', size = 'md', className, onClick, disabled, type = 'button' }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-blue/50';

  const variants = {
    primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90 shadow-lg shadow-neon-blue/20',
    secondary: 'bg-glass border border-border-subtle text-text-primary hover:border-neon-blue/30 hover:text-neon-blue',
    ghost: 'text-text-secondary hover:text-neon-blue hover:bg-glass',
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
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}
