'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/components/providers';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Ism kamida 2 belgidan iborat bo\'lishi kerak'),
  email: z.string().email('Noto\'g\'ri email formati'),
  password: z.string().min(6, 'Parol kamida 6 belgidan iborat bo\'lishi kerak'),
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { t } = useI18n();
  const { register: registerUser, resendConfirmation } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

  const localizedSchema = RegisterSchema.extend({
    name: z.string().min(2, t('nameMin')),
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(6, t('passwordMin')),
  });
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(localizedSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setConfirmationEmail(null);

    const res = await registerUser(data.name, data.email, data.password);
    setLoading(false);

    if (res.success) {
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser?.email.toLowerCase() === data.email.trim().toLowerCase()) {
        if (currentUser.role === 'creator' || currentUser.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/courses');
        }
      } else {
        setSuccessMsg(res.message || 'Hisob yaratildi. Emailingizni tasdiqlang.');
        setConfirmationEmail(data.email);
      }
    } else {
      setErrorMsg(res.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
    }
  };

  const handleResendConfirmation = async () => {
    if (!confirmationEmail) return;
    setResending(true);
    setErrorMsg(null);
    const result = await resendConfirmation(confirmationEmail);
    setResending(false);
    if (result.success) {
      setSuccessMsg(result.message);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-glass border border-border-subtle rounded-xl p-8 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">{t('registerFormTitle')}</h2>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
            {successMsg}
          </div>
        )}
        {confirmationEmail && (
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={resending}
            className="mb-4 w-full text-center text-xs text-neon-cyan hover:text-white disabled:opacity-50"
          >
            {resending ? 'Xat yuborilmoqda...' : 'Tasdiqlash xatini qayta yuborish'}
          </button>
        )}


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">{t('fullNameLabel')}</label>
            <input
              {...register('name')}
              type="text"
              placeholder="Ismingizni kiriting"
              className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:border-neon-blue focus:outline-none transition-colors text-sm"
            />
            {errors.name && <p className="text-neon-pink text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">{t('emailLabel')}</label>
            <input
              {...register('email')}
              type="email"
              placeholder="emailingizni kiriting"
              className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:border-neon-blue focus:outline-none transition-colors text-sm"
            />
            {errors.email && <p className="text-neon-pink text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">{t('passwordLabel')}</label>
            <input
              {...register('password')}
              type="password"
              placeholder="Kamida 6 belgi"
              className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:border-neon-blue focus:outline-none transition-colors text-sm"
            />
            {errors.password && <p className="text-neon-pink text-xs mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('submittingRegister') : t('submitRegister')}
          </Button>
        </form>
      </div>
    </div>
  );
}
