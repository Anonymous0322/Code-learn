'use client';

import { LessonPage } from '@/components/lesson/LessonPage';
import { useCourseStore } from '@/store/courseStore';
import { useI18n } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { useLearningProgressStore } from '@/store/learningProgressStore';
import { useEffect } from 'react';

const toSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function LessonDetailPage({ params }: { params: { courseSlug: string; lessonSlug: string } }) {
  const courses = useCourseStore(state => state.courses);
  const initialized = useCourseStore(state => state.initialized);
  const { language, tr } = useI18n();
  const user = useAuthStore(state => state.currentUser);
  const completedLessonIds = useLearningProgressStore(state => state.completedLessonIds);
  const initializeProgress = useLearningProgressStore(state => state.initialize);
  useEffect(() => { initializeProgress(user?.id || null); }, [initializeProgress, user?.id]);
  const course = courses.find(item => item.slug === params.courseSlug && item.isActive);
  const orderedLevels = [...(course?.levels || [])].sort((a, b) => a.orderIndex - b.orderIndex);
  const lessonIndex = orderedLevels.findIndex(item => (item.slug || toSlug(item.title)) === params.lessonSlug);
  const level = lessonIndex >= 0 ? orderedLevels[lessonIndex] : undefined;

  if (!initialized && (!course || !level)) return <main className="mx-auto max-w-7xl px-4 py-12 text-slate-400">{tr('Dars yuklanmoqda...', 'Загрузка урока...', 'Loading lesson...')}</main>;
  if (!course || !level) return <main className="mx-auto max-w-7xl px-4 py-12 text-slate-400">{tr('Dars topilmadi.', 'Урок не найден.', 'Lesson not found.')}</main>;

  const previousLevel = orderedLevels[lessonIndex - 1];
  const previousLessonHref = previousLevel ? `/learn/${course.slug}/${previousLevel.slug || toSlug(previousLevel.title)}` : undefined;
  const nextLevel = orderedLevels[lessonIndex + 1];
  const nextLessonHref = nextLevel ? `/learn/${course.slug}/${nextLevel.slug || toSlug(nextLevel.title)}` : undefined;
  const isCompleted = completedLessonIds.includes(`${course.id}:${level.id}`);
  const previousCompleted = !previousLevel || completedLessonIds.includes(`${course.id}:${previousLevel.id}`);

  if (!previousCompleted) return <main className="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 className="text-2xl font-semibold text-white">{tr('Avval oldingi darsni yakunlang', 'Сначала завершите предыдущий урок', 'Complete the previous lesson first')}</h1>
    <p className="mt-3 text-slate-400">{tr('Darslar oldingi dars yakunlangandan keyin ketma-ket ochiladi.', 'Уроки открываются последовательно после завершения предыдущего урока.', 'Lessons unlock in order after the previous lesson is completed.')}</p>
    {previousLessonHref && <a href={previousLessonHref} className="mt-6 inline-flex rounded-lg bg-neon-blue/20 px-4 py-2 text-neon-cyan">{tr('Oldingi darsga o‘tish', 'К предыдущему уроку', 'Go to previous lesson')}</a>}
  </main>;

  const localizedLevel = level.translations?.[language];
  const localizedCourse = {
    ...course,
    title: course.translations?.[language]?.title || course.title,
    description: course.translations?.[language]?.description || course.description,
  };
  const lesson = {
    ...level,
    title: localizedLevel?.title || level.title,
    description: localizedLevel?.description || level.description,
    slug: level.slug || toSlug(level.title),
    levelId: level.id,
    orderIndex: level.orderIndex,
    difficulty: course.difficulty,
    estimatedTime: '10 min',
    isLocked: false,
    editorLanguage: level.editorLanguage || (['html', 'css', 'javascript'] as const).find(value => value === course.languageCode.toLowerCase()) || 'html',
    starterCode: level.starterCode,
    exercise: level.exercise,
    theory: localizedLevel?.theory || level.translations?.[language]?.theory || level.theory || localizedLevel?.description || level.description,
  };

  return <LessonPage lesson={lesson as any} course={localizedCourse as any} previousLessonHref={previousLessonHref} nextLessonHref={nextLessonHref} isCompleted={isCompleted} />;
}
