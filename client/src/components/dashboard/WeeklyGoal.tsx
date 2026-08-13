import { Target, Trophy, Sparkles } from "lucide-react";
import SectionTitle from "./SectionTitle";

export interface WeeklyGoalProps {
  currentCount?: number;
  targetCount?: number;
  className?: string;
}

export default function WeeklyGoal({
  currentCount = 13,
  targetCount = 20,
  className = "",
}: WeeklyGoalProps) {
  const percentage = Math.min(
    100,
    Math.round((currentCount / targetCount) * 100),
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Weekly Application Goal"
        subtitle="Track application submission velocity against your weekly targets"
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center border border-indigo-200/50 shrink-0">
              <Target size={20} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Weekly Target: {targetCount} Applications
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentCount} of {targetCount} completed ({percentage}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/50">
            <Trophy size={13} />
            <span>{percentage >= 100 ? "Goal Achieved!" : "On Track"}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              style={{ width: `${percentage}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-medium pt-1">
            <span>0</span>
            <span>
              {currentCount} / {targetCount} Submitted
            </span>
            <span>{targetCount} Goal</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-200">
          <Sparkles size={14} className="text-indigo-500 shrink-0" />
          <span>
            {percentage >= 100
              ? "You've exceeded your weekly target! Excellent momentum for your job search."
              : `Submit ${targetCount - currentCount} more application${targetCount - currentCount > 1 ? "s" : ""} by Friday to hit 100% completion.`}
          </span>
        </div>
      </div>
    </div>
  );
}
