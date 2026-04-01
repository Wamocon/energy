import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/LogoutButton';
import type { ProjectStatus } from '@/lib/db/types';

const statusColours: Record<ProjectStatus, string> = {
  new: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  completed: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400',
};

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: project } = await supabase
    .from('projects')
    .select('*, buildings(*)')
    .eq('id', id)
    .eq('berater_id', user.id)
    .single();

  if (!project) notFound();

  const building = project.buildings?.[0] ?? null;
  const t = await getTranslations('project.detail');
  const tDash = await getTranslations('dashboard');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Dashboard
            </Link>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">⚡ Energieberater</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Title + Status */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {project.customer_name}
            </h1>
            <p className="text-sm text-zinc-500">
              {project.address}, {project.postal_code} {project.city}
            </p>
          </div>
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              statusColours[project.status as ProjectStatus]
            }`}
          >
            {tDash(`status.${project.status}`)}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Project info */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">{t('info')}</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">{t('customer')}</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{project.customer_name}</dd>
              </div>
              {project.customer_email && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">E-Mail</dt>
                  <dd className="text-zinc-900 dark:text-zinc-50">{project.customer_email}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-zinc-500">{t('address')}</dt>
                <dd className="text-right text-zinc-900 dark:text-zinc-50">
                  {project.address}
                  <br />
                  {project.postal_code} {project.city}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">{t('created')}</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">
                  {new Date(project.created_at).toLocaleDateString('de-DE')}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">Aktionen</h2>
            <div className="flex flex-col gap-3">
              <Link
                href={`/dashboard/projects/${project.id}/inspection`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <span>🔍 {building ? t('inspectionEdit') : t('inspection')}</span>
                <span className="text-zinc-400">→</span>
              </Link>
              <Link
                href={`/dashboard/projects/${project.id}/photos`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <span>📷 {t('photos')}</span>
                <span className="text-zinc-400">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Building summary (if inspection done) */}
        {building && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">Gebäude-Übersicht</h2>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {building.building_type && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Typ</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-50">{building.building_type}</dd>
                </div>
              )}
              {building.year_built && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Baujahr</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-50">{building.year_built}</dd>
                </div>
              )}
              {building.living_area && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Wohnfläche</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-50">{building.living_area} m²</dd>
                </div>
              )}
              {building.heating_type && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Heizung</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-50">{building.heating_type}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </main>
    </div>
  );
}
