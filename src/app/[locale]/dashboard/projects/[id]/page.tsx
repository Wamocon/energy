import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ClipboardList, Camera, CheckCircle2, Building2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { StatusDropdown } from './StatusDropdown';
import { ProjectTabs } from './ProjectTabs';
import type { ProjectStatus, ProjectPhoto } from '@/lib/db/types';

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

  const { data: photosData } = await supabase
    .from('project_photos')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false });

  const photos = (photosData ?? []) as ProjectPhoto[];
  const building = project.buildings?.[0] ?? null;
  const hasPhotos = photos.length > 0;

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
          <p className="mt-0.5 text-sm text-zinc-500">
            {project.address}, {project.postal_code} {project.city}
          </p>
        </div>
        <StatusDropdown projectId={project.id} currentStatus={project.status as ProjectStatus} />
      </div>

      {/* Workflow tracker */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">Projektfortschritt</p>
        <div className="relative flex items-center justify-between">
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
            <strong>Nächster Schritt:</strong>{' '}
            {nextStep.label === 'Begehung' && (
              <span className="font-semibold">→ Tab &quot;Begehung&quot; öffnen und Formular ausfüllen</span>
            )}
            {nextStep.label === 'Fotos' && (
              <span className="font-semibold">→ Tab &quot;Fotos&quot; öffnen und Bilder hochladen</span>
            )}
            {nextStep.label === 'Abgeschlossen' && <span>Projekt auf „Abgeschlossen&rdquo; setzen</span>}
          </div>
        )}
      </div>

      {/* Tabs */}
      <ProjectTabs
        project={project}
        building={building}
        photos={photos}
        projectId={id}
      />
    </div>
  );
}
