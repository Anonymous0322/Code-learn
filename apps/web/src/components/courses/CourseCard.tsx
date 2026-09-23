'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColors = {
    beginner: 'bg-neon-green/20 text-neon-green',
    intermediate: 'bg-neon-yellow/20 text-neon-yellow',
    advanced: 'bg-neon-pink/20 text-neon-pink',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        'bg-glass border border-border-subtle rounded-xl overflow-hidden backdrop-blur-sm',
        'hover:border-neon-blue/30 transition-all duration-300 cursor-pointer',
        isHovered && 'shadow-lg shadow-neon-blue/10',
      )}
    >
      <Link href={`/courses/${course.slug}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-2xl">
              {course.languageCode === 'html' && '🌐'}
              {course.languageCode === 'css' && '🎨'}
              {course.languageCode === 'javascript' && '⚡'}
              {course.languageCode === 'python' && '🐍'}
            </div>
            <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', difficultyColors[course.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner)}>
              {course.difficulty}
            </span>
          </div>

          <h3 className="text-xl font-bold text-text-primary mb-2">{course.title}</h3>
          <p className="text-sm text-text-secondary line-clamp-2 mb-4">{course.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">{course.orderIndex + 1} levels</span>
            <span className="text-neon-blue text-sm font-medium">Explore →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
