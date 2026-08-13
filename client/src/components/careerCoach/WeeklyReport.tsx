import { Send, Users, Award, XCircle, Clock } from "lucide-react";
import type { WeeklyReportMetrics } from "../../types/careerCoach";

export interface WeeklyReportProps {
  metrics: WeeklyReportMetrics;
  className?: string;
}

export default function WeeklyReport({
  metrics,
  className = "",
}: WeeklyReportProps) {
  const cards = [
    {
      label: "Applications Sent",
      value: metrics.applicationsThisWeek,
      subtext: "This week",
      icon: Send,
      color:
        "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/50",
    },
    {
      label: "Interviews Attended",
      value: metrics.interviewsAttended,
      subtext: "Active rounds",
      icon: Users,
      color:
        "text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200/50",
    },
    {
      label: "Offers Received",
      value: metrics.offersReceived,
      subtext: "Offers",
      icon: Award,
      color:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/50",
    },
    {
      label: "Rejections",
      value: metrics.rejectionsCount,
      subtext: "Archived",
      icon: XCircle,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200/50",
    },
    {
      label: "Follow-ups Pending",
      value: metrics.followUpsPending,
      subtext: "Recruiter checks",
      icon: Clock,
      color:
        "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200/50",
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 ${className}`}
    >
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.label}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {c.label}
              </span>
              <div className={`p-1.5 rounded-lg border ${c.color}`}>
                <IconComponent size={14} />
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {c.value}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {c.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
