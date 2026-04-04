import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { ClipboardList, Camera, CheckCircle2, ArrowRight, User, MapPin, Calendar, Building2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { ProjectStatus } from '@/lib/db/types';

const statusColours: Record<ProjectStatus, string> = {
  new: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-amber-50 text-amber-700',
  completed: 'bg-green-50 text-green-700',
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

  const { count: photoCount } = await supabase
    .from('project_photos')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', id);

  const building = project.buildings?.[0] ?? null;
  const hasPhotos = (photoCount ?? 0) > 0;
  const t = await getTranslations('project.detail');
  const tDash = await getTranslations('dashboard');

  // Workflow steps
  const steps = [
    { label: 'Projekt angelegt', done: true, icon: <Building2 size={16} /> },
    { label: 'Begehung', done: !!building, icon: <ClipboardList size={16} /> },
    { label: 'Fotos', done: hasPhotos, icon: <Camera size={16} /> },
    { label: 'Abgeschlossen', done: project.status === 'completed', icon: <CheckCircle2 size={16} /> },
  ];

  const nextStep = steps.find((s) => !s.done);

  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumbs items={[{ label: 'Projekte', href: '/dashboard' }, { label: project.customer_name }]} />

      {/* Title + Status */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{project.customer_name}</h1>
          <p className="mt-0.5 text-sm text-zinc-500">{project.address}, {project.postal_code} {project.city}</p>
        </div>
        <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${statusColours[project.status as ProjectStatus]}`}>
          {tDash(`status.${project.status}`)}
        </span>
      </div>

      {/* Workflow tracker */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">Projektfortschritt</p>
        <div className="relative flex items-center justify-between">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-4 h-px bg-zinc-200" />
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center gap-2 text-center">
              <div
                className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  step.done
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-zinc-300 bg-white text-zinc-400'
                }`}
              >
                {step.done ? <CheckCircle2 size={14} /> : step.icon}
              </div>
              <span className={`text-xs font-medium ${step.done ? 'text-zinc-700' : 'text-zinc-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        {nextStep && (
          <div className="mt-4 rounded-lg bg-orange-50 px-4 py-3 text-sm text-orange-700">
            <strong>NÃ¤chster Schritt:</strong>{' '}
            {nextStep.label === 'Begehung' && (
              <Link href={`/dashboard/projects/${project.id}/inspection`} className="font-semibold underline underline-offset-2">
                Begehungsformular Ã¶ffnen
              </Link>
            )}
            {nextStep.label === 'Fotos' && (
              <Link href={`/dashboard/projects/${project.id}/photos`} className="font-semibold underline underline-offset-2">
                Fotos hochladen
              </Link>
            )}
            {nextStep.label === 'Abgeschlossen' && <span>Projekt auf â€žAbgeschlossen&rdquo; setzen</span>}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Project info */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">{t('info')}</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <User size={15} className="mt-0.5 shrink-0 text-zinc-400" />
              <div>
                <dt className="text-zinc-500">{t('customer')}</dt>
                <dd className="font-medium text-zinc-900">{project.customer_name}</dd>
              </div>
            </div>
            {project.customer_email && (
              <div className="flex items-start gap-3">
                <User size={15} className="mt-0.5 shrink-0 text-zinc-400" />
                <div>
                  <dt className="text-zinc-500">E-Mail</dt>
                  <dd className="text-zinc-900">{project.customer_email}</dd>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin size={15} className="mt-0.5 shrink-0 text-zinc-400" />
              <div>
                <dt className="text-zinc-500">{t('address')}</dt>
                <dd className="text-zinc-900">{project.address}, {project.postal_code} {project.city}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={15} className="mt-0.5 shrink-0 text-zinc-400" />
              <div>
                <dt className="text-zinc-500">{t('created')}</dt>
                <dd className="text-zinc-900">{new Date(project.created_at).toLocaleDateString('de-DE')}</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Actions */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">Aktionen</h2>
          <div className="flex flex-col gap-2">
            <Link
              href={`/dashboard/projects/${project.id}/inspection`}
              className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            >
              <span className="flex items-center gap-2.5">
                <ClipboardList size={16} className="text-zinc-400" />
                {building ? t('inspectionEdit') : t('inspection')}
              </span>
              <ArrowRight size={15} className="text-zinc-400" />
            </Link>
            <Link
              href={`/dashboard/projects/${project.id}/photos`}
              className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            >
              <span className="flex items-center gap-2.5">
                <Camera size={16} className="text-zinc-400" />
                {t('photos')}
                {hasPhotos && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">{photoCount}</span>}
              </span>
              <ArrowRight size={15} className="text-zinc-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Building summary */}
      {building && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-zinc-900">GebÃ¤ude-Ãœbersicht</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {building.building_type && (
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <dt className="text-zinc-500">GebÃ¤udetyp</dt>
                <dd className="font-medium text-zinc-900">{building.building_type}</dd>
              </div>
            )}
            {building.year_built && (
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <dt className="text-zinc-500">Baujahr</dt>
                <dd className="font-medium text-zinc-900">{building.year_built}</dd>
              </div>
            )}
            {building.living_area && (
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <dt className="text-zinc-500">WohnflÃ¤che</dt>
                <dd className="font-medium text-zinc-900">{building.living_area} mÂ²</dd>
              </div>
            )}
            {building.heating_type && (
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <dt className="text-zinc-500">Heizung</dt>
                <dd className="font-medium text-zinc-900">{building.heating_type}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
