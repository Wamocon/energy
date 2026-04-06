import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { Plus } from 'lucide-react';
import { ProjectList } from '@/components/ProjectList';
import type { Project } from '@/lib/db/types';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  const t = await getTranslations('dashboard');

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t('title')}</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {projects?.length ?? 0} {projects?.length === 1 ? 'Projekt' : 'Projekte'}
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">{t('newProject')}</span>
          <span className="sm:hidden">Neu</span>
        </Link>
      </div>

      <ProjectList
        projects={(projects ?? []) as Project[]}
        newProjectLabel={t('newProject')}
        noProjectsLabel={t('noProjects')}
        openLabel={t('table.open')}
        locale={locale}
      />
    </div>
  );
}
