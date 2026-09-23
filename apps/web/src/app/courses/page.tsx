import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourses } from '@/lib/api/client';
import { CourseCard } from '@/components/courses/CourseCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Courses — CodeLearn',
  description: 'Choose your programming language and start learning.',
};

export default async function CoursesPage() {
  let courses;
  try {
    const res = await getCourses();
    courses = res;
  } catch {
    notFound();
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">No Courses Available</h1>
        <p className="text-text-secondary">Check back later for new courses.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">All Courses</h1>
        <p className="text-text-secondary">Choose a programming language and start your journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
