'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/components/providers';
import { getPostAuthDestination } from '@/lib/postAuthDestination';
import { useAuthStore } from '@/store/authStore';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { tr } = useI18n();
  const currentUser = useAuthStore(state => state.currentUser);
  const initialized = useAuthStore(state => state.initialized);
  const [callbackError, setCallbackError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    setCallbackError(
      params.has('error') ||
      params.has('error_code') ||
      hashParams.has('error') ||
      hashParams.has('error_code')
    );
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const defaultDestination = currentUser.role === 'creator' || currentUser.role === 'admin'
      ? '/admin'
      : '/courses';
    router.replace(getPostAuthDestination(defaultDestination));
  }, [currentUser, router]);

  const failed = callbackError || (initialized && !currentUser);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="premium-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1020]/90 p-8 text-center shadow-2xl">
        {failed ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 text-xl text-rose-200">!</div>
            <h1 className="mt-4 text-xl font-semibold text-white">{tr('Kirish yakunlanmadi', 'Не удалось войти', 'Sign-in did not complete')}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">{tr('Google yoki GitHub orqali kirish amalga oshmadi. Qayta urinib ko‘ring.', 'Не удалось войти через Google или GitHub. Попробуйте ещё раз.', 'Google or GitHub sign-in did not complete. Please try again.')}</p>
            <Link href="/auth/login" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20">
              {tr('Kirish sahifasiga qaytish', 'Вернуться ко входу', 'Back to sign in')}
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
            <h1 className="mt-5 text-lg font-semibold text-white">{tr('Hisobingiz tekshirilmoqda...', 'Проверяем ваш аккаунт...', 'Verifying your account...')}</h1>
            <p className="mt-2 text-sm text-slate-400">{tr('Bir oz kuting.', 'Пожалуйста, подождите.', 'Please wait a moment.')}</p>
          </>
        )}
      </div>
    </main>
  );
}
