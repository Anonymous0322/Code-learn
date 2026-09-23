import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ count = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className || ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-glass border border-border-subtle rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg skeleton" />
            <div className="flex-1">
              <div className="h-4 w-32 skeleton mb-2" />
              <div className="h-3 w-24 skeleton" />
            </div>
          </div>
          <div className="h-3 w-full skeleton mb-2" />
          <div className="h-3 w-3/4 skeleton" />
        </div>
      ))}
    </div>
  );
}
