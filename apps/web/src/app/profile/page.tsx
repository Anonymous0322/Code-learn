'use client';

import Link from 'next/link';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useLearningProgressStore } from '@/store/learningProgressStore';
import { useI18n } from '@/components/providers';
import { toModernUzbek } from '@/lib/utils';
import { AnimatedNumber } from '@/components/AnimatedNumber';

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function ProfilePage() {
  const { t, tr, language } = useI18n();
  const user = useAuthStore(state => state.currentUser);
  const updateAvatar = useAuthStore(state => state.updateAvatar);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarNotice, setAvatarNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const initialized = useAuthStore(state => state.initialized);
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);
  const completedLessonIds = useLearningProgressStore(state => state.completedLessonIds);
  const activeDays = useLearningProgressStore(state => state.activeDays);
  const progressLoading = useLearningProgressStore(state => state.loading);
  const completedDays = useMemo(() => new Set(activeDays), [activeDays]);
  const dateLocale = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';
  const formatLocalizedDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    const formatted = date.toLocaleDateString(dateLocale, options);
    return language === 'uz' ? toModernUzbek(formatted) : formatted;
  };
  const totalLessons = courses.reduce((count, course) => count + (course.levels?.length || 0), 0);
  const completedCount = courses.reduce((count, course) => count + (course.levels || []).filter(level => completedLessonIds.includes(`${course.id}:${level.id}`)).length, 0);
  const inProgressCourses = courses.filter(course => {
    const count = (course.levels || []).filter(level => completedLessonIds.includes(`${course.id}:${level.id}`)).length;
    return count > 0 && count < (course.levels?.length || 0);
  }).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weeklyActivity = Array.from({ length: 12 }, (_, weekIndex) => {
    const monday = new Date(currentWeekStart);
    monday.setDate(currentWeekStart.getDate() - (11 - weekIndex) * 7);
    const days = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + dayIndex);
      const key = dateKey(date);
      return { key, date, active: completedDays.has(key), future: date > today };
    });
    return {
      key: dateKey(monday),
      monday,
      activeCount: days.filter(day => day.active).length,
      days,
    };
  });
  const activeDaysLast30 = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    return completedDays.has(dateKey(date));
  }).filter(Boolean).length;
  const activeDaysThisWeek = weeklyActivity[weeklyActivity.length - 1].activeCount;
  const bestWeek = Math.max(...weeklyActivity.map(item => item.activeCount));
  const streak = (() => {
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!completedDays.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let count = 0;
    while (completedDays.has(dateKey(cursor))) { count += 1; cursor.setDate(cursor.getDate() - 1); }
    return count;
  })();
  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      setAvatarNotice({ text: tr('JPEG, PNG, WebP yoki AVIF rasm tanlang.', 'Выберите изображение JPEG, PNG, WebP или AVIF.', 'Choose a JPEG, PNG, WebP, or AVIF image.'), type: 'error' });
      return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setAvatarNotice({ text: tr('Rasm hajmi 5 MB dan oshmasligi kerak.', 'Размер изображения не должен превышать 5 МБ.', 'Image size must not exceed 5 MB.'), type: 'error' });
      return;
    }

    setAvatarUploading(true);
    setAvatarNotice(null);
    try {
      const result = await updateAvatar(file);
      setAvatarNotice({ text: result.success ? tr('Avatar muvaffaqiyatli yangilandi.', 'Аватар успешно обновлён.', 'Avatar updated successfully.') : result.message, type: result.success ? 'success' : 'error' });
    } catch (error) {
      console.error('Avatarni yangilashda xatolik.', error);
      setAvatarNotice({
        text: error instanceof Error ? error.message : tr('Avatarni yangilab bölmadi.', 'Не удалось обновить аватар.', 'Could not update the avatar.'),
        type: 'error',
      });
    } finally {
      setAvatarUploading(false);
    }
  };

  if (!initialized && !user) return <main className="mx-auto max-w-5xl px-5 py-16 text-slate-400">{t('loadingProfile')}</main>;
  if (!user) return <main className="mx-auto max-w-4xl px-5 py-16"><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center"><h1 className="text-2xl font-semibold text-white">{t('signInToViewProfile')}</h1><p className="mt-2 text-slate-400">{t('signInToViewProfile')}</p><Link href="/auth/login" className="mt-5 inline-flex rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-white">{t('login')}</Link></div></main>;

  const since = new Date(user.createdAt);
  const dateLabel = Number.isNaN(since.getTime()) ? user.createdAt : formatLocalizedDate(since, { year: 'numeric', month: 'long', day: 'numeric' });
  const role = user.role === 'creator' ? t('creatorRole') : user.role === 'admin' ? t('adminPanel') : t('learnerRole');
  const stats = [
    { label: tr('Yakunlangan darslar', 'Завершённые уроки', 'Completed lessons'), value: completedCount, note: `/${totalLessons} ${tr('dars', 'уроков', 'lessons')}` },
    { label: tr('Faol yönalişlar', 'Активные направления', 'Courses in progress'), value: inProgressCourses, note: tr('kurs', 'курс', 'courses') },
    { label: tr('Ketma-ket faol kunlar', 'Дней подряд', 'Current streak'), value: streak, note: tr('kun', 'дней', 'days') },
    { label: tr('Jami kirilgan kunlar', 'Всего активных дней', 'Total active days'), value: activeDays.length, note: tr('kun', 'дней', 'days') },
  ];

  return <main className="mx-auto max-w-6xl px-3 py-6 sm:px-8 sm:py-10">
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#142044] via-[#0d1428] to-[#11102a] p-4 sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-neon-blue/15 blur-3xl" />
      <div className="relative flex flex-wrap items-center gap-4 sm:flex-nowrap sm:gap-5">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            aria-label={tr('Avatar rasmi', 'Изображение аватара', 'Avatar image')}
            onChange={event => void handleAvatarChange(event)}
          />
          <button
            type="button"
            disabled={avatarUploading}
            onClick={() => avatarInputRef.current?.click()}
            aria-label={tr('Avatarni almashtirish', 'Изменить аватар', 'Change avatar')}
            title={tr('Rasm tanlash', 'Выбрать изображение', 'Choose an image')}
            className="group relative h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple font-[Space_Grotesk] text-2xl font-bold text-white shadow-xl shadow-neon-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1428] disabled:cursor-wait sm:h-20 sm:w-20 sm:text-3xl"
          >
            {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" /> : <span>{user.name.trim().charAt(0).toUpperCase()}</span>}
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/65 text-[9px] font-semibold leading-none text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 sm:text-[10px]">
              {avatarUploading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                  {tr('Rasm qo‘shish', 'Добавить фото', 'Add photo')}
                </>
              )}
            </span>
          </button>
          <span className="text-center text-[10px] text-slate-400">{tr('Avatarni o‘zgartirish', 'Изменить аватар', 'Change avatar')}</span>
          {avatarNotice && <span role="status" className={`max-w-40 text-center text-[10px] ${avatarNotice.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{avatarNotice.text}</span>}
        </div>
        <div className="min-w-0 flex-1"><p className="text-[10px] uppercase tracking-[0.16em] text-neon-cyan sm:text-xs sm:tracking-[0.2em]">{t('profileHeading')}</p><h1 className="mt-1 truncate font-[Space_Grotesk] text-xl font-semibold text-white sm:text-3xl">{user.name}</h1><p className="mt-1 max-w-full truncate text-xs text-slate-400 sm:text-sm">{user.email}</p></div>
        <span className="ml-auto rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] capitalize text-slate-300 sm:text-xs">{role}</span>
      </div>
      <div className="relative mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => <article key={stat.label} className="min-w-0 rounded-2xl border border-white/10 bg-black/15 p-3 sm:p-5"><p className="min-h-8 text-[10px] leading-4 text-slate-400 sm:min-h-0 sm:text-xs">{stat.label}</p><div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5"><span className="font-[Space_Grotesk] text-2xl font-semibold text-white sm:text-3xl">{progressLoading ? '—' : <AnimatedNumber value={stat.value} locale={dateLocale} />}</span><span className="text-[9px] text-slate-500 sm:text-xs">{stat.note}</span></div><div className={`mt-3 h-1 rounded-full ${index === 0 ? 'bg-neon-cyan' : index === 1 ? 'bg-neon-purple' : index === 2 ? 'bg-emerald-400' : 'bg-blue-400'}`} /></article>)}
      </div>
    </section>

    <section className="mt-6 space-y-5">
      <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-7">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-violet-500/[0.09] blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300">{tr('Shaxsiy tahlil', 'Личная аналитика', 'PERSONAL ANALYTICS')}</p>
              <h2 className="mt-2 font-[Space_Grotesk] text-2xl font-semibold text-white">{tr('Faollik markazi', 'Центр активности', 'Activity overview')}</h2>
              <p className="mt-1 text-sm text-slate-400">{tr('Öquv odatlaringiz qanday shakllanayotganini kuzating.', 'Следите за тем, как формируется ваша учебная привычка.', 'See how your learning habit is building over time.')}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-2 text-[10px] text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.8)]" />
              {tr('OXIRGI 12 HAFTA', 'ПОСЛЕДНИЕ 12 НЕДЕЛЬ', 'LAST 12 WEEKS')}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {[
              { label: tr('Oxirgi 30 kun', 'Последние 30 дней', 'Last 30 days'), value: activeDaysLast30, note: tr('faol kun', 'активных дней', 'active days'), tone: 'from-cyan-400/15 to-blue-500/[0.03]', accent: 'text-cyan-200', icon: '◷' },
              { label: tr('Shu hafta', 'Эта неделя', 'This week'), value: activeDaysThisWeek, note: `/ 7 ${tr('kun', 'дней', 'days')}`, tone: 'from-violet-400/15 to-purple-500/[0.03]', accent: 'text-violet-200', icon: '▥' },
              { label: tr('Eng faol hafta', 'Самая активная неделя', 'Best week'), value: bestWeek, note: tr('faol kun', 'активных дней', 'active days'), tone: 'from-emerald-400/15 to-teal-500/[0.03]', accent: 'text-emerald-200', icon: '↗' },
            ].map((metric, index) => (
              <article key={metric.label} style={{ animationDelay: `${index * 100}ms` }} className={`analytics-card-enter min-w-0 rounded-2xl border border-white/[0.07] bg-gradient-to-br ${metric.tone} p-3.5 sm:p-5 ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">{metric.label}</p>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-black/15 text-base ${metric.accent}`}>{metric.icon}</span>
                </div>
                <p className="mt-4 flex items-baseline gap-2 font-[Space_Grotesk]">
                  <span className="text-3xl font-semibold tracking-tight text-white"><AnimatedNumber value={metric.value} locale={dateLocale} /></span>
                  <span className="text-[10px] text-slate-500">{metric.note}</span>
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-5 xl:grid-cols-[1.5fr_0.85fr]">
            <article className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#101729]/80 p-3.5 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{tr('Haftalar bo‘yicha dinamika', 'Динамика по неделям', 'Weekly activity trend')}</h3>
                  <p className="mt-1 text-[10px] text-slate-500">{tr('Har bir ustun shu haftada saytga kirilgan kunlarni ko‘rsatadi.', 'Каждый столбец показывает дни посещения за неделю.', 'Bars show the number of days visited each week.')}</p>
                </div>
                <span className="rounded-lg border border-white/[0.07] bg-black/15 px-2.5 py-1.5 text-[9px] text-slate-400">{tr('KUN / HAFTA', 'ДНИ / НЕДЕЛЯ', 'DAYS / WEEK')}</span>
              </div>
              <div className="relative mt-5 h-44 px-0 pb-7 sm:mt-6 sm:h-48 sm:px-1" aria-label={tr('Oxirgi 12 haftadagi faollik dinamikasi', 'Динамика активности за последние 12 недель', 'Activity trend for the last 12 weeks')}>
                <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[calc(100%-28px)] flex-col justify-between">
                  {[7, 5, 3, 1].map(level => <div key={level} className="flex items-center gap-2"><span className="w-3 text-right text-[8px] tabular-nums text-slate-600">{level}</span><span className="h-px flex-1 border-t border-dashed border-white/[0.07]" /></div>)}
                </div>
                <div className="absolute inset-x-4 top-0 grid h-[calc(100%-28px)] grid-cols-12 items-end gap-1 sm:inset-x-5 sm:gap-2">
                  {weeklyActivity.map((activityWeek, index) => {
                    const height = Math.max(4, activityWeek.activeCount / 7 * 100);
                    const isCurrentWeek = index === weeklyActivity.length - 1;
                    return <div key={activityWeek.key} className="group relative flex h-full items-end justify-center">
                      <span className="pointer-events-none absolute -top-7 z-10 rounded-md border border-white/10 bg-[#171f32] px-2 py-1 text-[9px] text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">{activityWeek.activeCount} / 7</span>
                      <div
                        title={`${formatLocalizedDate(activityWeek.monday, { month: 'short', day: 'numeric' })} · ${activityWeek.activeCount} / 7`}
                        style={{ height: `${height}%`, animationDelay: `${index * 55}ms` }}
                        className={`analytics-bar-rise w-full max-w-8 rounded-t-lg transition-[filter] group-hover:brightness-125 ${isCurrentWeek ? 'bg-gradient-to-t from-violet-600 to-fuchsia-300 shadow-[0_0_16px_rgba(192,132,252,0.22)]' : activityWeek.activeCount ? 'bg-gradient-to-t from-blue-600 to-cyan-300' : 'bg-white/[0.08]'}`}
                      />
                    </div>;
                  })}
                </div>
                <div className="absolute inset-x-4 bottom-0 grid grid-cols-12 gap-1 sm:inset-x-5 sm:gap-2">
                  {weeklyActivity.map((activityWeek, index) => <span key={`label-${activityWeek.key}`} className={`truncate text-center text-[8px] tabular-nums ${index === weeklyActivity.length - 1 ? 'text-violet-200' : 'text-slate-600'}`}>{formatLocalizedDate(activityWeek.monday, { day: 'numeric' })}</span>)}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[9px] text-slate-500">
                <span>{formatLocalizedDate(weeklyActivity[0].monday, { month: 'short', year: 'numeric' })}</span>
                <span>{tr('Har hafta 7 kungacha', 'До 7 дней в неделю', 'Up to 7 days per week')}</span>
                <span>{tr('Bugun', 'Сейчас', 'Now')}</span>
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#17162b] to-[#101729] p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">{tr('Joriy natija', 'Текущий результат', 'CURRENT SNAPSHOT')}</p>
                <p className="mt-5 font-[Space_Grotesk] text-5xl font-semibold tracking-tight text-white"><AnimatedNumber value={streak} locale={dateLocale} /><span className="ml-2 text-sm font-medium text-slate-400">{tr('kun ketma-ket', 'дней подряд', 'day streak')}</span></p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">{streak > 0
                  ? tr('Ajoyib! Har kuni ozgina bo‘lsa ham davom eting.', 'Отлично! Продолжайте заниматься понемногу каждый день.', 'Great work. Keep showing up, even for a short session.')
                  : tr('Bugun darsga kirib, yangi faollik kuningizni boshlang.', 'Зайдите на урок сегодня и начните новую серию активности.', 'Visit a lesson today to start a new activity streak.')}</p>
              </div>
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-[9px] text-slate-500"><span>{tr('Haftalik faollik', 'Активность за неделю', 'Weekly activity')}</span><span>{activeDaysThisWeek} / 7</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="analytics-progress-fill h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-300" style={{ width: `${activeDaysThisWeek / 7 * 100}%` }} />
                </div>
                <p className="mt-2 text-[9px] text-slate-500">{tr('Haftadagi jami 7 kun hisobga olinadi.', 'Учитываются все 7 дней недели.', 'Progress is measured against all 7 days.')}</p>
              </div>
            </article>
          </div>
        </div>
      </article>

    </section>

    <section className="mt-6">
      <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <h2 className="font-[Space_Grotesk] text-xl font-semibold text-white">{tr('Örganayotgan kurslar', 'Изучаемые курсы', 'Courses in progress')}</h2>
        <div className="mt-5 space-y-3">
          {courses.filter(course => completedLessonIds.some(id => id.startsWith(`${course.id}:`))).map(course => {
            const count = (course.levels || []).filter(level => completedLessonIds.includes(`${course.id}:${level.id}`)).length;
            const percent = course.levels?.length ? Math.round(count * 100 / course.levels.length) : 0;
            return <Link key={course.id} href={`/courses/${course.slug}`} className="block rounded-xl border border-white/10 p-4 hover:border-neon-cyan/30"><div className="flex justify-between gap-3"><span className="text-sm font-medium text-white">{course.translations?.[language]?.title || course.title}</span><span className="text-xs text-slate-400">{percent}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-[11px] text-slate-500">{count} / {course.levels?.length || 0} {tr('dars', 'уроков', 'lessons')}</p></Link>;
          })}
          {!courses.some(course => completedLessonIds.some(id => id.startsWith(`${course.id}:`))) && <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-slate-400">{tr('Hali yakunlangan dars yöq. Kursni tanlab birinçi videoni boşlang.', 'Пока нет завершённых уроков. Выберите курс и начните с первого видео.', 'No lessons completed yet. Choose a course and start with the first video.')}<Link href="/courses" className="mt-3 block text-neon-cyan">{tr('Kurslarni köriş', 'Смотреть курсы', 'Browse courses')} →</Link></div>}
        </div>
      </article>
    </section>

    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-6"><h2 className="text-lg font-semibold text-white">{t('accountDetails')}</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs text-slate-500">{t('fullNameLabel')}</dt><dd className="mt-1 text-sm text-slate-200">{user.name}</dd></div><div><dt className="text-xs text-slate-500">{t('emailLabel')}</dt><dd className="mt-1 break-all text-sm text-slate-200">{user.email}</dd></div><div><dt className="text-xs text-slate-500">{t('joinedDate')}</dt><dd className="mt-1 text-sm text-slate-200">{dateLabel}</dd></div><div><dt className="text-xs text-slate-500">{t('accountStatus')}</dt><dd className="mt-1 text-sm text-emerald-300">{t('activeStatus')}</dd></div></dl></section>
  </main>;
}
