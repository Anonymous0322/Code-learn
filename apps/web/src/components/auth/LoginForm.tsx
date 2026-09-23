'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (_data: LoginForm) => {
    setLoading(true);
    // API call would go here
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-glass border border-border-subtle rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:border-neon-blue focus:outline-none transition-colors"
            />
            {errors.email && <p className="text-neon-pink text-sm mt-1">Invalid email</p>}
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary focus:border-neon-blue focus:outline-none transition-colors"
            />
            {errors.password && <p className="text-neon-pink text-sm mt-1">Password too short</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
