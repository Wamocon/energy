export default function ProjectDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-8 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-3 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
      </div>
      {/* Title */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="h-7 w-48 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-1.5 h-4 w-64 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-200" />
      </div>
      {/* Workflow tracker */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 h-3 w-32 animate-pulse rounded bg-zinc-100" />
        <div className="flex justify-between">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200" />
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="mb-4 h-5 w-32 animate-pulse rounded bg-zinc-200" />
            {[...Array(3)].map((_, j) => (
              <div key={j} className="mb-3 flex gap-3">
                <div className="h-4 w-4 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
