'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { useI18n } from '@/components/providers';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t, language } = useI18n();
  const title = course.translations?.[language]?.title || course.title;
  const description = course.translations?.[language]?.description || course.description;

  const difficultyColors = {
    beginner: 'bg-neon-green/20 text-neon-green',
    intermediate: 'bg-neon-yellow/20 text-neon-yellow',
    advanced: 'bg-neon-pink/20 text-neon-pink',
  };

  const baseClasses = 'group bg-glass border border-border-subtle rounded-xl overflow-hidden backdrop-blur-sm hover:border-neon-blue/30 transition-all duration-300 cursor-pointer';
  const hoverClasses = isHovered ? ' shadow-lg shadow-neon-blue/10' : '';

  return (
    <div
      className={baseClasses + hoverClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/courses/${course.slug}`}>
        <div className="p-6">
          <div className="relative mb-5 flex items-center justify-center">
            <div className="course-logo flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-4">
              <img src={course.iconUrl || `/images/logos/${course.languageCode}.svg`} alt={`${title} logo`} className="h-full w-full object-contain" />
            </div>
            <span className={`absolute right-0 top-0 px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner}`}>
              {t(course.difficulty as 'beginner' | 'intermediate' | 'advanced')}
            </span>
          </div>

          <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
          <p className="text-sm text-text-secondary line-clamp-2 mb-4">{description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">{course.orderIndex + 1} {t('levels')}</span>
            <span className="text-neon-blue text-sm font-medium">{t('exploreAction')} →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
