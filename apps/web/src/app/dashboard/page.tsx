'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useLearningProgressStore } from '@/store/learningProgressStore';
import { useLearningExtrasStore } from '@/store/learningExtrasStore';
import { useI18n } from '@/components/providers';

export default function DashboardPage() {
  const { tr, language } = useI18n();
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
        {user ? `${tr('Xush kelibsiz', 'Добро пожаловать', 'Welcome')}, ${user.name}` : tr('O‘quvchi paneli', 'Панель обучения', 'Learning dashboard')}
      </h1>
      <p className="mt-2 text-sm text-slate-400">{tr('Kurslar va darslar bazadan jonli yangilanadi.', 'Курсы и уроки обновляются из базы данных.', 'Courses and lessons update live from the database.')}</p>
      {user && <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/study-plan" className="rounded-lg border border-neon-cyan/25 px-3 py-2 text-xs font-semibold text-neon-cyan hover:bg-neon-cyan/5">{tr('Haftalik o‘quv reja', 'План обучения на неделю', 'Weekly study plan')} →</Link>
        <Link href="/portfolio" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-white/25">{tr('Mening portfolioim', 'Моё портфолио', 'My portfolio')} →</Link>
      </div>}

      {nextLesson && <section className="mt-6 rounded-2xl border border-neon-cyan/20 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-neon-cyan">{user ? tr('Keyingi qadam', 'Следующий шаг', 'Next step') : tr('Boshlash uchun tavsiya', 'Рекомендация для начала', 'Recommended next step')}</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{nextLesson.level.translations?.[language]?.title || nextLesson.level.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{nextLesson.course.translations?.[language]?.title || nextLesson.course.title} · {nextLesson.level.translations?.[language]?.description || nextLesson.level.description}</p>
            <p className="mt-2 text-xs text-slate-400">{nextLesson.done} / {nextLesson.total} {tr('ta dars yakunlangan', 'уроков завершено', 'lessons completed')}</p>
          </div>
          <Link href={`/learn/${nextLesson.course.slug}/${nextLesson.level.slug || nextLesson.level.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="inline-flex shrink-0 justify-center rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan">
            {tr('O‘qishni davom ettirish', 'Продолжить обучение', 'Continue learning')} →
          </Link>
        </div>
      </section>}

      {savedItems.length > 0 && <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[Space_Grotesk] text-lg font-semibold text-white">{tr('Saqlangan darslar', 'Сохранённые уроки', 'Saved lessons')}</h2>
          <Link href="/courses" className="text-xs text-neon-cyan">{tr('Kurslarga o‘tish', 'К курсам', 'Go to courses')} →</Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {savedItems.map(item => {
            const course = courses.find(current => current.id === item.courseId);
            const level = course?.levels?.find(current => current.id === item.lessonId);
            if (!course || !level) return null;
            const slug = level.slug || level.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            return <Link key={`${item.courseId}-${item.lessonId}`} href={`/learn/${course.slug}/${slug}`} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:border-neon-cyan/30">{level.translations?.[language]?.title || level.title} <span className="text-xs text-slate-500">· {course.translations?.[language]?.title || course.title}</span></Link>;
          })}
        </div>
      </section>}

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[Space_Grotesk] text-xl font-semibold text-white">{tr('Mavjud kurslar', 'Доступные курсы', 'Available courses')}</h2>
          <Link href="/courses" className="text-sm text-neon-cyan">{tr('Barcha kurslar', 'Все курсы', 'All courses')}</Link>
        </div>
        {!initialized ? <p className="text-sm text-slate-400">{tr('Kurslar yuklanmoqda...', 'Загрузка курсов...', 'Loading courses...')}</p> : courses.length === 0 ? (
          <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400">{tr('Hozircha faol kurs yo‘q.', 'Активных курсов пока нет.', 'No active courses yet.')}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="rounded-xl border border-white/10 bg-white/[0.035] p-5 text-white hover:border-neon-cyan/35">
                <span className="font-semibold">{course.translations?.[language]?.title || course.title}</span>
                <p className="mt-2 text-sm text-slate-400">{course.levels?.length || 0} {tr('ta dars', 'уроков', 'lessons')}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
