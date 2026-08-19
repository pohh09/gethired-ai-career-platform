import Skeleton from "../ui/Skeleton";
import { Sparkles } from "lucide-react";

export default function CoverLetterSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-4 sm:p-6 rounded-2xl border border-blue-100 dark:border-blue-950/60 bg-gradient-to-b from-blue-50/40 to-cyan-50/30 dark:from-blue-950/20 dark:to-slate-900/40">
      <div className="flex items-center justify-between border-b border-blue-100/60 dark:border-blue-900/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-cyan-400">
            <Sparkles size={20} className="animate-spin" />
          </div>
          <div className="space-y-1.5">
            <Skeleton width={180} height={18} />
            <Skeleton width={130} height={12} />
          </div>
        </div>
        <Skeleton width={80} height={24} className="rounded-full" />
      </div>

      <div className="space-y-3 p-5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
        <Skeleton width="40%" height={16} />
        <Skeleton width="25%" height={14} />
        <div className="h-2" />
        <Skeleton width="95%" height={14} />
        <Skeleton width="98%" height={14} />
        <Skeleton width="90%" height={14} />
        <Skeleton width="93%" height={14} />
        <div className="h-2" />
        <Skeleton width="96%" height={14} />
        <Skeleton width="92%" height={14} />
        <Skeleton width="88%" height={14} />
        <div className="h-2" />
        <Skeleton width="30%" height={14} />
        <Skeleton width="20%" height={14} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 space-y-3">
          <Skeleton width="50%" height={14} />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton width={70} height={22} />
            <Skeleton width={90} height={22} />
            <Skeleton width={80} height={22} />
            <Skeleton width={100} height={22} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 space-y-3">
          <Skeleton width="50%" height={14} />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton width={85} height={22} />
            <Skeleton width={75} height={22} />
            <Skeleton width={105} height={22} />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
        <Skeleton width="40%" height={14} />
        <Skeleton width="90%" height={12} />
        <Skeleton width="85%" height={12} />
      </div>
    </div>
  );
}
