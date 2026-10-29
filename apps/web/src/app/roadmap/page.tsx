'use client';

import Link from 'next/link';
import { useI18n } from '@/components/providers';
import { useCourseStore } from '@/store/courseStore';

export default function RoadmapPage() {
  const { language } = useI18n();
  const initialized = useCourseStore(state => state.initialized);
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);
  const locale = language as 'en' | 'ru' | 'uz';
  const labels = ({
    en: { title: 'Learning paths', loading: 'Loading courses...', empty: 'No active learning paths yet.', lessons: 'lessons', open: 'Open course' },
    ru: { title: 'Маршруты обучения', loading: 'Загрузка курсов...', empty: 'Активных маршрутов пока нет.', lessons: 'уроков', open: 'Открыть курс' },
    uz: { title: 'O‘quv yo‘nalishlari', loading: 'Kurslar yuklanmoqda...', empty: 'Hozircha faol yo‘nalish yo‘q.', lessons: 'ta dars', open: 'Kursni ochish' },
  }[locale] || {
    title: 'Learning paths', loading: 'Loading courses...', empty: 'No active learning paths yet.', lessons: 'lessons', open: 'Open course',
  });

  return <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
    <h1 className="font-[Space_Grotesk] text-4xl font-semibold text-white">{labels.title}</h1>
    {!initialized ? <p className="mt-6 text-slate-400">{labels.loading}</p> : courses.length === 0 ? <p className="mt-6 text-slate-400">{labels.empty}</p> :
      <div className="mt-8 grid gap-4 sm:grid-cols-2">{courses.map(course => <article key={course.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
        <h2 className="text-xl font-semibold text-white">{course.title}</h2>
        <p className="mt-2 text-sm text-slate-400">{course.description}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-slate-400"><span>{course.levels?.length || 0} {labels.lessons}</span><Link href={`/courses/${course.slug}`} className="text-neon-cyan">{labels.open} →</Link></div>
      </article>)}</div>}
  </main>;
}
