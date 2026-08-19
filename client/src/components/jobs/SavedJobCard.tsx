import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  PlusCircle,
  Trash2,
  Eye,
  ExternalLink,
} from "lucide-react";
import Button from "../ui/Button";
import JobAiActionsMenu from "./JobAiActionsMenu";
import type { DiscoverJob } from "../../types/job";

export interface SavedJobCardProps {
  job: DiscoverJob;
  onMoveToApplications: (job: DiscoverJob) => void;
  onDelete: (job: DiscoverJob) => void;
  onViewDetails: (job: DiscoverJob) => void;
}

export default function SavedJobCard({
  job,
  onMoveToApplications,
  onDelete,
  onViewDetails,
}: SavedJobCardProps) {
  const provider = job.provider || "Saved";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="h-11 w-11 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-800 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-extrabold text-base shadow-xs shrink-0 ring-2 ring-blue-500/10">
                {job.company.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block truncate">
                {job.company}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
                {job.role}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60">
              {provider}
            </span>
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
              title="Open original job posting"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200/60 dark:border-blue-800/60">
            {job.workplaceType}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
            {job.employmentType}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate font-medium">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate justify-end">
            <DollarSign size={14} className="text-slate-400 shrink-0" />
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              {job.salaryText ||
                (job.salary
                  ? `$${job.salary.toLocaleString()}/yr`
                  : "Competitive")}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
          {job.description}
        </p>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onMoveToApplications(job)}
          leftIcon={<PlusCircle size={15} />}
          className="w-full text-xs font-extrabold shadow-xs"
        >
          Move to My Applications
        </Button>

        <div className="grid grid-cols-3 gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(job)}
            leftIcon={<Eye size={13} />}
            className="text-xs font-bold px-2"
          >
            Details
          </Button>

          <JobAiActionsMenu job={job} variant="button" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(job)}
            leftIcon={<Trash2 size={13} />}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2"
          >
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
