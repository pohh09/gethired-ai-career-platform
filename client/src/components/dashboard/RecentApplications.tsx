import { useNavigate } from "react-router-dom";
import { ArrowRight, ExternalLink, Calendar, ChevronRight, Briefcase } from "lucide-react";
import Button from "../ui/Button";
import StatusBadge from "../jobs/StatusBadge";
import PriorityBadge from "../jobs/PriorityBadge";
import SectionTitle from "./SectionTitle";
import type { Job } from "../../types/job";

export interface RecentApplicationsProps {
  jobs?: Job[];
  isLoading?: boolean;
  onViewAllClick?: () => void;
  className?: string;
}

export default function RecentApplications({
  jobs = [],
  isLoading = false,
  onViewAllClick,
  className = "",
}: RecentApplicationsProps) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
    } else {
      navigate("/jobs");
    }
  };

  const displayedJobs = jobs.slice(0, 5);

  return (
    <div className={`space-y-3.5 ${className}`}>
      <SectionTitle
        title="Recent Applications"
        subtitle="Latest job submissions and pipeline stage status"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAll}
            rightIcon={<ArrowRight size={14} />}
            className="w-full sm:w-auto justify-between sm:justify-center text-xs font-extrabold"
          >
            <span>View All</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 sm:hidden">
              {jobs.length}
            </span>
          </Button>
        }
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 p-2 sm:p-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3 space-y-2 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedJobs.length === 0 ? (
          <div className="py-10 px-4 text-center space-y-3">
            <div className="h-10 w-10 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <Briefcase size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                No recent job applications found
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Track new job applications to view real-time stage progress here.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/jobs")}
              className="text-xs"
            >
              Add First Application
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile Card List View (< sm screens) */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800/70">
              {displayedJobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => navigate("/jobs")}
                  className="p-3.5 space-y-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100/70 dark:active:bg-slate-800/70 transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate leading-tight">
                          {job.company}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate mt-0.5">
                          {job.role}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <PriorityBadge priority={job.priority} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={job.status} size="sm" />
                      <span className="flex items-center gap-1 font-medium text-[10px] text-slate-400">
                        <Calendar size={11} />
                        <span>
                          {job.appliedDate
                            ? new Date(job.appliedDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "Recently"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-[11px] font-extrabold text-blue-600 dark:text-cyan-400">
                      <span>Details</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= sm screens) */}
            <div className="hidden sm:block overflow-x-auto">
              <table
                className="w-full text-left border-collapse text-xs"
                role="table"
                aria-label="Recent job applications"
              >
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Role Title</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {displayedJobs.map((job) => (
                    <tr
                      key={job._id}
                      onClick={() => navigate("/jobs")}
                      className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs shrink-0">
                            {job.company.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">
                            {job.company}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {job.role}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={job.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={job.priority} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {job.appliedDate
                          ? new Date(job.appliedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/jobs");
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="View Job Details"
                        >
                          <ExternalLink size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

