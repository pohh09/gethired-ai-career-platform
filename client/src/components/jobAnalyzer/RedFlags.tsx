import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import type { RedFlagItem } from "../../types/jobAnalyzer";

export interface RedFlagsProps {
  flags: RedFlagItem[];
  className?: string;
}

export default function RedFlags({
  flags = [],
  className = "",
}: RedFlagsProps) {
  if (!flags || flags.length === 0) {
    return (
      <div
        className={`p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 ${className}`}
      >
        <span className="font-bold">✓ Zero Red Flags Detected:</span>
        <span>
          The job posting meets standard corporate publishing guidelines without
          unrealistic requirements or scam indicators.
        </span>
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-300/60";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-amber-300/60";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300/60";
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case "High":
        return <AlertOctagon size={16} className="text-rose-500 shrink-0" />;
      case "Medium":
        return <AlertTriangle size={16} className="text-amber-500 shrink-0" />;
      default:
        return <Info size={16} className="text-slate-400 shrink-0" />;
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 backdrop-blur-sm space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
          <AlertOctagon size={16} />
          <span>Potential Red Flags & Risk Warnings ({flags.length})</span>
        </div>
      </div>

      <div className="space-y-2">
        {flags.map((flag, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 flex items-start gap-3 shadow-2xs"
          >
            {getIcon(flag.severity)}

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  {flag.issue}
                </span>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getSeverityBadge(
                    flag.severity,
                  )}`}
                >
                  {flag.severity} Risk
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {flag.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
