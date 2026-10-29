'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useLearningProgressStore } from '@/store/learningProgressStore';
import { useLearningExtrasStore } from '@/store/learningExtrasStore';

export default function DashboardPage() {
  const user = useAuthStore(state => state.currentUser);
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);
  const initialized = useCourseStore(state => state.initialized);
  const completedLessonIds = useLearningProgressStore(state => state.completedLessonIds);
  const progressUserId = useLearningProgressStore(state => state.userId);
  const initializeProgress = useLearningProgressStore(state => state.initialize);
  useEffect(() => { initializeProgress(user?.id || null); }, [initializeProgress, user?.id]);
  const initializeExtras = useLearningExtrasStore(state => state.initialize);
  const savedLessons = useLearningExtrasStore(state => state.savedLessons);
  const extrasUserId = useLearningExtrasStore(state => state.userId);
  useEffect(() => { initializeExtras(user?.id || null); }, [initializeExtras, user?.id]);
  const savedItems = user?.id === extrasUserId ? Object.values(savedLessons).filter(item => item.saved) : [];
  const currentUserCompletedLessons = user?.id === progressUserId ? completedLessonIds : [];
  const nextLesson = useMemo(() => {
    for (const course of courses) {
      const levels = [...(course.levels || [])].sort((a, b) => a.orderIndex - b.orderIndex);
      const level = levels.find(item => !currentUserCompletedLessons.includes(`${course.id}:${item.id}`));
      if (level) return { course, level, done: levels.filter(item => currentUserCompletedLessons.includes(`${course.id}:${item.id}`)).length, total: levels.length };
    }
    return null;
  }, [currentUserCompletedLessons, courses]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">CodeLearn</p>
      <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white">
        {user ? `Xush kelibsiz, ${user.name}` : 'O‘quvchi paneli'}
      </h1>
      <p className="mt-2 text-sm text-slate-400">Kurslar va darslar bazadan jonli yangilanadi.</p>
      {user && <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/study-plan" className="rounded-lg border border-neon-cyan/25 px-3 py-2 text-xs font-semibold text-neon-cyan hover:bg-neon-cyan/5">Haftalik o‘quv reja →</Link>
        <Link href="/portfolio" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-white/25">Mening portfolioim →</Link>
      </div>}

      {nextLesson && <section className="mt-6 rounded-2xl border border-neon-cyan/20 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-neon-cyan">{user ? 'Keyingi qadam' : 'Boshlash uchun tavsiya'}</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{nextLesson.level.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{nextLesson.course.title} · {nextLesson.level.description}</p>
            <p className="mt-2 text-xs text-slate-400">{nextLesson.done} / {nextLesson.total} ta dars yakunlangan</p>
          </div>
          <Link href={`/learn/${nextLesson.course.slug}/${nextLesson.level.slug || nextLesson.level.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="inline-flex shrink-0 justify-center rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan">
            O‘qishni davom ettirish →
          </Link>
        </div>
      </section>}

      {savedItems.length > 0 && <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[Space_Grotesk] text-lg font-semibold text-white">Saqlangan darslar</h2>
          <Link href="/courses" className="text-xs text-neon-cyan">Kurslarga o‘tish →</Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {savedItems.map(item => {
            const course = courses.find(current => current.id === item.courseId);
            const level = course?.levels?.find(current => current.id === item.lessonId);
            if (!course || !level) return null;
            const slug = level.slug || level.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            return <Link key={`${item.courseId}-${item.lessonId}`} href={`/learn/${course.slug}/${slug}`} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:border-neon-cyan/30">{level.title} <span className="text-xs text-slate-500">· {course.title}</span></Link>;
          })}
        </div>
      </section>}

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[Space_Grotesk] text-xl font-semibold text-white">Mavjud kurslar</h2>
          <Link href="/courses" className="text-sm text-neon-cyan">Barcha kurslar</Link>
        </div>
        {!initialized ? <p className="text-sm text-slate-400">Kurslar yuklanmoqda...</p> : courses.length === 0 ? (
          <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400">Hozircha faol kurs yo‘q.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="rounded-xl border border-white/10 bg-white/[0.035] p-5 text-white hover:border-neon-cyan/35">
                <span className="font-semibold">{course.title}</span>
                <p className="mt-2 text-sm text-slate-400">{course.levels?.length || 0} ta dars</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
