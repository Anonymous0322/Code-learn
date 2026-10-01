'use client';

import { courses } from '@/lib/data';
import { CourseCard } from '@/components/courses/CourseCard';
import { useI18n } from '@/components/providers';

export default function CoursesPage() {
  const { t } = useI18n();
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
        <h1 className="text-3xl font-bold text-text-primary mb-2">{t('allCourses')}</h1>
        <p className="text-text-secondary">{t('chooseCourse')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course as any} />
        ))}
      </div>
    </div>
  );
}
