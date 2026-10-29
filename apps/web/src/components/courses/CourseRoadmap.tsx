'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useLearningProgressStore } from '@/store/learningProgressStore';
import { useI18n } from '@/components/providers';

interface CourseRoadmapProps { course: Course; progress: unknown | null }

const toSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function CourseRoadmap({ course }: CourseRoadmapProps) {
  const { language, tr } = useI18n();
  const userId = useAuthStore(state => state.currentUser?.id || null);
  const completedLessonIds = useLearningProgressStore(state => state.completedLessonIds);
  const initializeProgress = useLearningProgressStore(state => state.initialize);
  useEffect(() => { initializeProgress(userId); }, [initializeProgress, userId]);

  const levels = [...(course.levels || [])].sort((a: any, b: any) => a.orderIndex - b.orderIndex);
  const courseTitle = course.translations?.[language]?.title || course.title;
  const courseDescription = course.translations?.[language]?.description || course.description;
  const completedCount = levels.filter((level: any) => completedLessonIds.includes(`${course.id}:${level.id}`)).length;
  const percent = levels.length ? Math.round(completedCount * 100 / levels.length) : 0;
  const nextLevel = levels.find((level: any) => !completedLessonIds.includes(`${course.id}:${level.id}`));
  const startLevel = nextLevel || levels[0];
  const startHref = startLevel ? `/learn/${course.slug}/${startLevel.slug || toSlug(startLevel.title)}` : null;
  return <main className="animate-fade-in">
    <header className="mb-8 rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neon-blue/10 text-xl font-bold uppercase text-neon-cyan">{course.languageCode.slice(0, 2)}</div>
        <div><h1 className="text-3xl font-bold text-white">{courseTitle}</h1><p className="mt-1 text-sm text-slate-400">{courseDescription}</p></div>
      </div>
      <div className="mt-7 flex items-center justify-between text-sm text-slate-400"><span>{completedCount} / {levels.length} {tr('dars yakunlandi', 'уроков завершено', 'lessons completed')}</span><span>{percent}%</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all" style={{ width: `${percent}%` }} /></div>
      {startHref && <Link href={startHref} className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-semibold text-white">{completedCount ? tr('Davom etish', 'Продолжить', 'Continue learning') : tr('Birinchi darsni boshlash', 'Начать первый урок', 'Start the first lesson')} →</Link>}
    </header>

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {levels.map((level: any, index: number) => {
        const completed = completedLessonIds.includes(`${course.id}:${level.id}`);
        const unlocked = index === 0 || completedLessonIds.includes(`${course.id}:${levels[index - 1].id}`);
        const href = `/learn/${course.slug}/${level.slug || toSlug(level.title)}`;
        return <article key={level.id} className={`rounded-xl border bg-white/[0.035] p-5 ${completed ? 'border-emerald-400/30' : unlocked ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
          <div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${completed ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'}`}>{completed ? '✓' : index + 1}</span><h2 className="font-semibold text-white">{level.translations?.[language]?.title || level.title}</h2></div>
          <p className="mt-3 min-h-10 text-sm text-slate-400">{level.translations?.[language]?.description || level.description}</p>
          {unlocked ? <Link href={href} className="mt-4 inline-block text-sm text-neon-cyan hover:underline">{tr('Darsni ochish', 'Открыть урок', 'Open lesson')} →</Link> : <p className="mt-4 text-xs text-slate-500">{tr('Oldingi darsni yakunlang', 'Завершите предыдущий урок', 'Complete the previous lesson')} · 🔒</p>}
        </article>;
      })}
      {levels.length === 0 && <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400">{tr('Kursga hali dars qo‘shilmagan.', 'В курс ещё не добавлены уроки.', 'No lessons have been added to this course yet.')}</p>}
    </section>
  </main>;
}
