'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Fehler beim Laden</p>
        <p className="mt-2 text-sm text-zinc-500">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
