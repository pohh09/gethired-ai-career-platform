import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import ProgressRing from "./ProgressRing";
import type { JobScore } from "../../types/ai";

export interface ScoreCardProps {
  jobScore: JobScore;
  className?: string;
}

export default function ScoreCard({ jobScore, className = "" }: ScoreCardProps) {
  const getVerdictStyle = (v: string) => {
    if (v.includes("Strong")) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40";
    if (v.includes("Moderate")) return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40";
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              {jobScore.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {jobScore.company}
              </h4>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {jobScore.role}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getVerdictStyle(
              jobScore.verdict
            )}`}
          >
            {jobScore.verdict}
          </span>
        </div>


        <div className="flex items-center justify-center py-2">
          <ProgressRing score={jobScore.overallScore} size={90} strokeWidth={8} />
        </div>


        <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
            Score Readiness Factors
          </span>
          {jobScore.factors.map((f: { label: string; score: number; passed: boolean }, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-xs gap-2">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
                {f.passed ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : (
                  <XCircle size={13} className="text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className="truncate">{f.label}</span>
              </span>
              <span className={`font-mono text-[11px] font-bold ${f.passed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                +{f.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
