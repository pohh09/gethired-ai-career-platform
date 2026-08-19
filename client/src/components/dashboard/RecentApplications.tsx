import { useNavigate } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
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
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Recent Applications"
        subtitle="Latest job submissions and pipeline stage status"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAll}
            rightIcon={<ArrowRight size={14} />}
          >
            View All Applications
          </Button>
        }
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="space-y-3 p-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"
              />
            ))}
          </div>
        ) : displayedJobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No recent job applications found.
          </div>
        ) : (
          <table
            className="w-full text-left border-collapse text-xs"
            role="table"
            aria-label="Recent job applications"
          >
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3 px-4 rounded-tl-xl">Company</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4 text-right rounded-tr-xl">Action</th>
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
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs shrink-0">
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="View Job Details"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
