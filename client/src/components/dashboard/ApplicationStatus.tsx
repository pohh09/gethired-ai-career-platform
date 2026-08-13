import { useMemo } from "react";
import SectionTitle from "./SectionTitle";
import type { JobStats } from "../../types/dashboard";

export interface ApplicationStatusProps {
  stats?: Partial<JobStats> | Record<string, number>;
  totalApplications?: number;
  className?: string;
}

const STATUS_ITEMS = [
  {
    key: "Applied",
    label: "Applied",
    color:
      "bg-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/40",
  },
  {
    key: "Interview",
    label: "Interview",
    color:
      "bg-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/40",
  },
  {
    key: "Assessment",
    label: "Assessment",
    color:
      "bg-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/40",
  },
  {
    key: "Offer",
    label: "Offer",
    color:
      "bg-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/40",
  },
  {
    key: "Rejected",
    label: "Rejected",
    color:
      "bg-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/40",
  },
];

export default function ApplicationStatus({
  stats = {},
  totalApplications = 13,
  className = "",
}: ApplicationStatusProps) {
  const statusCounts = useMemo(() => {
    const statsRecord = stats as Record<string, number | undefined>;
    return {
      Applied:
        statsRecord.Applied ??
        Math.max(1, Math.floor(totalApplications * 0.45)),
      Interview:
        statsRecord.Interview ??
        Math.max(1, Math.floor(totalApplications * 0.2)),
      Assessment:
        statsRecord.Assessment ??
        Math.max(1, Math.floor(totalApplications * 0.15)),
      Offer:
        statsRecord.Offer ?? Math.max(0, Math.floor(totalApplications * 0.08)),
      Rejected:
        statsRecord.Rejected ??
        Math.max(0, Math.floor(totalApplications * 0.12)),
    };
  }, [stats, totalApplications]);

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Application Status"
        subtitle="Current status breakdown across active pipeline applications"
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm space-y-4">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
          {STATUS_ITEMS.map((item) => {
            const count =
              statusCounts[item.key as keyof typeof statusCounts] || 0;
            const pct = Math.max(
              2,
              Math.round((count / (totalApplications || 1)) * 100),
            );
            return (
              <div
                key={item.key}
                style={{ width: `${pct}%` }}
                className={`h-full transition-all duration-500 ${item.color.split(" ")[0]} rounded-full`}
                title={`${item.label}: ${count}`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {STATUS_ITEMS.map((item) => {
            const count =
              statusCounts[item.key as keyof typeof statusCounts] || 0;
            return (
              <div
                key={item.key}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${item.color.split(" ").slice(1).join(" ")}`}
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {count}
                  </span>
                </div>

                <div
                  className={`h-2.5 w-2.5 rounded-full ${item.color.split(" ")[0]}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
