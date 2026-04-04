import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { InspectionForm } from './InspectionForm';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { ProjectPhoto } from '@/lib/db/types';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function InspectionPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: project } = await supabase
    .from('projects')
    .select('id, customer_name, buildings(*)')
    .eq('id', id)
    .eq('berater_id', user.id)
    .single();

  if (!project) notFound();

  const building = project.buildings?.[0] ?? null;

  const { data: photos } = await supabase
    .from('project_photos')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false });

  const t = await getTranslations('inspection');

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[
          { label: 'Projekte', href: '/dashboard' },
          { label: project.customer_name, href: `/dashboard/projects/${id}` },
          { label: t('title') },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-zinc-500">{t('subtitle')}</p>
      </div>

      <InspectionForm
        projectId={id}
        building={building}
        userId={user.id}
        initialPhotos={(photos as ProjectPhoto[]) ?? []}
      />
    </div>
  );
}
