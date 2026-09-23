export async function getCourses() {
  const res = await apiGet<{ data: any[] }>('/courses');
  return res.data;
}

export async function getCourseBySlug(slug: string) {
  const res = await apiGet<{ data: any }>(`/courses/${slug}`);
  return res.data;
}

export async function getCourseRoadmap(courseId: string) {
  const res = await apiGet<{ data: any }>(`/courses/${courseId}/roadmap`);
  return res.data;
}

export async function getCourseLevels(courseId: string) {
  const res = await apiGet<{ data: any[] }>(`/courses/${courseId}/levels`);
  return res.data;
}

export async function getLessonsByLevel(levelId: string) {
  const res = await apiGet<{ data: any[] }>(`/levels/${levelId}/lessons`);
  return res.data;
}

export async function getLesson(courseSlug: string, lessonSlug: string) {
  const res = await apiGet<{ data: any }>(`/courses/${courseSlug}/lessons/${lessonSlug}`);
  return res.data;
}

export async function getCourseProgress(courseId: string) {
  const res = await apiGet<{ data: any }>(`/progress/${courseId}`);
  return res.data;
}

export async function completeLesson(lessonId: string) {
  const res = await apiPost<{ data: any }>('/progress/complete-lesson', { lessonId });
  return res.data;
}
