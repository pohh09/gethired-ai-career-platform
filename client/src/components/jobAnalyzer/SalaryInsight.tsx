import { DollarSign, AlertCircle } from "lucide-react";
import type { SalaryInsightData } from "../../types/jobAnalyzer";

export interface SalaryInsightProps {
  salary: SalaryInsightData;
  className?: string;
}

export default function SalaryInsight({
  salary,
  className = "",
}: SalaryInsightProps) {
  return (
    <div
      className={`p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
        <DollarSign size={16} className="text-emerald-500" />
        <span>Market Salary Benchmark & Compensation Range</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Entry Level Benchmark
          </span>
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {salary.entryLevel}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Average Market Target
          </span>
          <p className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
            {salary.averageMarket}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            Expected Salary Range
          </span>
          <p className="text-sm font-extrabold text-indigo-900 dark:text-indigo-200">
            {salary.expectedRange}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <AlertCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer:</strong>{" "}
          {salary.disclaimer ||
            "Salary estimates are generated using market industry benchmarks and location data and may not represent the exact offer."}
        </span>
      </div>
    </div>
  );
}
