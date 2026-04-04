'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordMismatch',
    path: ['confirmPassword'],
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations('auth');
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already')) {
        setServerError('Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an.');
      } else if (error.message.toLowerCase().includes('password')) {
        setServerError('Das Passwort erfüllt nicht die Mindestanforderungen.');
      } else {
        setServerError(t('errors.generic'));
      }
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">E-Mail bestätigen</h2>
          <p className="mb-6 text-sm text-zinc-500">{t('successRegister')}</p>
          <Link href="/auth/login" className="text-sm font-medium text-orange-500 hover:text-orange-600">
            {t('loginLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">{t('registerTitle')}</h1>
          <p className="mt-1 text-sm text-zinc-500">Kostenloses Konto erstellen</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('email')}</label>
            <input
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{t('errors.invalidEmail')}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('password')}</label>
            <input
              type="password"
              autoComplete="new-password"
              {...register('password')}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{t('errors.minPassword')}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('confirmPassword')}</label>
            <input
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{t('errors.passwordMismatch')}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Wird registriert…' : t('registerButton')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {t('hasAccount')}{' '}
          <Link href="/auth/login" className="font-medium text-orange-500 hover:text-orange-600">
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
