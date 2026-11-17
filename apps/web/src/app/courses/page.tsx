'use client';

import { useMemo, useState } from 'react';
import { CourseCard } from '@/components/courses/CourseCard';
import { useI18n } from '@/components/providers';
import { useCourseStore } from '@/store/courseStore';

export default function CoursesPage() {
  const { t, tr, formatText } = useI18n();
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);
  const initialized = useCourseStore(state => state.initialized);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const filteredCourses = useMemo(() => {
    const query = formatText(search.trim()).toLocaleLowerCase();
    return courses.filter(course => {
      const searchableText = formatText(`${course.title} ${course.description}`).toLocaleLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      return matchesSearch && (difficulty === 'all' || course.difficulty === difficulty);
    });
  }, [courses, difficulty, formatText, search]);
  const searchLabel = tr('Kurs nomi yoki tavsifi böyiça qidiriş', 'Поиск по названию или описанию курса', 'Search courses by title or description');
  const allLevels = tr('Barça darajalar', 'Все уровни', 'All levels');
  const noMatches = tr('Tanlangan qidiruv böyiça kurs topilmadi.', 'Курсы не найдены.', 'No courses match your search.');
  const reset = tr('Filtrlarni tozalaş', 'Сбросить фильтры', 'Reset filters');
  if (initialized && courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">{t('noCourses')}</h1>
        <p className="text-text-secondary">{t('checkBackCourses')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">{t('allCourses')}</h1>
        <p className="text-text-secondary">{t('chooseCourse')}</p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <label className="sr-only" htmlFor="course-search">{searchLabel}</label>
        <input id="course-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={searchLabel} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-neon-cyan focus:outline-none" />
        <label className="sr-only" htmlFor="course-difficulty">{t('difficulty')}</label>
        <select id="course-difficulty" value={difficulty} onChange={event => setDifficulty(event.target.value)} className="rounded-xl border border-white/10 bg-[#0a0f24] px-4 py-3 text-sm text-white focus:border-neon-cyan focus:outline-none">
          <option value="all">{allLevels}</option>
          <option value="beginner">{t('beginner')}</option>
          <option value="intermediate">{t('intermediate')}</option>
          <option value="advanced">{t('advanced')}</option>
        </select>
      </div>

      {!initialized ? <p className="text-sm text-text-secondary">{tr('Kurslar yuklanmoqda...', 'Загрузка курсов...', 'Loading courses...')}</p> : filteredCourses.length > 0 ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course as any} />
        ))}
      </div> : <div className="rounded-2xl border border-white/10 p-8 text-center">
        <p className="text-text-secondary">{noMatches}</p>
        {(search || difficulty !== 'all') && <button type="button" onClick={() => { setSearch(''); setDifficulty('all'); }} className="mt-4 rounded-lg border border-neon-cyan/30 px-4 py-2 text-sm text-neon-cyan">{reset}</button>}
      </div>}
    </div>
  );
}
