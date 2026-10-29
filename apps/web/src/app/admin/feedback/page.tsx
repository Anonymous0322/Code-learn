'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { LessonFeedback, useLearningExtrasStore } from '@/store/learningExtrasStore';
import { useCourseStore } from '@/store/courseStore';

export default function AdminFeedbackPage() {
  const loadFeedback = useLearningExtrasStore(state => state.loadFeedback);
  const markReviewed = useLearningExtrasStore(state => state.markFeedbackReviewed);
  const courses = useCourseStore(state => state.courses);
  const [items, setItems] = useState<LessonFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await loadFeedback());
    } catch {
      setError('Fikrlarni yuklab bo‘lmadi. Supabase RLS va ulanishni tekshiring.');
    } finally {
      setLoading(false);
    }
  }, [loadFeedback]);

  useEffect(() => { void refresh(); }, [refresh]);

  const handleReview = async (item: LessonFeedback) => {
    setUpdatingId(item.id);
    setError('');
    try {
      await markReviewed(item.id);
      setItems(current => current.map(row => row.id === item.id ? { ...row, status: 'reviewed' } : row));
    } catch {
      setError('Fikr holatini yangilab bo‘lmadi. Ruxsat va internetni tekshiring.');
    } finally {
      setUpdatingId('');
    }
  };

  return <main className="mx-auto max-w-5xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
      <div><p className="text-xs uppercase tracking-[0.18em] text-neon-cyan">O‘quvchilar fikri</p><h1 className="mt-2 text-2xl font-semibold text-white">Darslar bo‘yicha xabarlar</h1></div>
      <button type="button" onClick={() => void refresh()} disabled={loading} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 disabled:opacity-50">Yangilash</button>
    </header>
    {error && <p role="alert" className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{error}</p>}
    {loading ? <p className="text-sm text-slate-400">Xabarlar yuklanmoqda...</p> : items.length === 0 ? <p className="rounded-xl border border-white/10 p-6 text-sm text-slate-400">Hozircha yuborilgan fikr yo‘q.</p> : <section className="space-y-3">
      {items.map(item => <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {(() => {
              const course = courses.find(row => row.id === item.courseId);
              const lesson = course?.levels?.find(row => row.id === item.lessonId);
              return course && lesson
                ? <Link href={`/learn/${course.slug}/${lesson.slug || lesson.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="font-semibold text-white hover:text-neon-cyan">{item.lessonTitle}</Link>
                : <span className="font-semibold text-white">{item.lessonTitle}</span>;
            })()}
            <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString('uz-UZ')} · foydalanuvchi ID: {item.userId}</p>
          </div>
          <span className={`rounded-full border px-2.5 py-1 text-[10px] ${item.status === 'open' ? 'border-amber-300/20 bg-amber-300/10 text-amber-200' : 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200'}`}>{item.status === 'open' ? 'Ko‘rib chiqilmagan' : 'Ko‘rib chiqildi'}</span>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.message}</p>
        {item.status === 'open' && <button type="button" onClick={() => void handleReview(item)} disabled={updatingId === item.id} className="mt-4 rounded-lg border border-neon-cyan/30 px-3 py-2 text-xs font-semibold text-neon-cyan disabled:opacity-50">{updatingId === item.id ? 'Saqlanmoqda…' : 'Ko‘rib chiqildi deb belgilash'}</button>}
      </article>)}
    </section>}
  </main>;
}
