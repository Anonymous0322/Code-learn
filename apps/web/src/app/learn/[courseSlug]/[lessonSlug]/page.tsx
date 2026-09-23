import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getLesson } from '@/lib/data';
import { LessonPage } from '@/components/lesson/LessonPage';

interface PageProps {
  params: { courseSlug: string; lessonSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lesson = getLesson(params.courseSlug, params.lessonSlug);
  if (!lesson) return { title: 'Lesson Not Found' };
  return {
    title: `${lesson.title} — CodeLearn`,
  };
}

export default function LessonDetailPage({ params }: PageProps) {
  const lesson = getLesson(params.courseSlug, params.lessonSlug);
  if (!lesson) notFound();

  const course = getCourseBySlug(params.courseSlug);
  if (!course) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LessonPage lesson={lesson as any} course={course as any} />
    </div>
  );
}
