'use client';

import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useI18n } from '@/components/providers';

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="premium-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center"><Link href="/" className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-neon-cyan/40 bg-neon-blue/15 font-mono text-sm font-bold text-neon-cyan">&lt;/&gt;</Link><h1 className="font-[Space_Grotesk] text-3xl font-semibold text-white">{t('registerTitle')}</h1><p className="mt-2 text-sm text-slate-400">{t('registerSubtitle')}</p></div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-slate-500">{t('registerAlready')} <Link href="/auth/login" className="text-neon-cyan hover:text-white">{t('registerSignIn')}</Link></p>
      </div>
    </div>
  );
}
