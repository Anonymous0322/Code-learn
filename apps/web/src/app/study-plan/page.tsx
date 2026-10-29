'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useLearningProgressStore } from '@/store/learningProgressStore';
import { StudyPlan, useStudyPlanStore } from '@/store/studyPlanStore';

function weekStartKey(date: Date) {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

export default function StudyPlanPage() {
  const user = useAuthStore(state => state.currentUser);
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);
  const completedIds = useLearningProgressStore(state => state.completedLessonIds);
  const progressLoading = useLearningProgressStore(state => state.loading);
  const progressUserId = useLearningProgressStore(state => state.userId);
  const initializeProgress = useLearningProgressStore(state => state.initialize);
  const initializePlan = useStudyPlanStore(state => state.initialize);
  const loadPlan = useStudyPlanStore(state => state.load);
  const savePlan = useStudyPlanStore(state => state.save);
  const storedPlan = useStudyPlanStore(state => state.plan);
  const [weekStart] = useState(() => weekStartKey(new Date()));
  const [goal, setGoal] = useState(3);
  const [lessonIds, setLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const flatLessons = useMemo(() => courses.flatMap(course => (course.levels || []).map(level => ({
    id: `${course.id}:${level.id}`,
    title: level.title,
    courseTitle: course.title,
    href: `/learn/${course.slug}/${level.slug || level.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
  }))), [courses]);
  const doneCount = user?.id === progressUserId
    ? lessonIds.filter(id => completedIds.includes(id)).length
    : 0;

  useEffect(() => {
    initializeProgress(user?.id || null);
    initializePlan(user?.id || null);
  }, [initializePlan, initializeProgress, user?.id]);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setLessonIds([]);
      return () => { cancelled = true; };
    }
    setLoading(true);
    setError('');
    loadPlan(user.id)
      .then(plan => {
        if (cancelled) return;
        if (plan?.weekStart === weekStart) {
          setGoal(plan.goal);
          setLessonIds(plan.lessonIds);
        } else {
          setGoal(3);
          setLessonIds([]);
        }
      })
      .catch(() => { if (!cancelled) setError('Haftalik rejani yuklab bo‘lmadi. Internet va Supabase sozlamalarini tekshiring.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [loadPlan, user, weekStart]);

  const toggleLesson = (id: string) => {
    setLessonIds(current => current.includes(id) ? current.filter(item => item !== id) : current.length >= 30 ? current : [...current, id]);
    setMessage('');
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const plan: Omit<StudyPlan, 'updatedAt'> = { weekStart, goal, lessonIds };
      await savePlan(user.id, plan);
      setMessage('Haftalik rejangiz saqlandi.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Rejani saqlab bo‘lmadi. Qayta urinib ko‘ring.');
    } finally {
      setSaving(false);
    }
  };

  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#142044] via-[#0d1428] to-[#11102a] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">O‘quv odatini shakllantiring</p>
      <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">Haftalik o‘quv reja</h1>
      <p className="mt-3 text-sm text-slate-400">Hafta dushanbadan boshlanadi · {weekStart}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3"><p className="text-xs text-slate-400">Maqsad</p><p className="mt-1 text-xl font-semibold text-white">{goal} dars</p></div>
        <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3"><p className="text-xs text-slate-400">Bajarildi</p><p className="mt-1 text-xl font-semibold text-neon-cyan">{doneCount}/{goal}</p></div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan transition-all" style={{ width: `${Math.min(100, Math.round(doneCount * 100 / goal))}%` }} /></div>
    </header>

    {!user ? <section className="mt-6 rounded-2xl border border-white/10 p-6 text-center">
      <p className="text-slate-300">Shaxsiy haftalik reja tuzish uchun tizimga kiring.</p><Link href="/auth/login?next=/study-plan" className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 text-sm font-semibold text-white">Kirish</Link>
    </section> : <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="text-lg font-semibold text-white">Bu hafta nimani o‘rganasiz?</h2><p className="mt-1 text-sm text-slate-400">Maqsadni tanlang va haftada bajarishni rejalashtirgan darslarni belgilang.</p></div>
        <label className="text-xs text-slate-400">Haftalik maqsad
          <select value={goal} onChange={event => { setGoal(Number(event.target.value)); setMessage(''); }} disabled={loading} className="ml-2 rounded-lg border border-white/10 bg-[#0a0f24] px-3 py-2 text-sm text-white">
            {[1, 2, 3, 5, 7, 10, 15, 20, 30].map(value => <option key={value} value={value}>{value} dars</option>)}
          </select>
        </label>
      </div>
      {loading ? <p className="mt-5 text-sm text-slate-400">Reja yuklanmoqda...</p> : <div className="mt-5 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
        {flatLessons.map(lesson => <label key={lesson.id} className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-sm hover:bg-white/[0.025]">
          <input type="checkbox" checked={lessonIds.includes(lesson.id)} onChange={() => toggleLesson(lesson.id)} disabled={user?.id !== progressUserId || progressLoading || (completedIds.includes(lesson.id) && !lessonIds.includes(lesson.id))} className="mt-1 accent-cyan-400 disabled:opacity-40" />
          <span className="min-w-0 flex-1"><span className="block text-white">{lesson.title}</span><span className="text-xs text-slate-500">{lesson.courseTitle}</span></span>
          {user?.id === progressUserId && completedIds.includes(lesson.id) && <span className="text-xs text-emerald-300">Bajarildi</span>}
        </label>)}
        {flatLessons.length === 0 && <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">Hozircha tanlash uchun dars yo‘q.</p>}
      </div>}
      {error && <p role="alert" className="mt-4 text-sm text-amber-200">{error}</p>}
      {message && <p role="status" className="mt-4 text-sm text-emerald-300">{message}</p>}
      <button type="button" onClick={() => void handleSave()} disabled={saving || loading || lessonIds.length > 30} className="mt-5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saqlanmoqda…' : 'Rejani saqlash'}</button>
    </section>}
    {storedPlan?.weekStart === weekStart && storedPlan.lessonIds.length > 0 && <section className="mt-6 rounded-2xl border border-white/10 p-5">
      <h2 className="font-semibold text-white">Rejadagi darslar</h2>
      <div className="mt-3 flex flex-wrap gap-2">{flatLessons.filter(lesson => storedPlan.lessonIds.includes(lesson.id)).map(lesson => <Link key={lesson.id} href={lesson.href} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:border-neon-cyan/30">{lesson.title} →</Link>)}</div>
    </section>}
  </main>;
}
