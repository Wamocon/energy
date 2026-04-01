'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { PhotoCategory, ProjectPhoto } from '@/lib/db/types';

type Props = {
  projectId: string;
  userId: string;
  initialPhotos: ProjectPhoto[];
};

export function PhotoUpload({ projectId, userId, initialPhotos }: Props) {
  const t = useTranslations('photos');
  const [photos, setPhotos] = useState<ProjectPhoto[]>(initialPhotos);
  const [category, setCategory] = useState<PhotoCategory>('facade');
  const [description, setDescription] = useState('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: PhotoCategory[] = ['facade', 'roof', 'basement', 'heating', 'windows', 'other'];

  async function handleUpload(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(t('maxSize'));
      return;
    }

    setUploadState('uploading');
    setErrorMsg(null);

    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const filePath = `${userId}/${projectId}/${category}/${Date.now()}.${ext}`;

    const { error: storageError } = await supabase.storage
      .from('project-photos')
      .upload(filePath, file, { upsert: false });

    if (storageError) {
      setErrorMsg(t('uploadError'));
      setUploadState('error');
      return;
    }

    const { data: photo, error: dbError } = await supabase
      .from('project_photos')
      .insert({
        project_id: projectId,
        category,
        file_path: filePath,
        description: description || null,
      })
      .select()
      .single();

    if (dbError || !photo) {
      setErrorMsg(t('uploadError'));
      setUploadState('error');
      return;
    }

    setPhotos((prev) => [photo as ProjectPhoto, ...prev]);
    setDescription('');
    setUploadState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDelete(photo: ProjectPhoto) {
    if (!window.confirm(t('deleteConfirm'))) return;
    const supabase = createClient();
    await supabase.storage.from('project-photos').remove([photo.file_path]);
    await supabase.from('project_photos').delete().eq('id', photo.id);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }

  async function getSignedUrl(filePath: string): Promise<string> {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from('project-photos')
      .createSignedUrl(filePath, 60 * 60);
    return data?.signedUrl ?? '';
  }

  const inputCls =
    'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50';

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">{t('upload')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PhotoCategory)}
              className={inputCls}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`categories.${cat}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('description')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs text-zinc-400">{t('maxSize')}</p>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-zinc-300 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600">
            <span className="text-2xl">📷</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {uploadState === 'uploading' ? t('uploading') : t('upload')}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadState === 'uploading'}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>
        </div>

        {errorMsg && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
        )}
      </div>

      {/* Photo list */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">
          {t('uploaded', { count: photos.length })}
        </h2>
        {photos.length === 0 ? (
          <p className="text-sm text-zinc-500">{t('noPhotos')}</p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {photos.map((photo) => (
              <PhotoRow key={photo.id} photo={photo} onDelete={handleDelete} getSignedUrl={getSignedUrl} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoRow({
  photo,
  onDelete,
  getSignedUrl,
  t,
}: {
  photo: ProjectPhoto;
  onDelete: (p: ProjectPhoto) => void;
  getSignedUrl: (path: string) => Promise<string>;
  t: ReturnType<typeof useTranslations<'photos'>>;
}) {
  async function handleView() {
    const url = await getSignedUrl(photo.file_path);
    if (url) window.open(url, '_blank');
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {t(`categories.${photo.category}`)}
        </span>
        {photo.description && (
          <p className="text-xs text-zinc-500">{photo.description}</p>
        )}
        <p className="text-xs text-zinc-400">
          {new Date(photo.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleView}
          className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          {t('view')}
        </button>
        <button
          onClick={() => onDelete(photo)}
          className="text-xs font-medium text-red-500 hover:text-red-700 dark:hover:text-red-400"
        >
          {t('delete')}
        </button>
      </div>
    </div>
  );
}
