export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-36 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-1.5 h-4 w-20 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-200" />
      </div>
      {/* Search skeleton */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="h-9 w-full animate-pulse rounded-lg bg-zinc-200" />
        <div className="flex gap-2">
          {[80, 60, 100, 110].map((w, i) => (
            <div key={i} className={`h-6 w-${w} animate-pulse rounded-full bg-zinc-100`} style={{ width: w }} />
          ))}
        </div>
      </div>
      {/* Row skeletons */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-zinc-100 px-4 py-3 last:border-0">
            <div className="h-4 w-36 animate-pulse rounded bg-zinc-200" />
            <div className="hidden h-4 w-48 animate-pulse rounded bg-zinc-200 sm:block" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
