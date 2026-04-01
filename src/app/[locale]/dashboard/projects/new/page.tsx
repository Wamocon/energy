'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

const newProjectSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(1),
  city: z.string().min(1),
  postal_code: z.string().min(4),
});

type NewProjectData = z.infer<typeof newProjectSchema>;

export default function NewProjectPage() {
  const t = useTranslations('project.new');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewProjectData>({ resolver: zodResolver(newProjectSchema) });

  async function onSubmit(data: NewProjectData) {
    setServerError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        berater_id: user.id,
        customer_name: data.customer_name,
        customer_email: data.customer_email || null,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        status: 'new',
      })
      .select()
      .single();

    if (error || !project) {
      setServerError(error?.message ?? t('unknownError'));
      return;
    }

    router.push(`/dashboard/projects/${project.id}`);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <Link
            href="/dashboard"
            className="mr-4 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← {t('backToDashboard')}
          </Link>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">⚡ Energieberater</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t('title')}</h1>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
                {serverError}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('customerName')}
                </label>
                <input
                  type="text"
                  {...register('customer_name')}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
                {errors.customer_name && (
                  <p className="mt-1 text-xs text-red-600">{t('required')}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('customerEmail')}
                </label>
                <input
                  type="email"
                  {...register('customer_email')}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
                {errors.customer_email && (
                  <p className="mt-1 text-xs text-red-600">{t('invalidEmail')}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('address')}
                </label>
                <input
                  type="text"
                  placeholder="Musterstraße 1"
                  {...register('address')}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600">Pflichtfeld</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('postalCode')}
                </label>
                <input
                  type="text"
                  placeholder="12345"
                  {...register('postal_code')}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
                {errors.postal_code && (
                  <p className="mt-1 text-xs text-red-600">Pflichtfeld</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('city')}
                </label>
                <input
                  type="text"
                  placeholder="Berlin"
                  {...register('city')}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">Pflichtfeld</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isSubmitting ? `${t('submit')}...` : t('submit')}
              </button>
              <Link
                href="/dashboard"
                className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {t('cancel')}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
