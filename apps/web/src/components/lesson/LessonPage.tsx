'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Course, Lesson } from '@/types';
import { useI18n } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { useLearningProgressStore } from '@/store/learningProgressStore';
import { LessonPlayground } from '@/components/lesson/LessonPlayground';
import { LessonQuiz } from '@/components/lesson/LessonQuiz';
import { LessonContent } from '@/components/lesson/LessonContent';
import { LessonTools } from '@/components/lesson/LessonTools';

interface LessonPageProps {
  lesson: Lesson;
  course: Course;
  previousLessonHref?: string;
  nextLessonHref?: string;
  isCompleted: boolean;
}

const copy = {
  en: { lesson: 'Lesson', description: 'Read the lesson, try the code, and mark it complete when you are ready.', complete: 'Lesson completed', finish: 'Mark lesson complete', next: 'Next lesson', previous: 'Previous lesson', signIn: 'Sign in to save your progress and continue.', saved: 'Your progress could not be saved. Check your connection and try again.', course: 'Course' },
  ru: { lesson: 'Урок', description: 'Изучите материал, попробуйте код и отметьте урок завершённым.', complete: 'Урок завершён', finish: 'Завершить урок', next: 'Следующий урок', previous: 'Предыдущий урок', signIn: 'Войдите, чтобы сохранить прогресс и продолжить.', saved: 'Не удалось сохранить прогресс. Проверьте соединение и повторите попытку.', course: 'Курс' },
  uz: { lesson: 'Dars', description: 'Darslikni o‘qing, kodni sinab ko‘ring va tayyor bo‘lgach darsni yakunlang.', complete: 'Dars yakunlandi', finish: 'Darsni yakunlash', next: 'Keyingi dars', previous: 'Oldingi dars', signIn: 'Davom etish va natijani saqlash uchun tizimga kiring.', saved: 'Natijani saqlab bo‘lmadi. Internetni tekshirib qayta urinib ko‘ring.', course: 'Kurs' },
} as const;

export function LessonPage({ lesson, course, previousLessonHref, nextLessonHref, isCompleted }: LessonPageProps) {
  const { language } = useI18n();
  const text = copy[language as keyof typeof copy] || copy.en;
  const user = useAuthStore(state => state.currentUser);
  const completeLesson = useLearningProgressStore(state => state.completeLesson);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const lessonId = `${course.id}:${lesson.id}`;

  const handleComplete = async () => {
    if (isCompleted || saving) return;
    if (!user) { setError(text.signIn); return; }
    setSaving(true);
    setError('');
    try { await completeLesson(lessonId); }
    catch { setError(text.saved); }
    finally { setSaving(false); }
  };

  return <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_280px] sm:px-6">
    <section className="min-w-0">
      <Link href={`/courses/${course.slug}`} className="text-sm text-neon-cyan hover:underline">← {course.title}</Link>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-xs text-neon-cyan">{text.lesson} {lesson.orderIndex + 1}</span>
        {isCompleted && <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">✓ {text.complete}</span>}
      </div>
      <h1 className="mt-3 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">{lesson.title}</h1>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <LessonContent content={lesson.theory || lesson.description || text.description} />
      </div>
      <LessonPlayground editorLanguage={lesson.editorLanguage} starterCode={lesson.starterCode} exercise={lesson.exercise || undefined} />
      {lesson.quiz && <LessonQuiz lessonId={lessonId} questions={lesson.quiz} />}
      <LessonTools courseId={course.id} lessonId={lesson.id} courseSlug={course.slug} lessonSlug={lesson.slug} lessonTitle={lesson.title || ''} />

      {saving && <p className="mt-3 text-sm text-slate-400">{language === 'ru' ? 'Сохраняем прогресс…' : language === 'uz' ? 'Natija saqlanmoqda…' : 'Saving progress…'}</p>}
      {error && <p role="alert" className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{error}</p>}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
        {previousLessonHref ? <Link href={previousLessonHref} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:border-white/25">← {text.previous}</Link> : <span />}
        {!isCompleted && <button type="button" onClick={handleComplete} disabled={saving} className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60">{text.finish} ✓</button>}
        {isCompleted && nextLessonHref && <Link href={nextLessonHref} className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-2.5 text-sm font-semibold text-white">{text.next} →</Link>}
        {isCompleted && !nextLessonHref && <Link href={`/courses/${course.slug}`} className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-2.5 text-sm font-semibold text-white">{text.course} ✓</Link>}
      </div>
    </section>

    <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{text.course}</p>
      <h2 className="mt-2 font-semibold text-white">{course.title}</h2>
      <p className="mt-1 text-sm text-slate-400">{text.description}</p>
    </aside>
  </main>;
}
