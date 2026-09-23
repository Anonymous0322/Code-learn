import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLesson } from '@/lib/api/client';
import { getCourseBySlug } from '@/lib/api/client';
import { LessonPage } from '@/components/lesson/LessonPage';

interface PageProps {
  params: { courseSlug: string; lessonSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lesson = await getLesson(params.courseSlug, params.lessonSlug);
  if (!lesson) return { title: 'Lesson Not Found' };
  return {
    title: `${lesson.title} — CodeLearn`,
  };
}

export default async function LessonDetailPage({ params }: PageProps) {
  const lesson = await getLesson(params.courseSlug, params.lessonSlug);
  if (!lesson) notFound();

  const course = await getCourseBySlug(params.courseSlug);
  if (!course) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LessonPage lesson={lesson} course={course} />
    </div>
  );
}
