import { Calendar, Briefcase, Award, CheckCircle2, MessageSquare } from "lucide-react";
import StatusBadge from "../jobs/StatusBadge";
import type { Job } from "../../types/job";

export interface TimelineProps {
  jobs?: Job[];
  className?: string;
}

export default function Timeline({ jobs = [], className = "" }: TimelineProps) {
  const sortedJobs = [...jobs]
    .sort((a, b) => new Date(b.appliedDate || b.createdAt).getTime() - new Date(a.appliedDate || a.createdAt).getTime())
    .slice(0, 6);

  const getMilestoneIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "offer":
        return <Award size={14} className="text-emerald-500" />;
      case "interview":
      case "hr round":
        return <Calendar size={14} className="text-amber-500" />;
      case "assessment":
        return <CheckCircle2 size={14} className="text-purple-500" />;
      default:
        return <Briefcase size={14} className="text-blue-500" />;
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Application Milestones Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chronological milestone sequence across active application stages
          </p>
        </div>
      </div>

      {sortedJobs.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs font-medium">
          No application milestones recorded yet.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {sortedJobs.map((job) => {
            const formattedDate = new Date(job.appliedDate || job.createdAt).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            );

            return (
              <div key={job._id} className="relative group">

                <div className="absolute -left-6 top-0 h-5 w-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  {getMilestoneIcon(job.status)}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {job.company} — <span className="font-semibold text-slate-600 dark:text-slate-300">{job.role}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Applied on {formattedDate} • {job.location || "Remote"}
                    </p>
                  </div>

                  <div className="shrink-0 pt-1 sm:pt-0">
                    <StatusBadge status={job.status} size="sm" />
                  </div>
                </div>

                {job.notes && (
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 text-[11px] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/60 flex items-start gap-2">
                    <MessageSquare size={13} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{job.notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
