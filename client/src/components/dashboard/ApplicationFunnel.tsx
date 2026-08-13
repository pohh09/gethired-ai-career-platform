import { useMemo } from "react";
import SectionTitle from "./SectionTitle";

import type { JobStats } from "../../types/dashboard";

export interface FunnelStageData {
  stage:
    "Applied" | "Screening" | "Assessment" | "Interview" | "Offer" | "Accepted";
  count: number;
}

export interface ApplicationFunnelProps {
  stats?: Partial<JobStats> | Record<string, number>;
  totalApplications?: number;
  className?: string;
}

const STAGE_CONFIG: {
  key: FunnelStageData["stage"];
  label: string;
  color: string;
  bgLight: string;
  darkBg: string;
}[] = [
  {
    key: "Applied",
    label: "Applied",
    color: "#3b82f6",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    darkBg: "dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/40",
  },
  {
    key: "Screening",
    label: "Screening",
    color: "#a855f7",
    bgLight: "bg-purple-50 text-purple-700 border-purple-200",
    darkBg:
      "dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/40",
  },
  {
    key: "Assessment",
    label: "Assessment",
    color: "#06b6d4",
    bgLight: "bg-cyan-50 text-cyan-700 border-cyan-200",
    darkBg: "dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/40",
  },
  {
    key: "Interview",
    label: "Interview",
    color: "#f59e0b",
    bgLight: "bg-amber-50 text-amber-700 border-amber-200",
    darkBg: "dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40",
  },
  {
    key: "Offer",
    label: "Offer",
    color: "#10b981",
    bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
    darkBg:
      "dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40",
  },
  {
    key: "Accepted",
    label: "Accepted",
    color: "#6366f1",
    bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
    darkBg:
      "dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/40",
  },
];

export default function ApplicationFunnel({
  stats = {},
  totalApplications = 13,
  className = "",
}: ApplicationFunnelProps) {
  const funnelStages = useMemo(() => {
    const statsRecord = stats as Record<string, number | undefined>;
    const counts: Record<string, number> = {
      Applied:
        statsRecord.Applied ??
        Math.max(1, Math.floor(totalApplications * 0.45)),
      Screening:
        statsRecord.Screening ??
        Math.max(1, Math.floor(totalApplications * 0.25)),
      Assessment:
        statsRecord.Assessment ??
        Math.max(1, Math.floor(totalApplications * 0.15)),
      Interview:
        statsRecord.Interview ??
        Math.max(1, Math.floor(totalApplications * 0.1)),
      Offer:
        statsRecord.Offer ?? Math.max(0, Math.floor(totalApplications * 0.04)),
      Accepted:
        statsRecord.Accepted ??
        Math.max(0, Math.floor(totalApplications * 0.01)),
    };

    const baseCount = counts.Applied || totalApplications || 1;

    return STAGE_CONFIG.map((cfg, idx) => {
      const count = counts[cfg.key] || 0;
      const conversionRate = Math.round((count / baseCount) * 100);
      const prevCount =
        idx > 0 ? counts[STAGE_CONFIG[idx - 1].key] || 1 : baseCount;
      const stepConversion = Math.round((count / (prevCount || 1)) * 100);
      const dropOffRate = 100 - stepConversion;

      return {
        ...cfg,
        count,
        conversionRate,
        stepConversion,
        dropOffRate: Math.max(0, dropOffRate),
      };
    });
  }, [stats, totalApplications]);

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Application Conversion Funnel"
        subtitle="Hiring pipeline progression, conversion rates, and stage drop-offs"
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm space-y-6">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
          {funnelStages.map((stg) => {
            const widthPct = Math.max(3, stg.conversionRate);
            return (
              <div
                key={stg.key}
                style={{ width: `${widthPct}%`, backgroundColor: stg.color }}
                className="h-full transition-all duration-500 rounded-full"
                title={`${stg.label}: ${stg.count} (${stg.conversionRate}%)`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {funnelStages.map((stg) => (
            <div
              key={stg.key}
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                stg.count > 0
                  ? `${stg.bgLight} ${stg.darkBg} shadow-2xs`
                  : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  {stg.label}
                </span>
                <span
                  style={{ backgroundColor: stg.color }}
                  className="h-2 w-2 rounded-full shrink-0"
                />
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-extrabold">{stg.count}</span>
                <span className="text-xs font-bold opacity-80">
                  {stg.conversionRate}%
                </span>
              </div>

              <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[10px] opacity-75 font-mono">
                <span>Pass: {stg.stepConversion}%</span>
                <span>Drop: {stg.dropOffRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
