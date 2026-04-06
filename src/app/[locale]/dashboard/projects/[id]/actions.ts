'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ProjectStatus } from '@/lib/db/types';

export async function updateProjectStatus(projectId: string, status: ProjectStatus): Promise<{ error?: string }> {
  const supabase = await createClient();

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht autorisiert.' };

  const { error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', projectId)
    .eq('berater_id', user.id);

  if (error) return { error: 'Status konnte nicht gespeichert werden.' };

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath('/dashboard');
  return {};
}
