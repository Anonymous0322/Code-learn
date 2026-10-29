'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/components/providers';
import { useLearningExtrasStore } from '@/store/learningExtrasStore';

interface LessonToolsProps {
  courseId: string;
  lessonId: string;
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
}

const copy = {
  uz: { saved: 'Darsni saqlash', unsave: 'Saqlanganlardan olib tashlash', note: 'Shaxsiy qayd', placeholder: 'Dars bo‘yicha o‘z qaydingiz...', saveNote: 'Qaydni saqlash', feedback: 'Dars haqida fikr yoki xato yuborish', feedbackPlaceholder: 'Nimani yaxshilash yoki tuzatish kerakligini yozing...', send: 'Yuborish', login: 'Bu imkoniyatdan foydalanish uchun tizimga kiring.', success: 'Muvaffaqiyatli saqlandi.', sent: 'Fikringiz yuborildi. Rahmat!', feedbackTitle: 'Fikr yuborish', error: 'Amalni bajarib bo‘lmadi. Internetni tekshirib qayta urinib ko‘ring.' },
  ru: { saved: 'Сохранить урок', unsave: 'Убрать из сохранённых', note: 'Личная заметка', placeholder: 'Ваша заметка к уроку...', saveNote: 'Сохранить заметку', feedback: 'Сообщить об ошибке или предложить улучшение', feedbackPlaceholder: 'Опишите, что нужно исправить или улучшить...', send: 'Отправить', login: 'Войдите, чтобы пользоваться этой функцией.', success: 'Успешно сохранено.', sent: 'Отзыв отправлен. Спасибо!', feedbackTitle: 'Отправить отзыв', error: 'Не удалось выполнить действие. Проверьте интернет и попробуйте снова.' },
  en: { saved: 'Save lesson', unsave: 'Remove from saved', note: 'Personal note', placeholder: 'Your note about this lesson...', saveNote: 'Save note', feedback: 'Report an issue or suggest an improvement', feedbackPlaceholder: 'Describe what should be corrected or improved...', send: 'Send', login: 'Sign in to use this feature.', success: 'Saved successfully.', sent: 'Feedback sent. Thank you!', feedbackTitle: 'Send feedback', error: 'The action failed. Check your connection and try again.' },
} as const;

export function LessonTools({ courseId, lessonId, courseSlug, lessonSlug, lessonTitle }: LessonToolsProps) {
  const user = useAuthStore(state => state.currentUser);
  const { language } = useI18n();
  const text = copy[language as keyof typeof copy] || copy.en;
  const initialize = useLearningExtrasStore(state => state.initialize);
  const syncError = useLearningExtrasStore(state => state.syncError);
  const saveLesson = useLearningExtrasStore(state => state.saveLesson);
  const submitFeedback = useLearningExtrasStore(state => state.submitFeedback);
  const entry = useLearningExtrasStore(state => state.savedLessons[`${courseId}__${lessonId}`]);
  const [note, setNote] = useState(entry?.note || '');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { initialize(user?.id || null); }, [initialize, user?.id]);
  useEffect(() => { setNote(entry?.note || ''); }, [entry?.note, courseId, lessonId]);

  const handleSave = async (saved: boolean) => {
    if (!user) { setError(text.login); return; }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await saveLesson(courseId, lessonId, saved, note);
      setMessage(text.success);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : text.error);
    } finally {
      setBusy(false);
    }
  };

  const handleFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) { setError(text.login); return; }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await submitFeedback(courseId, lessonId, lessonTitle, feedback);
      setFeedback('');
      setMessage(text.sent);
    } catch (feedbackError) {
      setError(feedbackError instanceof Error ? feedbackError.message : text.error);
    } finally {
      setBusy(false);
    }
  };

  return <section className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-2 sm:p-5">
    <div>
      <h2 className="text-sm font-semibold text-white">{text.note}</h2>
      <textarea value={note} onChange={event => setNote(event.target.value)} maxLength={2000} rows={4} placeholder={text.placeholder} disabled={!user || busy} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#060914] p-3 text-sm text-white placeholder:text-slate-500 focus:border-neon-cyan focus:outline-none disabled:opacity-60" />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => void handleSave(Boolean(entry?.saved))} disabled={!user || busy} className="rounded-lg border border-neon-cyan/30 px-3 py-2 text-xs font-semibold text-neon-cyan disabled:opacity-50">{text.saveNote}</button>
        <button type="button" onClick={() => void handleSave(!entry?.saved)} disabled={!user || busy} aria-pressed={Boolean(entry?.saved)} className="rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{entry?.saved ? `★ ${text.unsave}` : `☆ ${text.saved}`}</button>
      </div>
      {entry?.saved && <p className="mt-2 text-xs text-emerald-300" role="status">{text.success}</p>}
    </div>
    <form onSubmit={handleFeedback}>
      <label htmlFor={`lesson-feedback-${lessonId}`} className="text-sm font-semibold text-white">{text.feedback}</label>
      <textarea id={`lesson-feedback-${lessonId}`} value={feedback} onChange={event => setFeedback(event.target.value)} minLength={8} maxLength={2000} rows={4} required placeholder={text.feedbackPlaceholder} disabled={!user || busy} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#060914] p-3 text-sm text-white placeholder:text-slate-500 focus:border-neon-cyan focus:outline-none disabled:opacity-60" />
      <button type="submit" disabled={!user || busy || feedback.trim().length < 8} className="mt-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-neon-cyan/40 disabled:opacity-50">{busy ? '…' : text.send}</button>
      {!user && <p className="mt-2 text-xs text-slate-500">{text.login} <a href={`/auth/login?next=/learn/${courseSlug}/${lessonSlug}`} className="text-neon-cyan underline">{language === 'uz' ? 'Kirish' : language === 'ru' ? 'Войти' : 'Sign in'}</a></p>}
    </form>
    {(message || error) && <p role={error ? 'alert' : 'status'} className={`sm:col-span-2 text-sm ${error ? 'text-amber-200' : 'text-emerald-300'}`}>{error || message}</p>}
    {syncError && <p role="alert" className="sm:col-span-2 text-xs text-amber-200">{syncError}</p>}
  </section>;
}
