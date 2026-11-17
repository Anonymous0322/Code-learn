'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { useI18n } from '@/components/providers';

interface ReportRow {
  id: string;
  reporter_id: string;
  post_id: string | null;
  reply_id: string | null;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'other';
  details: string;
  status: 'open' | 'reviewed' | 'dismissed';
  created_at: string;
  content: string;
  hidden: boolean;
}

const reasonText = (reason: ReportRow['reason'], tr: (uz: string, ru: string, en: string) => string) => ({
  spam: tr('Spam', 'Спам', 'Spam'),
  harassment: tr('Haqorat yoki ta’qib', 'Оскорбления или травля', 'Harassment'),
  inappropriate: tr('Nomaqbul kontent', 'Неприемлемый контент', 'Inappropriate content'),
  other: tr('Boshqa', 'Другое', 'Other'),
}[reason]);

export default function AdminReportsPage() {
  const { tr } = useI18n();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: reportsError } = await getSupabase()
        .from('forum_reports')
        .select('id, reporter_id, post_id, reply_id, reason, details, status, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      if (reportsError) throw reportsError;
      const items = data || [];
      const postIds = [...new Set(items.flatMap(item => item.post_id ? [item.post_id] : []))];
      const replyIds = [...new Set(items.flatMap(item => item.reply_id ? [item.reply_id] : []))];
      const [postsResult, repliesResult] = await Promise.all([
        postIds.length ? getSupabase().from('forum_posts').select('id, title, body, is_hidden').in('id', postIds) : Promise.resolve({ data: [], error: null }),
        replyIds.length ? getSupabase().from('forum_replies').select('id, body, is_hidden').in('id', replyIds) : Promise.resolve({ data: [], error: null }),
      ]);
      if (postsResult.error) throw postsResult.error;
      if (repliesResult.error) throw repliesResult.error;
      const postMap = new Map((postsResult.data || []).map(row => [row.id, { content: `${row.title}\n\n${row.body}`, hidden: row.is_hidden }]));
      const replyMap = new Map((repliesResult.data || []).map(row => [row.id, { content: row.body, hidden: row.is_hidden }]));
      setReports(items.map(item => {
        const content = item.post_id ? postMap.get(item.post_id) : item.reply_id ? replyMap.get(item.reply_id) : undefined;
        return { ...item, content: content?.content || tr('Kontent o‘chirilgan.', 'Контент удалён.', 'Content was deleted.'), hidden: content?.hidden || false };
      }));
    } catch (caught) {
      console.error('Forum shikoyatlarini yuklab bo‘lmadi.', caught);
      setError(tr('Shikoyatlarni yuklab bo‘lmadi. Migratsiya va admin huquqini tekshiring.', 'Не удалось загрузить жалобы. Проверьте миграцию и права администратора.', 'Could not load reports. Check the migration and administrator access.'));
    } finally {
      setLoading(false);
    }
  }, [tr]);

  useEffect(() => { void loadReports(); }, [loadReports]);

  const updateReport = async (report: ReportRow, action: 'hide' | 'show' | 'review' | 'dismiss') => {
    setBusy(report.id);
    setError('');
    try {
      if (action === 'hide' || action === 'show') {
        const { error: hideError } = await getSupabase().rpc('set_forum_content_hidden', {
          target_kind: report.post_id ? 'post' : 'reply',
          target_id: report.post_id || report.reply_id,
          should_hide: action === 'hide',
        });
        if (hideError) throw hideError;
      } else {
        const { data: userData, error: userError } = await getSupabase().auth.getUser();
        if (userError) throw userError;
        if (!userData.user) throw new Error('Authentication required.');
        const { error: updateError } = await getSupabase().from('forum_reports').update({
          status: action === 'review' ? 'reviewed' : 'dismissed',
          reviewed_by: userData.user.id,
          reviewed_at: new Date().toISOString(),
        }).eq('id', report.id);
        if (updateError) throw updateError;
      }
      await loadReports();
    } catch (caught) {
      console.error('Forum shikoyati bo‘yicha amal bajarilmadi.', caught);
      setError(tr('Amal bajarilmadi. Ruxsat va internetni tekshiring.', 'Не удалось выполнить действие. Проверьте доступ и подключение.', 'Action failed. Check permissions and your connection.'));
    } finally {
      setBusy(null);
    }
  };

  return <section className="mx-auto max-w-5xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-bold text-white">{tr('Forum shikoyatlari', 'Жалобы форума', 'Forum reports')}</h1><p className="mt-2 text-sm text-slate-400">{tr('Kontentni ko‘rib chiqing, yashiring yoki shikoyatni yoping.', 'Проверяйте контент, скрывайте его или закрывайте жалобы.', 'Review reported content, hide it, or close the report.')}</p></div><button onClick={() => void loadReports()} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200">{tr('Yangilash', 'Обновить', 'Refresh')}</button></header>
    {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
    {loading ? <p className="text-sm text-slate-400">{tr('Yuklanmoqda…', 'Загрузка…', 'Loading…')}</p> : reports.length === 0 ? <p className="rounded-2xl border border-white/10 p-6 text-sm text-slate-400">{tr('Shikoyatlar yo‘q.', 'Жалоб нет.', 'No reports.')}</p> : <div className="space-y-3">
      {reports.map(report => <article key={report.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-amber-200">{reasonText(report.reason, tr)}</span><span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-300">{report.status}</span>{report.hidden && <span className="rounded-full bg-rose-400/10 px-2.5 py-1 text-rose-200">{tr('Yashirilgan', 'Скрыто', 'Hidden')}</span>}</div>
          <time className="text-xs text-slate-500">{new Date(report.created_at).toLocaleString()}</time>
        </div>
        <p className="mt-4 whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/10 p-4 text-sm text-slate-200">{report.content}</p>
        {report.details && <p className="mt-3 text-sm text-slate-400">{tr('Izoh:', 'Комментарий:', 'Details:')} {report.details}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {report.post_id || report.reply_id ? <button disabled={busy === report.id} onClick={() => void updateReport(report, report.hidden ? 'show' : 'hide')} className="rounded-lg border border-rose-300/20 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">{report.hidden ? tr('Kontentni ko‘rsatish', 'Показать контент', 'Unhide content') : tr('Kontentni yashirish', 'Скрыть контент', 'Hide content')}</button> : null}
          {report.status === 'open' && <><button disabled={busy === report.id} onClick={() => void updateReport(report, 'review')} className="rounded-lg border border-cyan-300/20 px-3 py-2 text-xs text-cyan-200 disabled:opacity-50">{tr('Ko‘rib chiqildi', 'Рассмотрено', 'Mark reviewed')}</button><button disabled={busy === report.id} onClick={() => void updateReport(report, 'dismiss')} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-300 disabled:opacity-50">{tr('Yopish', 'Закрыть', 'Dismiss')}</button></>}
        </div>
      </article>)}
    </div>}
  </section>;
}
