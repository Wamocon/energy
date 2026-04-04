'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PhotoCategory, ProjectPhoto } from '@/lib/db/types';

type Props = {
  projectId: string;
  userId: string;
  category: PhotoCategory;
  categoryLabel: string;
  initialPhotos: ProjectPhoto[];
};

export function SectionPhotoUpload({ projectId, userId, category, categoryLabel, initialPhotos }: Props) {
  const [photos, setPhotos] = useState<ProjectPhoto[]>(initialPhotos);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Max. 10 MB pro Bild');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(jpe?g|png|heic|heif|webp)$/i)) {
      setErrorMsg('Nur JPG, PNG, HEIC oder WebP erlaubt.');
      return;
    }

    setUploadState('uploading');
    setErrorMsg(null);

    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const filePath = `${userId}/${projectId}/${category}/${Date.now()}.${ext}`;

    const { error: storageError } = await supabase.storage
      .from('project-photos')
      .upload(filePath, file, { upsert: false });

    if (storageError) {
      setErrorMsg('Fehler beim Hochladen. Bitte erneut versuchen.');
      setUploadState('error');
      return;
    }

    const { data: photo, error: dbError } = await supabase
      .from('project_photos')
      .insert({ project_id: projectId, category, file_path: filePath, description: null })
      .select()
      .single();

    if (dbError || !photo) {
      setErrorMsg('Fehler beim Speichern. Bitte erneut versuchen.');
      setUploadState('error');
      return;
    }

    setPhotos((prev) => [photo as ProjectPhoto, ...prev]);
    setUploadState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDelete(photo: ProjectPhoto) {
    if (!window.confirm('Foto wirklich löschen?')) return;
    const supabase = createClient();
    await supabase.storage.from('project-photos').remove([photo.file_path]);
    await supabase.from('project_photos').delete().eq('id', photo.id);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }

  async function handleView(filePath: string) {
    const supabase = createClient();
    const { data } = await supabase.storage.from('project-photos').createSignedUrl(filePath, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  }

  return (
    <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          📷 {categoryLabel}{photos.length > 0 ? ` (${photos.length})` : ''}
        </span>
        <label
          className={`flex cursor-pointer items-center gap-1 rounded-md border border-zinc-300 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 ${uploadState === 'uploading' ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {uploadState === 'uploading' ? '⏳' : '+ Foto'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
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
        <p className="mb-2 text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
      )}

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative">
              <button
                type="button"
                onClick={() => handleView(photo.file_path)}
                className="flex h-14 w-14 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-xl transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                title="Foto ansehen"
              >
                🖼️
              </button>
              <button
                type="button"
                onClick={() => handleDelete(photo)}
                className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white group-hover:flex"
                title="Foto löschen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
