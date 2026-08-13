import { motion } from "framer-motion";
import { ExternalLink, Calendar, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import ActionMenu from "./ActionMenu";
import type { Job } from "../../types/job";

export interface DataTableProps {
  jobs: Job[];
  onView?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDuplicate?: (job: Job) => void;
  onArchive?: (job: Job) => void;
  onDelete?: (job: Job) => void;
  className?: string;
}

export default function DataTable({
  jobs,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  className = "",
}: DataTableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs ${className}`}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-4 px-5 font-bold">Company & Role</th>
            <th className="py-4 px-5 font-bold hidden md:table-cell">
              Location
            </th>
            <th className="py-4 px-5 font-bold hidden lg:table-cell">Salary</th>
            <th className="py-4 px-5 font-bold">Status</th>
            <th className="py-4 px-5 font-bold hidden sm:table-cell">
              Priority
            </th>
            <th className="py-4 px-5 font-bold hidden xl:table-cell">
              Applied Date
            </th>
            <th className="py-4 px-5 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {jobs.map((job) => {
            const formattedDate = new Date(
              job.appliedDate || job.createdAt,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <motion.tr
                key={job._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                onClick={() => onView && onView(job)}
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ring-2 ring-indigo-500/10">
                      {job.company.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {job.company}
                        </span>
                        {job.jobLink && (
                          <a
                            href={job.jobLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                            title="Open job URL"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                        {job.role}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-5 text-slate-600 dark:text-slate-300 hidden md:table-cell font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" />
                    {job.location || "Remote"}
                  </span>
                </td>

                <td className="py-4 px-5 font-mono font-bold text-slate-800 dark:text-slate-200 hidden lg:table-cell">
                  {job.salary ? `$${job.salary.toLocaleString()}` : "N/A"}
                </td>

                <td className="py-4 px-5">
                  <StatusBadge status={job.status} />
                </td>

                <td className="py-4 px-5 hidden sm:table-cell">
                  <PriorityBadge priority={job.priority} />
                </td>

                <td className="py-4 px-5 text-slate-500 dark:text-slate-400 hidden xl:table-cell whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Calendar size={13} className="text-slate-400" />
                    {formattedDate}
                  </span>
                </td>

                <td
                  className="py-4 px-5 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionMenu
                    onView={onView ? () => onView(job) : undefined}
                    onEdit={onEdit ? () => onEdit(job) : undefined}
                    onDuplicate={
                      onDuplicate ? () => onDuplicate(job) : undefined
                    }
                    onArchive={onArchive ? () => onArchive(job) : undefined}
                    onDelete={onDelete ? () => onDelete(job) : undefined}
                  />
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
