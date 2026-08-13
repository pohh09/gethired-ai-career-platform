import Skeleton from "../ui/Skeleton";
import DashboardGrid from "./DashboardGrid";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <Skeleton width="200px" height={28} />
        <Skeleton width="340px" height={16} />
      </div>

      <DashboardGrid columns={5}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <Skeleton width="50%" height={14} />
          <Skeleton width="40%" height={32} />
          <Skeleton width="70%" height={12} />
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <Skeleton width="50%" height={14} />
          <Skeleton width="40%" height={32} />
          <Skeleton width="70%" height={12} />
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <Skeleton width="50%" height={14} />
          <Skeleton width="40%" height={32} />
          <Skeleton width="70%" height={12} />
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <Skeleton width="50%" height={14} />
          <Skeleton width="40%" height={32} />
          <Skeleton width="70%" height={12} />
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <Skeleton width="50%" height={14} />
          <Skeleton width="40%" height={32} />
          <Skeleton width="70%" height={12} />
        </div>
      </DashboardGrid>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <Skeleton width="160px" height={20} />
          <Skeleton width="100%" height={260} className="rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <Skeleton width="140px" height={20} />
          <Skeleton circle width={160} height={160} className="mx-auto my-4" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <Skeleton width="180px" height={20} />
        <Skeleton width="100%" height={240} className="rounded-xl" />
      </div>
    </div>
  );
}
