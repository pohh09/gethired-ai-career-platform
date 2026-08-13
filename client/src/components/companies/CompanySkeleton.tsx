export interface CompanySkeletonProps {
  variant?: "grid" | "table" | "detail";
  count?: number;
}

export default function CompanySkeleton({
  variant = "grid",
  count = 6,
}: CompanySkeletonProps) {
  if (variant === "table") {
    return (
      <div className="space-y-3 animate-pulse p-4 bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-full mb-4" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-3 w-1/4">
              <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
              </div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-3 w-full">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-32" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-64" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20" />
              <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-24" />
              </div>
            </div>
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-14" />
          </div>

          <div className="space-y-2 py-2">
            <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4" />
          </div>

          <div className="flex gap-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
