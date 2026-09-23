import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug } from '@/lib/api/courses';
import { getCourseProgress } from '@/lib/api/progress';
import { CourseRoadmap } from '@/components/courses/CourseRoadmap';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);
  if (!course) return { title: 'Course Not Found' };
  return {
    title: `${course.title} — CodeLearn`,
    description: course.description || `Learn ${course.title} from scratch.`,
  };
}

export default async function CoursePage({ params }: PageProps) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  let progress;
  try {
    progress = await getCourseProgress(course.id);
  } catch {
    progress = null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CourseRoadmap course={course} progress={progress} />
    </div>
  );
}
