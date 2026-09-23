import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface FeatureSectionProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureSection({ icon, title, description }: FeatureSectionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-glass border border-border-subtle rounded-xl p-6 backdrop-blur-sm glass-hover"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </motion.div>
  );
}
