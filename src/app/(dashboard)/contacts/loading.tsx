export default function Loading() {
  return (
    <>
      <header className="sticky top-14 z-10 border-b border-border bg-background/80 backdrop-blur md:top-0">
        <div className="flex items-center justify-between gap-4 px-6 py-5 md:px-10">
          <div className="space-y-2">
            <div className="h-7 w-32 animate-pulse rounded-md bg-zinc-200" />
            <div className="h-4 w-44 animate-pulse rounded bg-zinc-100" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-[var(--radius)] bg-zinc-200" />
        </div>
      </header>

      <div className="px-6 py-8 md:px-10">
        <div className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-card)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-border/70 px-5 py-3.5 last:border-0"
            >
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-zinc-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-40 animate-pulse rounded bg-zinc-200" />
                <div className="h-3 w-56 animate-pulse rounded bg-zinc-100" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
