import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { PhotoUpload } from './PhotoUpload';
import type { ProjectPhoto } from '@/lib/db/types';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function PhotosPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: project } = await supabase
    .from('projects')
    .select('id, customer_name')
    .eq('id', id)
    .eq('berater_id', user.id)
    .single();

  if (!project) notFound();

  const { data: photos } = await supabase
    .from('project_photos')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false });

  const t = await getTranslations('photos');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <Link
            href={`/dashboard/projects/${id}`}
            className="mr-4 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← {project.customer_name}
          </Link>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">⚡ Energieberater</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t('title')}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('subtitle')}</p>
        </div>

        <PhotoUpload
          projectId={id}
          userId={user.id}
          initialPhotos={(photos ?? []) as ProjectPhoto[]}
        />
      </main>
    </div>
  );
}
