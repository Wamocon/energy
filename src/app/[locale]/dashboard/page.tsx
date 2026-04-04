import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/LogoutButton';
import type { Project, ProjectStatus } from '@/lib/db/types';

function StatusBadge({ status, label }: { status: ProjectStatus; label: string }) {
  const colours: Record<ProjectStatus, string> = {
    new: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    completed: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400',
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">⚡ Energieberater</span>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/handbook"
              className="hidden text-sm text-zinc-500 hover:text-zinc-900 sm:block dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              📖 Handbuch
            </Link>
            <span className="hidden text-sm text-zinc-500 sm:block">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t('title')}</h1>
          <Link
            href="/dashboard/projects/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + {t('newProject')}
          </Link>
        </div>

        {!projects || projects.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400">{t('noProjects')}</p>
            <Link
              href="/dashboard/projects/new"
              className="mt-4 inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
            >
              + {t('newProject')}
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
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
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(projects as Project[]).map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
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
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        {t('table.open')} →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
