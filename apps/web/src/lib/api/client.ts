const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API Error: ${res.status}`);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API Error: ${res.status}`);
  }
  return res.json();
}

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
