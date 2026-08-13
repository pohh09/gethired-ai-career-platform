import type { CompanyApplication, PipelineStage } from "../../types/company";

export interface PipelineProgressProps {
  applications?: CompanyApplication[];
  className?: string;
}

const STAGES: { stage: PipelineStage; label: string; color: string; bgLight: string; darkBg: string }[] = [
  { stage: "Applied", label: "Applied", color: "#3b82f6", bgLight: "bg-blue-50 text-blue-700 border-blue-200", darkBg: "dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/40" },
  { stage: "Screening", label: "Screening", color: "#a855f7", bgLight: "bg-purple-50 text-purple-700 border-purple-200", darkBg: "dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/40" },
  { stage: "Interview", label: "Interview", color: "#f59e0b", bgLight: "bg-amber-50 text-amber-700 border-amber-200", darkBg: "dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40" },
  { stage: "Offer", label: "Offer", color: "#10b981", bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200", darkBg: "dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40" },
  { stage: "Rejected", label: "Rejected", color: "#ef4444", bgLight: "bg-rose-50 text-rose-700 border-rose-200", darkBg: "dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40" },
  { stage: "Accepted", label: "Accepted", color: "#6366f1", bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200", darkBg: "dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/40" },
];

export default function PipelineProgress({
  applications = [],
  className = "",
}: PipelineProgressProps) {
  const getCountForStage = (stage: PipelineStage) => {
    return applications.filter((a) => a.stage === stage).length;
  };

  const totalApps = applications.length || 1;

  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Hiring Pipeline Progress
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track candidates and role progression across pipeline stages
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          {applications.length} Roles Active
        </span>
      </div>

      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 mb-6">
        {STAGES.map((stg) => {
          const count = getCountForStage(stg.stage);
          const percent = (count / totalApps) * 100;
          if (count === 0) return null;
          return (
            <div
              key={stg.stage}
              style={{ width: `${percent}%`, backgroundColor: stg.color }}
              className="h-full transition-all duration-500"
              title={`${stg.label}: ${count}`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((stg) => {
          const count = getCountForStage(stg.stage);
          return (
            <div
              key={stg.stage}
              className={`p-3 rounded-xl border transition-all ${count > 0
                ? `${stg.bgLight} ${stg.darkBg} shadow-2xs`
                : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  {stg.label}
                </span>
                <span
                  style={{ backgroundColor: stg.color }}
                  className="h-2 w-2 rounded-full shrink-0"
                />
              </div>

              <span className="text-xl font-extrabold block">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
