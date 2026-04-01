export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-zinc-100 px-4 py-3 last:border-0 dark:border-zinc-800">
              <div className="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
