'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LessonPlayground } from '@/components/lesson/LessonPlayground';
import { useAuthStore } from '@/store/authStore';
import { DailyChallengeResult, useDailyChallengeStore } from '@/store/dailyChallengeStore';
import { LessonExercise } from '@/store/courseStore';

interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  checks: LessonExercise['checks'];
}

const challenges: Challenge[] = [
  {
    id: 'hello-heading',
    title: 'Salom sarlavhasi',
    description: 'HTML sarlavhasini o‘zgartirib, sahifada kerakli matn paydo qiling.',
    instructions: 'h1 ichidagi matnni “Salom, CodeLearn!” qilib yozing va #intro identifikatorli paragraf qo‘shing.',
    starterCode: '<h1>Bu sarlavhani o‘zgartiring</h1>\n',
    checks: [
      { id: 'heading', label: 'h1 ichida “Salom, CodeLearn!” matni bor', selector: 'h1', type: 'text', expected: 'Salom, CodeLearn!' },
      { id: 'intro', label: '#intro paragrafi yaratildi', selector: 'p#intro', type: 'element' },
    ],
  },
  {
    id: 'skill-list',
    title: 'Ko‘nikmalar ro‘yxati',
    description: 'Tartibli ro‘yxatga HTML va CSS ko‘nikmalarini kiriting.',
    instructions: 'ul elementiga skills identifikatorini bering. Ichida HTML va CSS so‘zlari yozilgan ro‘yxat bandlari bo‘lsin.',
    starterCode: '<ul id="skills">\n  <li>Ko‘nikmani shu yerga yozing</li>\n</ul>',
    checks: [
      { id: 'list', label: '#skills ro‘yxati mavjud', selector: 'ul#skills', type: 'element' },
      { id: 'html-skill', label: 'Ro‘yxatda HTML bor', selector: '#skills', type: 'text', expected: 'HTML' },
      { id: 'css-skill', label: 'Ro‘yxatda CSS bor', selector: '#skills', type: 'text', expected: 'CSS' },
    ],
  },
  {
    id: 'profile-card',
    title: 'Profil kartasi',
    description: 'Ism va qisqa tanishtiruvdan iborat profil kartasi yarating.',
    instructions: 'profile identifikatorli section yarating. Ichiga h2 sarlavha va “Dasturchi” so‘zi bor paragraf qo‘shing.',
    starterCode: '<section id="profile">\n  <!-- Profil ma’lumotlarini shu yerga qo‘shing -->\n</section>',
    checks: [
      { id: 'section', label: '#profile bo‘limi mavjud', selector: 'section#profile', type: 'element' },
      { id: 'name', label: 'Bo‘limda h2 sarlavha bor', selector: '#profile h2', type: 'element' },
      { id: 'role', label: 'Paragrafda “Dasturchi” so‘zi bor', selector: '#profile p', type: 'text', expected: 'Dasturchi' },
    ],
  },
];

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function challengeForDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  const dayIndex = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  return challenges[((dayIndex % challenges.length) + challenges.length) % challenges.length];
}

export default function DailyChallengePage() {
  const user = useAuthStore(state => state.currentUser);
  const initialize = useDailyChallengeStore(state => state.initialize);
  const load = useDailyChallengeStore(state => state.load);
  const save = useDailyChallengeStore(state => state.save);
  const [date] = useState(todayKey);
  const challenge = useMemo(() => challengeForDate(date), [date]);
  const [result, setResult] = useState<DailyChallengeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => { initialize(user?.id || null); }, [initialize, user?.id]);
  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setResult(null);
      return () => { cancelled = true; };
    }
    setLoading(true);
    load(date, user.id)
      .then(saved => { if (!cancelled) setResult(saved?.challengeId === challenge.id ? saved : null); })
      .catch(() => { if (!cancelled) setError('Kunlik mashq natijasini yuklab bo‘lmadi. Internet va Supabase sozlamalarini tekshiring.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [challenge.id, date, load, user]);

  const handleResult = useCallback(async (answer: { passedCount: number; total: number; completed: boolean }) => {
    setError('');
    setSavedMessage('');
    const nextResult: DailyChallengeResult = { date, challengeId: challenge.id, ...answer };
    setResult(nextResult);
    if (!user) return;
    try {
      await save(nextResult, user.id);
      setSavedMessage('Bugungi natija hisobingizga saqlandi.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Kunlik natijani saqlab bo‘lmadi.');
    }
  }, [challenge.id, date, save, user]);

  const exercise = useMemo(() => ({ instructions: challenge.instructions, checks: challenge.checks }), [challenge]);
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#142044] via-[#0d1428] to-[#11102a] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">Har kuni ozgina amaliyot</p>
      <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">Kunlik kod mashqi</h1>
      <p className="mt-3 text-sm text-slate-400">{date} · Bugungi mashq barcha o‘quvchilar uchun bir xil.</p>
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4">
        <h2 className="font-semibold text-white">{challenge.title}</h2>
        <p className="mt-1 text-sm text-slate-300">{challenge.description}</p>
      </div>
    </header>
    {!user && <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">Mashqni sinab ko‘rishingiz mumkin. Natijani saqlash uchun <Link href="/auth/login?next=/challenge" className="underline">tizimga kiring</Link>.</p>}
    {loading && <p className="mt-4 text-sm text-slate-400">Natija yuklanmoqda...</p>}
    {result && <p role="status" className="mt-4 text-sm text-neon-cyan">Natija: {result.passedCount}/{result.total} tekshiruv · {result.completed ? 'mashq bajarildi' : 'yana urinib ko‘ring'}</p>}
    {savedMessage && <p role="status" className="mt-2 text-sm text-emerald-300">{savedMessage}</p>}
    {error && <p role="alert" className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{error}</p>}
    <LessonPlayground editorLanguage="html" starterCode={challenge.starterCode} exercise={exercise} onExerciseResult={handleResult} />
  </main>;
}
