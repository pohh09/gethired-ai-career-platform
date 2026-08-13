import { MapPin, Briefcase, Award } from "lucide-react";
import type {
  ApplicationRecommendation,
  DifficultyLevel,
  WorkType,
} from "../../types/jobAnalyzer";

export interface MatchScoreProps {
  score: number;
  recommendation: ApplicationRecommendation;
  difficultyLevel: DifficultyLevel;
  workType: WorkType;
  experienceRequired: string;
  className?: string;
}

export default function MatchScore({
  score,
  recommendation,
  difficultyLevel,
  workType,
  experienceRequired,
  className = "",
}: MatchScoreProps) {
  const getScoreColor = (val: number) => {
    if (val >= 80)
      return "stroke-emerald-500 text-emerald-600 dark:text-emerald-400";
    if (val >= 60)
      return "stroke-indigo-500 text-indigo-600 dark:text-indigo-400";
    if (val >= 40) return "stroke-amber-500 text-amber-600 dark:text-amber-400";
    return "stroke-rose-500 text-rose-600 dark:text-rose-400";
  };

  const getRecBadgeStyle = (rec: ApplicationRecommendation) => {
    switch (rec) {
      case "Highly Recommended":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300/60";
      case "Recommended":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300/60";
      case "Apply with Resume Improvements":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300/60";
      case "Not Recommended":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300/60";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300/60";
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Job Compatibility
            </span>
            <span
              className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${getRecBadgeStyle(
                recommendation,
              )}`}
            >
              {recommendation}
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {score >= 80
              ? "High Value Opportunity 🎯"
              : score >= 60
                ? "Promising Target Role 📈"
                : "Selective Application Recommended ⚠️"}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Evaluated against skills, qualifications, salary benchmarks, and
            risk flags.
          </p>
        </div>

        <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="3.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`transition-all duration-1000 ${getScoreColor(score)}`}
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold tracking-tight">
              {score}%
            </span>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
              Match Score
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <Award size={16} className="text-indigo-500 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Difficulty Level
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {difficultyLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <Briefcase size={16} className="text-purple-500 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Experience Required
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {experienceRequired}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <MapPin size={16} className="text-emerald-500 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Work Environment
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {workType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
