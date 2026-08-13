import { Send, CalendarCheck, Award, Clock, Flame } from "lucide-react";
import type { ActivitySummaryMetrics } from "../../types/ai";

export interface ActivitySummaryProps {
  summary: ActivitySummaryMetrics;
  className?: string;
}

export default function ActivitySummary({
  summary,
  className = "",
}: ActivitySummaryProps) {
  return (
    <div
      className={`p-6 rounded-2xl border border-indigo-500/20 dark:border-indigo-500/30 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
            AI Activity Pulse
          </span>
          <h3 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
            Weekly Momentum & Velocity
          </h3>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold text-xs">
          <Flame
            size={15}
            className="text-amber-400 fill-amber-400 animate-pulse"
          />
          <span>{summary.streakDays}-Day Submission Streak! 🔥</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-indigo-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200">
            <Send size={14} className="text-indigo-400" />
            <span>This Week</span>
          </div>
          <span className="text-2xl font-extrabold text-white">
            {summary.applicationsThisWeek}
          </span>
          <span className="block text-[10px] text-indigo-300">
            Submissions sent
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200">
            <CalendarCheck size={14} className="text-amber-400" />
            <span>This Month</span>
          </div>
          <span className="text-2xl font-extrabold text-white">
            {summary.interviewsThisMonth}
          </span>
          <span className="block text-[10px] text-indigo-300">
            Interviews booked
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200">
            <Award size={14} className="text-emerald-400" />
            <span>Offers</span>
          </div>
          <span className="text-2xl font-extrabold text-white">
            {summary.offersCount}
          </span>
          <span className="block text-[10px] text-indigo-300">
            Offers received
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200">
            <Clock size={14} className="text-purple-400" />
            <span>Avg Response</span>
          </div>
          <span className="text-2xl font-extrabold text-white">
            {summary.avgResponseTimeDays}d
          </span>
          <span className="block text-[10px] text-indigo-300">
            Recruiter turnaround
          </span>
        </div>
      </div>
    </div>
  );
}
