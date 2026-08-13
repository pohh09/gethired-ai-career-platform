import { Link } from "react-router-dom";
import { ArrowRight, Building2, Calendar } from "lucide-react";
import Badge from "../ui/Badge";
import Skeleton from "../ui/Skeleton";
import type { Job } from "../../types/job";

export interface RecentActivityCardProps {
  jobs?: Job[];
  isLoading?: boolean;
  className?: string;
}

export default function RecentActivityCard({
  jobs = [],
  isLoading = false,
  className = "",
}: RecentActivityCardProps) {
  if (isLoading) {
    return (
      <div
        className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-1.5">
            <Skeleton width="140px" height={20} />
            <Skeleton width="200px" height={14} />
          </div>
          <Skeleton width="80px" height={28} className="rounded-full" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/60"
            >
              <div className="flex items-center gap-3">
                <Skeleton circle width={36} height={36} />
                <div className="space-y-1">
                  <Skeleton width="120px" height={14} />
                  <Skeleton width="80px" height={12} />
                </div>
              </div>
              <Skeleton width="70px" height={22} className="rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Recent Applications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Latest additions to your application pipeline
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <Building2
            size={32}
            className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
          />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            No recent job applications recorded.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {jobs.map((job) => {
            const formattedDate = new Date(
              job.appliedDate || job.createdAt,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={job._id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-indigo-100 dark:from-indigo-950/60 dark:to-slate-800 border border-indigo-200/50 dark:border-indigo-800/30 flex items-center justify-center font-bold text-sm text-indigo-700 dark:text-indigo-300 shrink-0">
                    {job.company.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {job.company}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate">{job.role}</span>
                      <span className="text-slate-300 dark:text-slate-700">
                        •
                      </span>
                      <span className="inline-flex items-center gap-1 shrink-0 text-[11px]">
                        <Calendar size={11} className="text-slate-400" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Badge variant={job.status} dot>
                    {job.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
