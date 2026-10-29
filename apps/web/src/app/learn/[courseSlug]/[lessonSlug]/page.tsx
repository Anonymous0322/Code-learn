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
  const { language } = useI18n();
  const user = useAuthStore(state => state.currentUser);
  const completedLessonIds = useLearningProgressStore(state => state.completedLessonIds);
  const initializeProgress = useLearningProgressStore(state => state.initialize);
  useEffect(() => { initializeProgress(user?.id || null); }, [initializeProgress, user?.id]);
  const course = courses.find(item => item.slug === params.courseSlug && item.isActive);
  const orderedLevels = [...(course?.levels || [])].sort((a, b) => a.orderIndex - b.orderIndex);
  const lessonIndex = orderedLevels.findIndex(item => (item.slug || toSlug(item.title)) === params.lessonSlug);
  const level = lessonIndex >= 0 ? orderedLevels[lessonIndex] : undefined;

  if (!initialized && (!course || !level)) return <main className="mx-auto max-w-7xl px-4 py-12 text-slate-400">{language === 'ru' ? '\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043a\\u0430...' : language === 'uz' ? 'Dars yuklanmoqda...' : 'Loading lesson...'}</main>;
  if (!course || !level) return <main className="mx-auto max-w-7xl px-4 py-12 text-slate-400">{language === 'ru' ? '\\u0423\\u0440\\u043e\\u043a \\u043d\\u0435 \\u043d\\u0430\\u0439\\u0434\\u0435\\u043d.' : language === 'uz' ? 'Dars topilmadi.' : 'Lesson not found.'}</main>;

  const previousLevel = orderedLevels[lessonIndex - 1];
  const previousLessonHref = previousLevel ? `/learn/${course.slug}/${previousLevel.slug || toSlug(previousLevel.title)}` : undefined;
  const nextLevel = orderedLevels[lessonIndex + 1];
  const nextLessonHref = nextLevel ? `/learn/${course.slug}/${nextLevel.slug || toSlug(nextLevel.title)}` : undefined;
  const isCompleted = completedLessonIds.includes(`${course.id}:${level.id}`);
  const previousCompleted = !previousLevel || completedLessonIds.includes(`${course.id}:${previousLevel.id}`);

  if (!previousCompleted) return <main className="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 className="text-2xl font-semibold text-white">{language === 'ru' ? 'Сначала завершите предыдущий урок' : language === 'uz' ? 'Avval oldingi darsni yakunlang' : 'Complete the previous lesson first'}</h1>
    <p className="mt-3 text-slate-400">{language === 'ru' ? 'Уроки открываются последовательно после завершения предыдущего урока.' : language === 'uz' ? 'Darslar oldingi dars yakunlangandan keyin ketma-ket ochiladi.' : 'Lessons unlock in order after the previous lesson is completed.'}</p>
    {previousLessonHref && <a href={previousLessonHref} className="mt-6 inline-flex rounded-lg bg-neon-blue/20 px-4 py-2 text-neon-cyan">{language === 'ru' ? 'К предыдущему уроку' : language === 'uz' ? 'Oldingi darsga o‘tish' : 'Go to previous lesson'}</a>}
  </main>;

  const lesson = {
    ...level,
    title: level.title,
    description: level.description,
    slug: level.slug || toSlug(level.title),
    levelId: level.id,
    orderIndex: level.orderIndex,
    difficulty: course.difficulty,
    estimatedTime: '10 min',
    isLocked: false,
    editorLanguage: level.editorLanguage || (['html', 'css', 'javascript'] as const).find(value => value === course.languageCode.toLowerCase()) || 'html',
    starterCode: level.starterCode,
    exercise: level.exercise,
    theory: level.theory || level.description,
  };

  return <LessonPage lesson={lesson as any} course={course as any} previousLessonHref={previousLessonHref} nextLessonHref={nextLessonHref} isCompleted={isCompleted} />;
}
