'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { QuizResult, useLearningProgressStore } from '@/store/learningProgressStore';
import { useI18n } from '@/components/providers';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export default function AchievementsPage() {
  const { tr } = useI18n();
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
        if (!cancelled) setError(tr('Test natijalarini yuklab bo‘lmadi. Internet va Supabase RLS sozlamalarini tekshiring.', 'Не удалось загрузить результаты тестов. Проверьте подключение и настройки RLS в Supabase.', 'Could not load quiz results. Check your internet connection and Supabase RLS settings.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [loadQuizResults, tr, user]);

  const completedCount = useMemo(() => courses.reduce(
    (count, course) => count + (course.levels || []).filter(level => completedLessonIds.includes(`${course.id}:${level.id}`)).length,
    0,
  ), [completedLessonIds, courses]);
  const resultList = Object.values(quizResults);
  const correctAnswers = resultList.reduce((sum, result) => sum + result.score, 0);
  const xp = completedCount * 20 + correctAnswers * 10;
  const achievements: Achievement[] = [
    { id: 'first-lesson', title: tr('Birinchi qadam', 'Первый шаг', 'First step'), description: tr('Birinchi darsni yakunlang.', 'Завершите первый урок.', 'Complete your first lesson.'), unlocked: completedCount >= 1 },
    { id: 'first-quiz', title: tr('Bilim sinovi', 'Проверка знаний', 'Knowledge check'), description: tr('Birinchi mini-testni topshiring.', 'Пройдите первый мини-тест.', 'Complete your first quiz.'), unlocked: resultList.length >= 1 },
    { id: 'five-lessons', title: tr('Izchil o‘quvchi', 'Настойчивый ученик', 'Consistent learner'), description: tr('5 ta darsni yakunlang.', 'Завершите 5 уроков.', 'Complete 5 lessons.'), unlocked: completedCount >= 5 },
    { id: 'perfect-quiz', title: tr('A’lo natija', 'Идеальный результат', 'Perfect score'), description: tr('Mini-testlardan birini 100% natija bilan yakunlang.', 'Наберите 100% в одном из мини-тестов.', 'Score 100% on one of the quizzes.'), unlocked: resultList.some(result => result.percentage === 100) },
    { id: 'three-quizzes', title: tr('Bilimdon', 'Эрудит', 'Quiz master'), description: tr('3 ta turli dars mini-testini topshiring.', 'Пройдите мини-тесты по 3 разным урокам.', 'Complete quizzes for 3 different lessons.'), unlocked: resultList.length >= 3 },
    { id: 'active-week', title: tr('Faol o‘quvchi', 'Активный ученик', 'Active learner'), description: tr('Kamida 7 kun o‘quv faoliyati qayd etilsin.', 'Занимайтесь не менее 7 дней.', 'Record learning activity on at least 7 days.'), unlocked: activeDays.length >= 7 },
  ];
  const unlockedCount = achievements.filter(achievement => achievement.unlocked).length;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#172448] via-[#0d1428] to-[#17102a] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">{tr('O‘quv motivatsiyasi', 'Мотивация к обучению', 'Learning motivation')}</p>
        <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">{tr('Yutuqlar va tajriba ballari', 'Достижения и очки опыта', 'Achievements and experience points')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{tr('Har bir yakunlangan dars va mini-test natijasi tajriba ballariga qo‘shiladi. Yutuqlar sizning o‘quv jarayoningiz asosida ochiladi.', 'За каждый завершённый урок и мини-тест начисляются очки опыта. Достижения открываются по мере обучения.', 'Every completed lesson and quiz adds experience points. Achievements unlock as you make progress.')}</p>
        {user ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-xs text-slate-400">Jami XP</p>
              <p className="mt-1 font-[Space_Grotesk] text-3xl font-bold text-white">{loading ? '—' : xp} <span className="text-sm font-medium text-neon-cyan">XP</span></p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-xs text-slate-400">{tr('Ochiq yutuqlar', 'Открытые достижения', 'Unlocked achievements')}</p>
              <p className="mt-1 font-[Space_Grotesk] text-3xl font-bold text-white">{unlockedCount}<span className="text-lg text-slate-500">/{achievements.length}</span></p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-xs text-slate-400">{tr('To‘g‘ri javoblar', 'Правильные ответы', 'Correct answers')}</p>
              <p className="mt-1 font-[Space_Grotesk] text-3xl font-bold text-white">{loading ? '—' : correctAnswers}</p>
            </div>
          </div>
        ) : (
          <Link href="/auth/login" className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-semibold text-white">{tr('Natijalarni saqlash uchun tizimga kiring', 'Войдите, чтобы сохранять результаты', 'Sign in to save your results')}</Link>
        )}
      </header>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[Space_Grotesk] text-2xl font-semibold text-white">{tr('Yutuqlar', 'Достижения', 'Achievements')}</h2>
            <p className="mt-1 text-sm text-slate-400">{tr('Darslarni o‘qing, mini-testlarni bajaring va yangi belgilarni oching.', 'Изучайте уроки, проходите мини-тесты и открывайте новые награды.', 'Study lessons, take quizzes, and unlock new achievements.')}</p>
          </div>
          {user && <span className="text-xs text-slate-500">Dars: +20 XP · Testdagi har to‘g‘ri javob: +10 XP</span>}
        </div>
        {error && <p role="alert" className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{error}</p>}
        {user && loading ? <p className="mt-6 text-sm text-slate-400">{tr('Natijalar yuklanmoqda…', 'Загрузка результатов…', 'Loading results…')}</p> : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map(achievement => (
              <article key={achievement.id} className={`rounded-2xl border p-5 ${achievement.unlocked ? 'border-amber-300/25 bg-amber-300/[0.06]' : 'border-white/10 bg-white/[0.025] opacity-70'}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${achievement.unlocked ? 'bg-amber-300/15' : 'bg-white/5 grayscale'}`}>{achievement.unlocked ? '🏆' : '🔒'}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${achievement.unlocked ? 'text-amber-200' : 'text-slate-500'}`}>{achievement.unlocked ? tr('Ochildi', 'Открыто', 'Unlocked') : tr('Yopiq', 'Закрыто', 'Locked')}</span>
                </div>
                <h3 className="mt-4 font-semibold text-white">{achievement.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-400">{achievement.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/courses" className="rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-3 text-sm font-semibold text-white">{tr('Kurslarga o‘tish', 'Перейти к курсам', 'Go to courses')} →</Link>
        <Link href="/projects" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-300 hover:border-white/30">{tr('Loyihalarni ko‘rish', 'Смотреть проекты', 'View projects')}</Link>
      </div>
    </main>
  );
}
