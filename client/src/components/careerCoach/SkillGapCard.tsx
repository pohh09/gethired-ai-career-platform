import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { SkillGapData } from "../../types/careerCoach";

export interface SkillGapCardProps {
  skillGap: SkillGapData;
  className?: string;
}

export default function SkillGapCard({
  skillGap,
  className = "",
}: SkillGapCardProps) {
  const currentSkills = skillGap?.currentSkills || [];
  const missingSkills = skillGap?.missingSkills || [];
  const requestedSkills = skillGap?.requestedSkills || [];
  const learningPriority = skillGap?.learningPriority || [];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
        <Sparkles size={14} className="text-purple-500" />
        <span>Skill Gap Analysis & Market Demand</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            <CheckCircle2 size={16} />
            <span>Current Skills ({currentSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/50"
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
                className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300/50"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
            <TrendingUp size={16} />
            <span>Most Requested Skills ({requestedSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {requestedSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-300/50"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <ArrowRight size={16} />
            <span>Learning Priority ({learningPriority.length})</span>
          </div>
          <ol className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 pt-1">
            {learningPriority.map((item, idx) => (
              <li key={item} className="flex items-center gap-2 truncate">
                <span className="h-5 w-5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[10px] flex items-center justify-center font-mono shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
