'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Home, Building, Building2, Factory } from 'lucide-react';

const BUILDING_TYPES = [
  { value: 'single_family', label: 'Einfamilienhaus', icon: Home },
  { value: 'two_family', label: 'Zweifamilienhaus', icon: Building },
  { value: 'multi_family', label: 'Mehrfamilienhaus', icon: Building2 },
  { value: 'commercial', label: 'Nicht-Wohngebäude', icon: Factory },
] as const;

type BuildingTypeValue = typeof BUILDING_TYPES[number]['value'];

const newProjectSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(1),
  city: z.string().min(1),
  postal_code: z.string().min(4),
  building_type: z.string().min(1, 'Bitte Gebäudetyp wählen'),
});

type NewProjectData = z.infer<typeof newProjectSchema>;

const inputCls = 'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400';
const labelCls = 'mb-1.5 block text-sm font-medium text-zinc-700';

export default function NewProjectPage() {
  const t = useTranslations('project.new');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<BuildingTypeValue | ''>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewProjectData>({ resolver: zodResolver(newProjectSchema) });

  async function onSubmit(data: NewProjectData) {
    setServerError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) { router.push('/auth/login'); return; }

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

    if (error || !project) { setServerError(error?.message ?? t('unknownError')); return; }

    // Create building record with type so it appears in project detail immediately
    await supabase.from('buildings').insert({
      project_id: project.id,
      building_type: data.building_type,
    });

    router.push(`/dashboard/projects/${project.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs items={[{ label: 'Projekte', href: '/dashboard' }, { label: 'Neues Projekt' }]} />

      <h1 className="mb-6 text-2xl font-bold text-zinc-900">{t('title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Building type selector */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-1 font-semibold text-zinc-900">Gebäudetyp *</h2>
          <p className="mb-4 text-sm text-zinc-500">Um welche Art von Gebäude handelt es sich?</p>
          <input type="hidden" {...register('building_type')} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BUILDING_TYPES.map(({ value, label, icon: Icon }) => {
              const active = selectedType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setSelectedType(value); setValue('building_type', value, { shouldValidate: true }); }}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center text-sm font-medium transition-colors ${
                    active
                      ? 'border-orange-400 bg-orange-50 text-orange-700'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <Icon size={24} className={active ? 'text-orange-500' : 'text-zinc-400'} />
                  {label}
                </button>
              );
            })}
          </div>
          {errors.building_type && (
            <p className="mt-2 text-xs text-red-600">{errors.building_type.message}</p>
          )}
        </div>

        {/* Customer + Address */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">Kundendaten</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>{t('customerName')}</label>
              <input type="text" {...register('customer_name')} className={inputCls} />
              {errors.customer_name && <p className="mt-1 text-xs text-red-600">{t('required')}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>{t('customerEmail')}</label>
              <input type="email" {...register('customer_email')} className={inputCls} />
              {errors.customer_email && <p className="mt-1 text-xs text-red-600">{t('invalidEmail')}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">Objektadresse</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>{t('address')}</label>
              <input type="text" placeholder="Musterstraße 1" {...register('address')} className={inputCls} />
              {errors.address && <p className="mt-1 text-xs text-red-600">Pflichtfeld</p>}
            </div>
            <div>
              <label className={labelCls}>{t('postalCode')}</label>
              <input type="text" placeholder="12345" {...register('postal_code')} className={inputCls} />
              {errors.postal_code && <p className="mt-1 text-xs text-red-600">Pflichtfeld</p>}
            </div>
            <div>
              <label className={labelCls}>{t('city')}</label>
              <input type="text" placeholder="Berlin" {...register('city')} className={inputCls} />
              {errors.city && <p className="mt-1 text-xs text-red-600">Pflichtfeld</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Wird erstellt…' : t('submit')}
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            {t('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}


