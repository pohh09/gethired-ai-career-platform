import { motion } from "framer-motion";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import ActionMenu from "./ActionMenu";
import type { Job } from "../../types/job";

export interface JobCardProps {
  job: Job;
  onView?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDuplicate?: (job: Job) => void;
  onArchive?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}

export default function JobCard({
  job,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}: JobCardProps) {
  const formattedDate = new Date(
    job.appliedDate || job.createdAt,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onView && onView(job)}
      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs space-y-3 cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
            {job.company.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {job.company}
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
              {job.role}
            </p>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <ActionMenu
            onView={onView ? () => onView(job) : undefined}
            onEdit={onEdit ? () => onEdit(job) : undefined}
            onDuplicate={onDuplicate ? () => onDuplicate(job) : undefined}
            onArchive={onArchive ? () => onArchive(job) : undefined}
            onDelete={onDelete ? () => onDelete(job) : undefined}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <StatusBadge status={job.status} size="sm" />
        <PriorityBadge priority={job.priority} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <span className="truncate font-medium">
            {job.location || "Remote"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 truncate justify-end">
          <DollarSign size={13} className="text-slate-400 shrink-0" />
          <span className="font-mono text-slate-800 dark:text-slate-200 font-bold truncate">
            {job.salary ? `$${job.salary.toLocaleString()}` : "N/A"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
        <span className="inline-flex items-center gap-1">
          <Calendar size={12} />
          Applied on {formattedDate}
        </span>
        <span className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
          View Details →
        </span>
      </div>
    </motion.div>
  );
}
