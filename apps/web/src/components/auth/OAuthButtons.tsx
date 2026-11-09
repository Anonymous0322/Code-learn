'use client';

import { useState } from 'react';
import { useI18n } from '@/components/providers';
import { useAuthStore, type OAuthProvider } from '@/store/authStore';
import { getPostAuthDestination } from '@/lib/postAuthDestination';

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.58-4.1H3.08v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.42 13.94A6.02 6.02 0 0 1 6.1 12c0-.67.12-1.32.32-1.94v-2.6H3.08A10 10 0 0 0 2 12c0 1.63.39 3.17 1.08 4.54l3.34-2.6Z" />
      <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.82 1.5l2.87-2.86C16.95 2.98 14.7 2 12 2a10 10 0 0 0-8.92 5.46l3.34 2.6C7.2 7.7 9.4 5.96 12 5.96Z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.01-.7.08-.69.08-.69 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.6 1.2 3.23.91.1-.72.39-1.2.7-1.48-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.61 5.23-5.1 5.51.4.34.75 1 .75 2.03v3.16c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

export function OAuthButtons() {
  const { tr } = useI18n();
  const signInWithOAuth = useAuthStore(state => state.signInWithOAuth);
  const [busyProvider, setBusyProvider] = useState<OAuthProvider | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startOAuth = async (provider: OAuthProvider) => {
    setBusyProvider(provider);
    setErrorMessage(null);
    const result = await signInWithOAuth(provider, getPostAuthDestination('/courses'));
    if (!result.success) {
      setBusyProvider(null);
      setErrorMessage(result.message || tr('Kirish amalga oshmadi.', 'Не удалось войти.', 'Sign-in could not be started.'));
    }
  };

  const buttonClassName = 'group flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.08] hover:shadow-[0_8px_24px_rgba(34,211,238,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-wait disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none';

  return (
    <div className="mt-5">
      <div className="relative mb-4 py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0a0e1a] px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
            {tr('yoki', 'или', 'or')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={busyProvider !== null}
        onClick={() => void startOAuth('google')}
        className={buttonClassName}
      >
        {busyProvider === 'google'
          ? <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-slate-500 border-t-white" />
          : <GoogleMark />}
        <span>Google</span>
      </button>
      <button
        type="button"
        disabled={busyProvider !== null}
        onClick={() => void startOAuth('github')}
        className={buttonClassName}
      >
        {busyProvider === 'github'
          ? <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-slate-500 border-t-white" />
          : <GitHubMark />}
        <span>GitHub</span>
      </button>
      </div>
      {errorMessage && (
        <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/[0.08] px-3 py-2 text-center text-xs text-rose-200">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
