'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { QuizResult, useLearningProgressStore } from '@/store/learningProgressStore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export default function AchievementsPage() {
  const user = useAuthStore(state => state.currentUser);
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);
  const completedLessonIds = useLearningProgressStore(state => state.completedLessonIds);
  const activeDays = useLearningProgressStore(state => state.activeDays);
  const initializeProgress = useLearningProgressStore(state => state.initialize);
  const loadQuizResults = useLearningProgressStore(state => state.loadQuizResults);
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { initializeProgress(user?.id || null); }, [initializeProgress, user?.id]);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setQuizResults({});
      setLoading(false);
      return () => { cancelled = true; };
    }
    setLoading(true);
    loadQuizResults(user.id)
      .then(results => {
        if (!cancelled) {
          setQuizResults(results);
          setError('');
        }
      })
      .catch(() => {
        if (!cancelled) setError('Test natijalarini yuklab bo‘lmadi. Internet va Supabase RLS sozlamalarini tekshiring.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [loadQuizResults, user]);

  const completedCount = useMemo(() => courses.reduce(
    (count, course) => count + (course.levels || []).filter(level => completedLessonIds.includes(`${course.id}:${level.id}`)).length,
    0,
  ), [completedLessonIds, courses]);
  const resultList = Object.values(quizResults);
  const correctAnswers = resultList.reduce((sum, result) => sum + result.score, 0);
  const xp = completedCount * 20 + correctAnswers * 10;
  const achievements: Achievement[] = [
    { id: 'first-lesson', title: 'Birinchi qadam', description: 'Birinchi darsni yakunlang.', unlocked: completedCount >= 1 },
    { id: 'first-quiz', title: 'Bilim sinovi', description: 'Birinchi mini-testni topshiring.', unlocked: resultList.length >= 1 },
    { id: 'five-lessons', title: 'Izchil o‘quvchi', description: '5 ta darsni yakunlang.', unlocked: completedCount >= 5 },
    { id: 'perfect-quiz', title: 'A’lo natija', description: 'Mini-testlardan birini 100% natija bilan yakunlang.', unlocked: resultList.some(result => result.percentage === 100) },
    { id: 'three-quizzes', title: 'Bilimdon', description: '3 ta turli dars mini-testini topshiring.', unlocked: resultList.length >= 3 },
    { id: 'active-week', title: 'Faol o‘quvchi', description: 'Kamida 7 kun o‘quv faoliyati qayd etilsin.', unlocked: activeDays.length >= 7 },
  ];
  const unlockedCount = achievements.filter(achievement => achievement.unlocked).length;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#172448] via-[#0d1428] to-[#17102a] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">O‘quv motivatsiyasi</p>
        <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">Yutuqlar va tajriba ballari</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Har bir yakunlangan dars va mini-test natijasi tajriba ballariga qo‘shiladi. Yutuqlar sizning o‘quv jarayoningiz asosida ochiladi.</p>
        {user ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-xs text-slate-400">Jami XP</p>
              <p className="mt-1 font-[Space_Grotesk] text-3xl font-bold text-white">{loading ? '—' : xp} <span className="text-sm font-medium text-neon-cyan">XP</span></p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-xs text-slate-400">Ochiq yutuqlar</p>
              <p className="mt-1 font-[Space_Grotesk] text-3xl font-bold text-white">{unlockedCount}<span className="text-lg text-slate-500">/{achievements.length}</span></p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-xs text-slate-400">To‘g‘ri javoblar</p>
              <p className="mt-1 font-[Space_Grotesk] text-3xl font-bold text-white">{loading ? '—' : correctAnswers}</p>
            </div>
          </div>
        ) : (
          <Link href="/auth/login" className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-semibold text-white">Natijalarni saqlash uchun tizimga kiring</Link>
        )}
      </header>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[Space_Grotesk] text-2xl font-semibold text-white">Yutuqlar</h2>
            <p className="mt-1 text-sm text-slate-400">Darslarni o‘qing, mini-testlarni bajaring va yangi belgilarni oching.</p>
          </div>
          {user && <span className="text-xs text-slate-500">Dars: +20 XP · Testdagi har to‘g‘ri javob: +10 XP</span>}
        </div>
        {error && <p role="alert" className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{error}</p>}
        {user && loading ? <p className="mt-6 text-sm text-slate-400">Natijalar yuklanmoqda…</p> : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map(achievement => (
              <article key={achievement.id} className={`rounded-2xl border p-5 ${achievement.unlocked ? 'border-amber-300/25 bg-amber-300/[0.06]' : 'border-white/10 bg-white/[0.025] opacity-70'}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${achievement.unlocked ? 'bg-amber-300/15' : 'bg-white/5 grayscale'}`}>{achievement.unlocked ? '🏆' : '🔒'}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${achievement.unlocked ? 'text-amber-200' : 'text-slate-500'}`}>{achievement.unlocked ? 'Ochildi' : 'Yopiq'}</span>
                </div>
                <h3 className="mt-4 font-semibold text-white">{achievement.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-400">{achievement.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/courses" className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-semibold text-white">Kurslarga o‘tish →</Link>
        <Link href="/projects" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-300 hover:border-white/30">Loyihalarni ko‘rish</Link>
      </div>
    </main>
  );
}
