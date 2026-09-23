import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug } from '@/lib/data';
import { CourseRoadmap } from '@/components/courses/CourseRoadmap';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  if (!course) return { title: 'Course Not Found' };
  return {
    title: `${course.title} — CodeLearn`,
    description: course.description || `Learn ${course.title} from scratch.`,
  };
}

export default function CoursePage({ params }: PageProps) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CourseRoadmap course={course as any} progress={null} />
    </div>
  );
}
