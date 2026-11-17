'use client';

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@/components/providers';
import { getSupabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

const choices = [
  { code: 'uz', label: 'O‘zbekcha' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
] as const;

export default function SettingsPage() {
  const { language, setLanguage, tr, analyticsConsent, setAnalyticsConsent } = useI18n();
  const user = useAuthStore(state => state.currentUser);
  const [deletionDate, setDeletionDate] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const loadDeletionRequest = useCallback(async () => {
    if (!user) return;
    const { data, error: requestError } = await getSupabase()
      .from('account_deletion_requests')
      .select('delete_after')
      .eq('user_id', user.id)
      .maybeSingle();
    if (requestError) throw requestError;
    setDeletionDate(data?.delete_after || null);
  }, [user]);

  useEffect(() => {
    void loadDeletionRequest().catch(caught => {
      console.error('Hisobni o‘chirish so‘rovini yuklab bo‘lmadi.', caught);
      setError(tr('Hisob holatini yuklab bo‘lmadi.', 'Не удалось загрузить статус аккаунта.', 'Could not load account status.'));
    });
  }, [loadDeletionRequest, tr]);

  const exportData = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const { data, error: exportError } = await getSupabase().rpc('export_my_data');
      if (exportError) throw exportError;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `codehub-data-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage(tr('Ma’lumotlar JSON faylida yuklab olindi.', 'Данные скачаны в JSON-файле.', 'Your data was downloaded as a JSON file.'));
    } catch (caught) {
      console.error('Ma’lumot eksport qilinmadi.', caught);
      setError(tr('Ma’lumotlarni eksport qilib bo‘lmadi.', 'Не удалось экспортировать данные.', 'Could not export your data.'));
    } finally {
      setBusy(false);
    }
  };

  const requestDeletion = async () => {
    if (!window.confirm(tr('Hisobingizni o‘chirishni so‘raysizmi? 30 kun ichida bekor qilishingiz mumkin.', 'Запросить удаление аккаунта? В течение 30 дней его можно отменить.', 'Request account deletion? You can cancel within 30 days.'))) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const { data, error: requestError } = await getSupabase().rpc('request_account_deletion');
      if (requestError) throw requestError;
      setDeletionDate(data);
      setMessage(tr('So‘rov saqlandi. Hisob 30 kundan keyin o‘chiriladi.', 'Запрос сохранён. Аккаунт будет удалён через 30 дней.', 'Request saved. Your account is scheduled for deletion in 30 days.'));
    } catch (caught) {
      console.error('Hisobni o‘chirish so‘rovi saqlanmadi.', caught);
      setError(tr('So‘rovni saqlab bo‘lmadi. Keyinroq qayta urinib ko‘ring.', 'Не удалось сохранить запрос. Попробуйте позже.', 'Could not save your request. Please try again later.'));
    } finally {
      setBusy(false);
    }
  };

  const cancelDeletion = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const { error: cancelError } = await getSupabase().rpc('cancel_account_deletion');
      if (cancelError) throw cancelError;
      setDeletionDate(null);
      setMessage(tr('Hisobni o‘chirish bekor qilindi.', 'Удаление аккаунта отменено.', 'Account deletion was cancelled.'));
    } catch (caught) {
      console.error('Hisobni o‘chirish bekor qilinmadi.', caught);
      setError(tr('Bekor qilib bo‘lmadi. Keyinroq qayta urinib ko‘ring.', 'Не удалось отменить. Попробуйте позже.', 'Could not cancel. Please try again later.'));
    } finally {
      setBusy(false);
    }
  };

  const updateConsent = async (enabled: boolean) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await setAnalyticsConsent(enabled);
      setMessage(enabled
        ? tr('Analitika yoqildi.', 'Аналитика включена.', 'Analytics is enabled.')
        : tr('Analitika o‘chirildi va avvalgi analitika hodisalari o‘chirildi.', 'Аналитика отключена, прежние события удалены.', 'Analytics is disabled and prior analytics events were deleted.'));
    } catch {
      setError(tr('Rozilikni saqlab bo‘lmadi.', 'Не удалось сохранить согласие.', 'Could not save your consent.'));
    } finally {
      setBusy(false);
    }
  };

  return <main className="mx-auto max-w-3xl space-y-6 px-5 py-12 sm:px-8">
    <h1 className="font-[Space_Grotesk] text-4xl font-semibold text-white">{tr('Sozlamalar', 'Настройки', 'Settings')}</h1>
    {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
    {message && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">{message}</p>}
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <h2 className="font-semibold text-white">{tr('Sayt tili', 'Язык сайта', 'Site language')}</h2>
      <p className="mt-1 text-sm text-slate-400">{tr('Interfeys tilini tanlang.', 'Выберите язык интерфейса.', 'Choose the interface language.')}</p>
      <div className="mt-4 flex flex-wrap gap-2">{choices.map(choice => <button key={choice.code} type="button" aria-pressed={language === choice.code} onClick={() => setLanguage(choice.code)} className={`rounded-lg border px-4 py-2 text-sm ${language === choice.code ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-white/15 text-slate-300 hover:border-white/30'}`}>{choice.label}</button>)}</div>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <h2 className="font-semibold text-white">{tr('Maxfiylik va analitika', 'Конфиденциальность и аналитика', 'Privacy and analytics')}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-400">{tr('Ixtiyoriy analitika rozilikdan keyin o‘quv hodisalarini yig‘adi. Ism va email yozilmaydi; takrorlarni hisoblash uchun psevdonim kalit ishlatiladi. Tanlovni istalgan vaqtda o‘zgartirishingiz mumkin.', 'Необязательная аналитика собирает события обучения только с вашего согласия. Имя и email не сохраняются; для подсчёта повторов используется псевдонимный ключ.', 'Optional analytics collects learning events only with your consent. Names and emails are not stored; a pseudonymous key is used to count repeat activity.')}</p>
      <p className="mt-3 text-xs text-slate-500">{tr('Joriy holat:', 'Текущий статус:', 'Current status:')} {analyticsConsent === null ? tr('Tanlanmagan', 'Не выбрано', 'Not set') : analyticsConsent ? tr('Yoqilgan', 'Включена', 'Enabled') : tr('O‘chirilgan', 'Отключена', 'Disabled')}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button disabled={busy || analyticsConsent === true} onClick={() => void updateConsent(true)} className="rounded-lg bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:opacity-50">{tr('Roziman', 'Разрешить', 'Allow')}</button>
        <button disabled={busy || analyticsConsent === false} onClick={() => void updateConsent(false)} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-50">{tr('Rozilikni bekor qilish', 'Отозвать согласие', 'Revoke consent')}</button>
      </div>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <h2 className="font-semibold text-white">{tr('Ma’lumotlaringiz', 'Ваши данные', 'Your data')}</h2>
      <p className="mt-1 text-sm text-slate-400">{tr('Profil, o‘quv jarayoni va boshqa shaxsiy ma’lumotlaringiz nusxasini JSON formatida yuklab oling.', 'Скачайте копию профиля, прогресса обучения и других личных данных в формате JSON.', 'Download a JSON copy of your profile, learning progress, and other personal data.')}</p>
      <button disabled={busy} onClick={() => void exportData()} className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.06] disabled:opacity-50">{busy ? tr('Bajarilmoqda…', 'Выполняется…', 'Working…') : tr('Ma’lumotlarni yuklab olish', 'Скачать данные', 'Download my data')}</button>
    </section>

    <section id="account-deletion" className="scroll-mt-24 rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-6">
      <h2 className="font-semibold text-white">{tr('Hisobni o‘chirish', 'Удаление аккаунта', 'Delete account')}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-400">{tr('So‘rov yuborilgach, hisobingiz 30 kundan keyin o‘chiriladi. Shu muddat ichida so‘rovni bekor qilishingiz mumkin.', 'После запроса аккаунт будет удалён через 30 дней. До этого срока запрос можно отменить.', 'After a request, your account is deleted in 30 days. You can cancel it before then.')}</p>
      {deletionDate && <p className="mt-3 text-sm text-amber-200">{tr('Rejalashtirilgan sana:', 'Дата удаления:', 'Scheduled for:')} {new Date(deletionDate).toLocaleString()}</p>}
      {deletionDate
        ? <button disabled={busy} onClick={() => void cancelDeletion()} className="mt-4 rounded-lg border border-amber-300/20 px-4 py-2 text-sm font-semibold text-amber-100 disabled:opacity-50">{tr('O‘chirish so‘rovini bekor qilish', 'Отменить запрос', 'Cancel deletion request')}</button>
        : <button disabled={busy} onClick={() => void requestDeletion()} className="mt-4 rounded-lg border border-rose-300/20 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-400/10 disabled:opacity-50">{tr('Hisobni o‘chirishni so‘rash', 'Запросить удаление аккаунта', 'Request account deletion')}</button>}
    </section>
  </main>;
}
