'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/components/providers';

const LoginSchema = z.object({
  email: z.string().email('Noto\'g\'ri email formati'),
  password: z.string().min(6, 'Parol kamida 6 belgidan iborat bo\'lishi kerak'),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { t } = useI18n();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const localizedSchema = LoginSchema.extend({
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(6, t('passwordMin')),
  });
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(localizedSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    const res = await login(data.email, data.password);
    setLoading(false);

    if (res.success) {
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser?.role === 'creator' || currentUser?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/courses');
      }
    } else {
      setErrorMsg(res.message || 'Kirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-glass border border-border-subtle rounded-xl p-8 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">{t('loginFormTitle')}</h2>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">{t('emailLabel')}</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="ruhiddinov03@gmail.com"
              className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:border-neon-blue focus:outline-none transition-colors text-sm"
            />
            {errors.email && <p className="text-neon-pink text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">{t('passwordLabel')}</label>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:border-neon-blue focus:outline-none transition-colors text-sm"
            />
            {errors.password && <p className="text-neon-pink text-xs mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('submittingLogin') : t('submitLogin')}
          </Button>
        </form>
      </div>
    </div>
  );
}
