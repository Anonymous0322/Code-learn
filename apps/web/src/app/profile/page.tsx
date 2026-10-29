'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useLearningProgressStore } from '@/store/learningProgressStore';
import { useI18n } from '@/components/providers';

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function ProfilePage() {
  const { t, language } = useI18n();
  const user = useAuthStore(state => state.currentUser);
  const initialized = useAuthStore(state => state.initialized);
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);
  const completedLessonIds = useLearningProgressStore(state => state.completedLessonIds);
  const activeDays = useLearningProgressStore(state => state.activeDays);
  const progressLoading = useLearningProgressStore(state => state.loading);
  const completedDays = useMemo(() => new Set(activeDays), [activeDays]);
  const totalLessons = courses.reduce((count, course) => count + (course.levels?.length || 0), 0);
  const completedCount = courses.reduce((count, course) => count + (course.levels || []).filter(level => completedLessonIds.includes(`${course.id}:${level.id}`)).length, 0);
  const inProgressCourses = courses.filter(course => {
    const count = (course.levels || []).filter(level => completedLessonIds.includes(`${course.id}:${level.id}`)).length;
    return count > 0 && count < (course.levels?.length || 0);
  }).length;

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return { key: dateKey(date), date, active: completedDays.has(dateKey(date)) };
  });
  const heatmap = Array.from({ length: 84 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (83 - index));
    const key = dateKey(date);
    return { key, date, active: completedDays.has(key) };
  });
  const streak = (() => {
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!completedDays.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let count = 0;
    while (completedDays.has(dateKey(cursor))) { count += 1; cursor.setDate(cursor.getDate() - 1); }
    return count;
  })();
  const dateLocale = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';

  if (!initialized && !user) return <main className="mx-auto max-w-5xl px-5 py-16 text-slate-400">{t('loadingProfile')}</main>;
  if (!user) return <main className="mx-auto max-w-4xl px-5 py-16"><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center"><h1 className="text-2xl font-semibold text-white">{t('signInToViewProfile')}</h1><p className="mt-2 text-slate-400">{t('signInToViewProfile')}</p><Link href="/auth/login" className="mt-5 inline-flex rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-white">{t('login')}</Link></div></main>;

  const since = new Date(user.createdAt);
  const dateLabel = Number.isNaN(since.getTime()) ? user.createdAt : since.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });
  const role = user.role === 'creator' ? t('creatorRole') : user.role === 'admin' ? t('adminPanel') : t('learnerRole');
  const stats = [
    { label: 'Yakunlangan darslar', value: completedCount, note: `/${totalLessons} dars` },
    { label: 'Faol yo‘nalishlar', value: inProgressCourses, note: 'kurs' },
    { label: 'Ketma-ket faol kunlar', value: streak, note: 'kun' },
    { label: 'Jami kirilgan kunlar', value: activeDays.length, note: 'kun' },
  ];

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#142044] via-[#0d1428] to-[#11102a] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-neon-blue/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple font-[Space_Grotesk] text-3xl font-bold text-white shadow-xl shadow-neon-blue/20">{user.avatar ? <img src={user.avatar} alt={t('profile')} className="h-full w-full object-cover" /> : user.name.trim().charAt(0).toUpperCase()}</div>
        <div className="min-w-0"><p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">{t('profileHeading')}</p><h1 className="mt-1 truncate font-[Space_Grotesk] text-3xl font-semibold text-white">{user.name}</h1><p className="mt-1 truncate text-sm text-slate-400">{user.email}</p></div>
        <span className="sm:ml-auto rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs capitalize text-slate-300">{role}</span>
      </div>
      <div className="relative mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => <article key={stat.label} className="rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5"><p className="text-xs text-slate-400">{stat.label}</p><div className="mt-2 flex items-baseline gap-2"><span className="font-[Space_Grotesk] text-3xl font-semibold text-white">{progressLoading ? '—' : stat.value}</span><span className="text-xs text-slate-500">{stat.note}</span></div><div className={`mt-3 h-1 rounded-full ${index === 0 ? 'bg-neon-cyan' : index === 1 ? 'bg-neon-purple' : index === 2 ? 'bg-emerald-400' : 'bg-blue-400'}`} /></article>)}
      </div>
    </section>

    <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-[Space_Grotesk] text-xl font-semibold text-white">O‘quv faolligi</h2><p className="mt-1 text-xs text-slate-400">Oxirgi 12 haftadagi kirish va dars yakunlash kunlari</p></div><span className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-xs text-neon-cyan">{activeDays.length} faol kun</span></div>
        <div className="mt-6 grid grid-cols-7 gap-2" role="img" aria-label="So‘nggi yetti kunlik faollik grafigi">
          {week.map(day => <div key={day.key} className="flex flex-col items-center gap-2"><div className="flex h-28 w-full items-end rounded-lg bg-white/[0.035] p-1"><div title={`${day.date.toLocaleDateString(dateLocale)}${day.active ? ' · faol' : ''}`} className={`w-full rounded-md transition-all ${day.active ? 'h-full bg-gradient-to-t from-neon-blue to-neon-cyan shadow-lg shadow-neon-blue/20' : 'h-1/5 bg-white/10'}`} /></div><span className="text-[10px] text-slate-500">{day.date.toLocaleDateString(dateLocale, { weekday: 'short' })}</span></div>)}
        </div>
        <div className="mt-7 flex items-center justify-between"><p className="text-xs text-slate-400">Kunlik faollik kalendari</p><div className="flex items-center gap-1 text-[10px] text-slate-500"><span>Kam</span>{[0, 1, 2, 3].map(level => <span key={level} className={`h-3 w-3 rounded-sm ${level === 0 ? 'bg-white/10' : level === 1 ? 'bg-neon-cyan/30' : level === 2 ? 'bg-neon-cyan/60' : 'bg-neon-cyan'}`} />)}<span>Ko‘p</span></div></div>
        <div className="mt-3 grid grid-flow-col grid-rows-7 gap-1" role="img" aria-label="So‘nggi 84 kunlik faollik kalendari">
          {heatmap.map(day => <span key={day.key} title={`${day.date.toLocaleDateString(dateLocale)}${day.active ? ' · faol' : ''}`} className={`aspect-square w-full rounded-[3px] ${day.active ? 'bg-neon-cyan shadow-sm shadow-neon-cyan/30' : 'bg-white/[0.07]'}`} />)}
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <h2 className="font-[Space_Grotesk] text-xl font-semibold text-white">O‘rganayotgan kurslar</h2>
        <div className="mt-5 space-y-3">
          {courses.filter(course => completedLessonIds.some(id => id.startsWith(`${course.id}:`))).map(course => {
            const count = (course.levels || []).filter(level => completedLessonIds.includes(`${course.id}:${level.id}`)).length;
            const percent = course.levels?.length ? Math.round(count * 100 / course.levels.length) : 0;
            return <Link key={course.id} href={`/courses/${course.slug}`} className="block rounded-xl border border-white/10 p-4 hover:border-neon-cyan/30"><div className="flex justify-between gap-3"><span className="text-sm font-medium text-white">{course.title}</span><span className="text-xs text-slate-400">{percent}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-[11px] text-slate-500">{count} / {course.levels?.length || 0} dars</p></Link>;
          })}
          {!courses.some(course => completedLessonIds.some(id => id.startsWith(`${course.id}:`))) && <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-slate-400">Hali yakunlangan dars yo‘q. Kursni tanlab birinchi videoni boshlang.<Link href="/courses" className="mt-3 block text-neon-cyan">Kurslarni ko‘rish →</Link></div>}
        </div>
      </article>
    </section>

    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-6"><h2 className="text-lg font-semibold text-white">{t('accountDetails')}</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs text-slate-500">{t('fullNameLabel')}</dt><dd className="mt-1 text-sm text-slate-200">{user.name}</dd></div><div><dt className="text-xs text-slate-500">{t('emailLabel')}</dt><dd className="mt-1 break-all text-sm text-slate-200">{user.email}</dd></div><div><dt className="text-xs text-slate-500">{t('joinedDate')}</dt><dd className="mt-1 text-sm text-slate-200">{dateLabel}</dd></div><div><dt className="text-xs text-slate-500">{t('accountStatus')}</dt><dd className="mt-1 text-sm text-emerald-300">{t('activeStatus')}</dd></div></dl></section>
  </main>;
}
