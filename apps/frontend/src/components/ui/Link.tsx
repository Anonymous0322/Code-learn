import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: 'default' | 'neon';
  className?: string;
}

export function Link({ children, variant = 'default', className, ...props }: LinkProps) {
  return (
    <motion.a
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        variant === 'neon'
          ? 'text-neon-blue hover:text-neon-cyan transition-colors duration-300'
          : 'text-gray-300 hover:text-white transition-colors duration-300',
        className,
      )}
      {...props}
    >
      {children}
    </motion.a>
  );
}
