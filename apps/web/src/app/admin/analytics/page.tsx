'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { useI18n } from '@/components/providers';

interface AnalyticsSummaryRow {
  event_type: string;
  event_count: number;
  learner_count: number;
}

const eventLabels: Record<string, [string, string, string]> = {
  signup: ['Ro‘yxatdan o‘tish', 'Регистрация', 'Signups'],
  lesson_started: ['Dars boshlash', 'Начало урока', 'Lessons started'],
  lesson_completed: ['Dars yakunlash', 'Завершение урока', 'Lessons completed'],
  weekly_return: ['Haftalik qaytish', 'Возврат за неделю', 'Weekly returns'],
  course_completed: ['Kursni tugatish', 'Завершение курса', 'Courses completed'],
};

export default function AdminAnalyticsPage() {
  const { tr } = useI18n();
  const [rows, setRows] = useState<AnalyticsSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const { data, error: resultError } = await getSupabase().rpc('get_analytics_summary');
        if (resultError) throw resultError;
        if (!active) return;
        setRows((data || []) as AnalyticsSummaryRow[]);
      } catch (caught) {
        console.error('Analitika ko‘rsatkichlarini yuklab bo‘lmadi.', caught);
        if (active) setError(tr('Analitikani yuklab bo‘lmadi. Migratsiya va admin huquqini tekshiring.', 'Не удалось загрузить аналитику. Проверьте миграцию и права администратора.', 'Could not load analytics. Check the migration and administrator access.'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [tr]);

  return <section className="mx-auto max-w-5xl space-y-6">
    <header><h1 className="text-3xl font-bold text-white">{tr('Maxfiy analitika', 'Аналитика', 'Privacy-friendly analytics')}</h1><p className="mt-2 text-sm text-slate-400">{tr('Faqat rozilik bergan foydalanuvchilardan, oxirgi 30 kun. Shaxsiy yozuvlar ko‘rsatilmaydi.', 'Только пользователи, давшие согласие; последние 30 дней. Личные записи не отображаются.', 'Last 30 days, consented users only. No individual records are shown.')}</p></header>
    {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
    {loading ? <p className="text-sm text-slate-400">{tr('Yuklanmoqda…', 'Загрузка…', 'Loading…')}</p> : !error && <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(eventLabels).map(([event, labels]) => {
        const row = rows.find(item => item.event_type === event);
        return <article key={event} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <h2 className="text-sm font-semibold text-slate-200">{tr(...labels)}</h2>
          <p className="mt-3 text-3xl font-bold text-white">{row?.event_count ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">{tr('hodisa ·', 'событий ·', 'events ·')} {row?.learner_count ?? 0} {tr('foydalanuvchi', 'пользователей', 'learners')}</p>
        </article>;
      })}
    </div>}
  </section>;
}
