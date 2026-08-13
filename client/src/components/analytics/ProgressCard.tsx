import { motion } from "framer-motion";
import type { JobStats } from "../../types/dashboard";

export interface ProgressCardProps {
  stats?: JobStats;
  totalJobs?: number;
  className?: string;
}

export default function ProgressCard({
  stats,
  totalJobs = 0,
  className = "",
}: ProgressCardProps) {
  const items = [
    {
      label: "Applied",
      count: stats?.Applied || 0,
      color: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Interview",
      count: stats?.Interview || 0,
      color: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Assessment",
      count: stats?.Assessment || 0,
      color: "bg-purple-500",
      text: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Offer",
      count: stats?.Offer || 0,
      color: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Rejected",
      count: stats?.Rejected || 0,
      color: "bg-rose-500",
      text: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Ghosted",
      count: (stats as Record<string, number> | undefined)?.Ghosted || 0,
      color: "bg-slate-400",
      text: "text-slate-500",
    },
  ];

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
    >
      <div className="mb-5">
        <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Status Breakdown Progress
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Proportional volume and stage completion across application queue
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const percentage =
            totalJobs > 0 ? ((item.count / totalJobs) * 100).toFixed(1) : "0.0";

          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-slate-100 font-bold">
                    {item.count}
                  </span>
                  <span className={`text-[11px] font-bold ${item.text}`}>
                    ({percentage}%)
                  </span>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
