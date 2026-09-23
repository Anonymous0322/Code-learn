'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';
import { Lesson } from '@/types/lesson';
import { Course } from '@/types/course';

interface LessonPageProps {
  lesson: Lesson;
  course: Course;
}

export function LessonPage({ lesson, course }: LessonPageProps) {
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'summary'>('theory');

  const navigation = [
    { slug: 'what-is-the-web', title: 'What is the Web?' },
    { slug: 'what-is-html', title: 'What is HTML?' },
    { slug: 'html-structure', title: 'HTML Structure and Tags' },
    { slug: 'text-formatting', title: 'Text Formatting' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lesson Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-glass border border-border-subtle rounded-xl p-4 backdrop-blur-sm">
            <h3 className="font-semibold text-text-primary mb-4">Course Path</h3>
            <nav className="space-y-1">
              {navigation.map((lesson, idx) => {
                const isActive = lesson.slug === lesson.slug;
                return (
                  <Link
                    key={lesson.slug}
                    href={`/learn/${course.slug}/${lesson.slug}`}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                      isActive
                        ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                        : 'text-text-secondary hover:text-text-primary hover:bg-glass',
                    )}
                  >
                    <span className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                      isActive ? 'bg-neon-blue text-white' : 'bg-bg-secondary text-text-muted border border-border-subtle',
                    )}>
                      {idx + 1}
                    </span>
                    {lesson.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Center: Lesson Content */}
        <div className="lg:col-span-2">
          <div className="bg-glass border border-border-subtle rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-medium">
                {lesson.difficulty}
              </span>
              <span className="text-sm text-text-muted">{lesson.estimatedTime}</span>
            </div>

            <h1 className="text-2xl font-bold text-text-primary mb-6">{lesson.title}</h1>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 border-b border-border-subtle">
              {(['theory', 'code', 'summary'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'px-4 py-2 text-sm font-medium capitalize transition-all duration-200',
                    activeTab === tab
                      ? 'text-neon-blue border-b-2 border-neon-blue'
                      : 'text-text-muted hover:text-text-secondary',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'theory' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-text-secondary leading-relaxed">
                    {lesson.theory || 'Theory content coming soon. This lesson covers the fundamental concepts you need to understand.'}
                  </p>
                  {lesson.tips && (
                    <div className="mt-4 p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-lg">
                      <h4 className="font-semibold text-neon-blue mb-2">💡 Tips</h4>
                      <p className="text-sm text-text-secondary">{lesson.tips}</p>
                    </div>
                  )}
                  {lesson.commonMistakes && (
                    <div className="mt-4 p-4 bg-neon-pink/5 border border-neon-pink/20 rounded-lg">
                      <h4 className="font-semibold text-neon-pink mb-2">⚠️ Common Mistakes</h4>
                      <p className="text-sm text-text-secondary">{lesson.commonMistakes}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'code' && (
                <div className="bg-bg-primary rounded-lg border border-border-subtle p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-text-primary whitespace-pre">
                    {lesson.exampleCode || '// Code example will appear here'}
                  </pre>
                  {lesson.exampleExplanation && (
                    <div className="mt-4 p-3 bg-glass rounded-lg">
                      <p className="text-text-secondary text-xs">{lesson.exampleExplanation}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="p-4 bg-glass rounded-lg border border-border-subtle">
                  <h3 className="font-semibold text-text-primary mb-2">Summary</h3>
                  <p className="text-text-secondary">
                    {lesson.summary || 'Key takeaways from this lesson will appear here.'}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border-subtle">
              <button className="px-6 py-3 rounded-xl border border-border-subtle text-text-secondary hover:border-neon-blue/30 hover:text-neon-blue transition-all">
                ← Previous Lesson
              </button>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity">
                Next Lesson →
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick Info */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="bg-glass border border-border-subtle rounded-xl p-4 backdrop-blur-sm">
              <h4 className="font-semibold text-text-primary mb-3">Lesson Progress</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Progress</span>
                <span className="text-sm text-neon-blue font-medium">33%</span>
              </div>
              <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full" />
              </div>
            </div>

            <div className="bg-glass border border-border-subtle rounded-xl p-4 backdrop-blur-sm">
              <h4 className="font-semibold text-text-primary mb-3">Quick Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Difficulty</span>
                  <span className="text-text-primary">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Time</span>
                  <span className="text-text-primary">{lesson.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Language</span>
                  <span className="text-text-primary capitalize">{course.languageCode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
