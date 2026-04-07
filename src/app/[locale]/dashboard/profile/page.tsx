'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useToast } from '@/components/Toast';
import type { Profile } from '@/lib/db/types';

type ProfileFormData = {
  name: string;
  phone: string;
  company: string;
  cert_number: string;
};

const inputCls =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400';
const labelCls = 'mb-1.5 block text-sm font-medium text-zinc-700';

export default function ProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileFormData>();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        reset({
          name: data.name ?? '',
          phone: data.phone ?? '',
          company: data.company ?? '',
          cert_number: (data as Profile & { cert_number?: string }).cert_number ?? '',
        });
      } else {
        // Profile row missing (registered before trigger was set up) — create it now
        await supabase.from('profiles').insert({ id: user.id, email: user.email });
      }
      setLoading(false);
    }
    load();
  }, [reset]);

  async function onSubmit(data: ProfileFormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        name: data.name || null,
        phone: data.phone || null,
        company: data.company || null,
        cert_number: data.cert_number || null,
      })
      .eq('id', user.id);

    if (error) {
      showToast('Fehler beim Speichern', 'error');
    } else {
      showToast('Profil gespeichert', 'success');
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse space-y-4">
        <div className="h-6 w-48 rounded bg-zinc-200" />
        <div className="h-40 rounded-xl bg-zinc-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs items={[{ label: 'Profil' }]} />
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Mein Profil</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-1 font-semibold text-zinc-900">Berater-Angaben</h2>
          <p className="mb-5 text-sm text-zinc-500">
            Diese Daten erscheinen später auf Ihren Beratungsberichten und Dokumenten.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Vollständiger Name</label>
              <input type="text" placeholder="Max Mustermann" {...register('name')} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Firma / Büroname</label>
              <input type="text" placeholder="Energieberatung Mustermann GmbH" {...register('company')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefon</label>
              <input type="tel" placeholder="+49 151 12345678" {...register('phone')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>
                EEE-Zertifikat-Nr.
                <span className="ml-1 text-xs font-normal text-zinc-400">(BAFA-Listennummer)</span>
              </label>
              <input type="text" placeholder="BAFA-EEE-123456" {...register('cert_number')} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-1 font-semibold text-zinc-900">Konto</h2>
          <p className="text-sm text-zinc-500">
            Angemeldet als <span className="font-medium text-zinc-700">{profile?.email ?? '—'}</span>
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            E-Mail-Adresse kann nicht geändert werden.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Wird gespeichert…' : 'Profil speichern'}
        </button>
      </form>
    </div>
  );
}
