import { motion } from 'framer-motion';

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neon-dark-950">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-neon-blue"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1 rounded-xl border-2 border-transparent border-t-purple-500"
        />
      </div>
    </div>
  );
}
