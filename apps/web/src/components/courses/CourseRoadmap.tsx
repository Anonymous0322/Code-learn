'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/types';

interface CourseRoadmapProps {
  course: Course;
  progress: any | null;
}

export function CourseRoadmap({ course, progress }: CourseRoadmapProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const progressPercent = progress ? Math.round((progress.completedLessons / progress.totalLessons) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-3xl">
            {course.languageCode === 'html' && '🌐'}
            {course.languageCode === 'css' && '🎨'}
            {course.languageCode === 'javascript' && '⚡'}
            {course.languageCode === 'python' && '🐍'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{course.title}</h1>
            <p className="text-text-secondary mt-1">{course.description}</p>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-full h-3 overflow-hidden border border-border-subtle">
          <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full" style={{ width: `${progressPercent}%`, transition: 'width 800ms ease-out' }} />
        </div>
        <p className="text-sm text-text-muted mt-2">{progressPercent}% complete</p>

        <div className="flex gap-3 mt-6">
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity">
            {progressPercent > 0 ? 'Continue Learning' : 'Start Learning'}
          </button>
          <button className="px-6 py-3 rounded-xl border border-border-subtle text-text-secondary hover:border-neon-blue/30 hover:text-neon-blue transition-all">
            Roadmap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(course.levels || []).map((level: any, levelIdx: number) => {
          const isCompleted = progress?.completedLevels?.includes(levelIdx);
          const isCurrent = selectedLevel === levelIdx;

          return (
            <div
              key={level.id}
              onClick={() => setSelectedLevel(isCurrent ? null : levelIdx)}
              className={`bg-glass border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                isCompleted ? 'border-neon-green/30 bg-neon-green/5' :
                isCurrent ? 'border-neon-blue/50 bg-neon-blue/5' :
                'border-border-subtle hover:border-neon-blue/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCompleted ? 'bg-neon-green text-white' : 'bg-bg-secondary text-text-muted border border-border-subtle'
                }`}>
                  {isCompleted ? '✓' : levelIdx + 1}
                </div>
                <h3 className="font-semibold text-text-primary">{level.title}</h3>
              </div>
              <p className="text-sm text-text-secondary">{level.description}</p>
              {level.lessons && (
                <div className="mt-3 space-y-1">
                  {level.lessons.map((lesson: any) => (
                    <Link
                      key={lesson.id}
                      href={`/learn/${course.slug}/${lesson.slug}`}
                      className="block text-xs text-neon-blue hover:underline pl-11"
                    >
                      {lesson.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
