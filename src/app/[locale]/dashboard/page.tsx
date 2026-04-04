import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { Plus, ArrowRight, Building2 } from 'lucide-react';
import type { Project, ProjectStatus } from '@/lib/db/types';

function StatusBadge({ status, label }: { status: ProjectStatus; label: string }) {
  const colours: Record<ProjectStatus, string> = {
    new: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-amber-50 text-amber-700',
    completed: 'bg-green-50 text-green-700',
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colours[status]}`}>
      {label}
    </span>
  );
}

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
          {t('newProject')}
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-16 text-center">
          <Building2 size={40} className="mx-auto mb-4 text-zinc-300" />
          <p className="mb-1 font-medium text-zinc-900">Noch keine Projekte</p>
          <p className="mb-6 text-sm text-zinc-500">{t('noProjects')}</p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            <Plus size={16} />
            {t('newProject')}
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {t('table.customer')}
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 sm:table-cell">
                  {t('table.address')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {t('table.status')}
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 sm:table-cell">
                  {t('table.created')}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(projects as Project[]).map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {project.customer_name}
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-500 sm:table-cell">
                    {project.address}, {project.city}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} label={t(`status.${project.status}`)} />
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-500 sm:table-cell">
                    {new Date(project.created_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'de-DE')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
                    >
                      {t('table.open')} <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
