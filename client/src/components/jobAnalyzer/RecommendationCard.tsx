import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import type { ApplicationRecommendation } from "../../types/jobAnalyzer";

export interface RecommendationCardProps {
  recommendation: ApplicationRecommendation;
  recommendationReason: string;
  jobSummary: string;
  strengths?: string[];
  weaknesses?: string[];
  className?: string;
}

export default function RecommendationCard({
  recommendationReason,
  jobSummary,
  strengths = [],
  weaknesses = [],
  className = "",
}: RecommendationCardProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Role Overview & Strategic Rationale</span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {jobSummary}
        </p>

        <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
          <span className="font-bold">Recommendation Focus: </span>
          <span>{recommendationReason}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <TrendingUp size={14} />
            <span>Profile Strengths ({strengths.length})</span>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <AlertTriangle size={14} />
            <span>Areas to Highlight or Clarify ({weaknesses.length})</span>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
            {weaknesses.map((wk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
