import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { SkillGapData } from "../../types/jobAnalyzer";

export interface SkillGapProps {
  gap: SkillGapData;
  className?: string;
}

export default function SkillGap({ gap, className = "" }: SkillGapProps) {
  const currentSkills = gap?.currentSkills || [];
  const missingSkills = gap?.missingSkills || [];
  const prioritySkills = gap?.prioritySkills || [];
  const suggestedOrder = gap?.suggestedOrder || [];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
        <Sparkles size={14} className="text-cyan-500" />
        <span>Skill Gap & Skill Alignment</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            <CheckCircle2 size={16} />
            <span>Current Skills ({currentSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300/40"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-xs uppercase tracking-wider">
            <AlertTriangle size={16} />
            <span>Missing Skills ({missingSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300/40"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-sky-200/80 dark:border-sky-900/40 bg-sky-50/30 dark:bg-sky-950/20 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Priority Skills ({prioritySkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {prioritySkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 border border-sky-300/40"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-cyan-200/80 dark:border-cyan-900/40 bg-cyan-50/30 dark:bg-cyan-950/20 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
            <ArrowRight size={16} />
            <span>Suggested Learning Order</span>
          </div>
          <ol className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 pt-1">
            {suggestedOrder.map((step, idx) => (
              <li key={idx} className="flex items-center gap-2 truncate">
                <span className="h-5 w-5 rounded-full bg-cyan-200 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-[10px] flex items-center justify-center font-mono shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
