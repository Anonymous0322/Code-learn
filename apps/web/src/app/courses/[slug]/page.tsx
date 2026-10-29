'use client';

import { useCourseStore } from '@/store/courseStore';
import { CourseRoadmap } from '@/components/courses/CourseRoadmap';
import { useI18n } from '@/components/providers';

export default function CoursePage({ params }: { params: { slug: string } }) {
  const { tr } = useI18n();
  const courses = useCourseStore(state => state.courses);
  const initialized = useCourseStore(state => state.initialized);
  const course = courses.find(item => item.slug === params.slug && item.isActive);

  if (!course && !initialized) return <main className="mx-auto max-w-7xl px-4 py-12 text-slate-400">{tr('Kurs yuklanmoqda...', 'Загрузка курса...', 'Loading course...')}</main>;
  if (!course) return <main className="mx-auto max-w-7xl px-4 py-12 text-slate-400">{tr('Kurs topilmadi.', 'Курс не найден.', 'Course not found.')}</main>;

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><CourseRoadmap course={course as any} progress={null} /></div>;
}
