import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import Badge from "../ui/Badge";
import type { Job } from "../../types/job";

export interface KanbanBoardProps {
  jobs: Job[];
  onView: (job: Job) => void;
  onEdit: (job: Job) => void;
  onStatusChange: (job: Job, newStatus: string) => void;
  onDelete: (job: Job) => void;
}

const KANBAN_COLUMNS = [
  {
    id: "Saved",
    title: "Saved",
    color:
      "border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-800 dark:text-cyan-300",
  },
  {
    id: "Applied",
    title: "Applied",
    color:
      "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "Interview",
    title: "Interview",
    color:
      "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300",
  },
  {
    id: "Assessment",
    title: "Assessment",
    color:
      "border-sky-200 bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300",
  },
  {
    id: "Offer",
    title: "Offer",
    color:
      "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "Rejected",
    title: "Rejected",
    color:
      "border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300",
  },
];

export default function KanbanBoard({
  jobs,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: KanbanBoardProps) {
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, job: Job) => {
    e.dataTransfer.setData("text/plain", job._id);
    setDraggedJobId(job._id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData("text/plain") || draggedJobId;
    if (!jobId) return;

    const targetJob = jobs.find((j) => j._id === jobId);
    if (targetJob && targetJob.status !== targetStatus) {
      onStatusChange(targetJob, targetStatus);
    }
    setDraggedJobId(null);
  };

  return (
    <div className="overflow-x-auto pb-4 scrollbar-thin">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-[1100px]">
        {KANBAN_COLUMNS.map((col) => {
          const colJobs = jobs.filter((j) => j.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 p-3 min-h-[520px] transition-colors"
            >
              <div
                className={`p-3 rounded-2xl border ${col.color} mb-3 flex items-center justify-between shadow-2xs`}
              >
                <span className="text-xs font-extrabold tracking-wide uppercase">
                  {col.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-[11px] font-bold shadow-2xs">
                  {colJobs.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {colJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    layout
                    draggable
                    onDragStart={(e: any) => handleDragStart(e, job)}
                    whileHover={{ y: -2 }}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                            {job.company}
                          </h4>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                            {job.role}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === job._id ? null : job._id,
                            )
                          }
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {activeMenuId === job._id && (
                          <div className="absolute right-0 top-6 w-36 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-20 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onView(job);
                              }}
                              className="w-full px-3 py-1.5 text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                            >
                              <Eye size={13} /> View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onEdit(job);
                              }}
                              className="w-full px-3 py-1.5 text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                            >
                              <Edit2 size={13} /> Edit Card
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onDelete(job);
                              }}
                              className="w-full px-3 py-1.5 text-left font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                            >
                              <Trash2 size={13} /> Delete Card
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-slate-400" />
                        {job.location || "Remote"}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
                          <DollarSign size={11} />
                          {job.salary.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {job.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        {job.notes}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar size={11} />
                        {job.appliedDate
                          ? new Date(job.appliedDate).toLocaleDateString()
                          : "Saved"}
                      </span>

                      <Badge variant={job.priority} size="sm">
                        {job.priority}
                      </Badge>
                    </div>
                  </motion.div>
                ))}

                {colJobs.length === 0 && (
                  <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/60 flex flex-col items-center justify-center text-[11px] text-slate-400 font-medium">
                    <span>Drop cards here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
