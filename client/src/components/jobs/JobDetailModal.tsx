import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Sparkles,
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  Mail,
  FileSpreadsheet,
  Edit2,
  Trash2,
} from "lucide-react";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ResumeMatchModal from "./ResumeMatchModal";
import ResumeOptimizerModal from "./ResumeOptimizerModal";
import FollowUpEmailModal from "./FollowUpEmailModal";
import AIJobAnalysisModal from "./AIJobAnalysisModal";
import { useReminderStore } from "../../store/reminderStore";
import type { Job, DiscoverJob } from "../../types/job";

export interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | DiscoverJob | null;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}

export default function JobDetailModal({
  isOpen,
  onClose,
  job,
  onEdit,
  onDelete,
}: JobDetailModalProps) {
  const navigate = useNavigate();
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
  const [isOptimizerModalOpen, setIsOptimizerModalOpen] =
    useState<boolean>(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] =
    useState<boolean>(false);
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState<boolean>(false);

  if (!job) return null;

  const isDiscover = !("_id" in job);
  const normalizedJob: Job = {
    _id: isDiscover ? (job as DiscoverJob).id : (job as Job)._id,
    company: job.company,
    role: job.role,
    location: job.location || "Remote",
    salary: (job as any).salary || null,
    status: isDiscover ? "Applied" : (job as Job).status,
    priority: isDiscover ? "High" : (job as Job).priority,
    jobLink: job.jobLink || "",
    notes: isDiscover
      ? (job as DiscoverJob).description
      : (job as Job).notes || "",
    appliedDate: isDiscover
      ? (job as DiscoverJob).postedDate
      : (job as Job).appliedDate || (job as Job).createdAt,
    createdAt: isDiscover ? new Date().toISOString() : (job as Job).createdAt,
  };

  const timelineStages = [
    { label: "Applied", date: normalizedJob.appliedDate },
    {
      label: "Screening",
      date: normalizedJob.status !== "Applied" ? "Completed" : "Pending",
    },
    {
      label: "Interview",
      date: ["Interview", "HR Round", "Offer"].includes(normalizedJob.status)
        ? "In Progress"
        : "Pending",
    },
    {
      label: "Decision",
      date:
        normalizedJob.status === "Offer"
          ? "Offer Received"
          : normalizedJob.status === "Rejected"
            ? "Declined"
            : "Pending",
    },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              {normalizedJob.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {normalizedJob.company}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Briefcase size={13} />
                {normalizedJob.role}
              </p>
            </div>
          </div>
        }
        maxWidth="2xl"
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Status
                </span>
                <Badge variant={normalizedJob.status} dot>
                  {normalizedJob.status}
                </Badge>
              </div>

              <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800" />

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Priority
                </span>
                <Badge variant={normalizedJob.priority}>
                  {normalizedJob.priority} Priority
                </Badge>
              </div>
            </div>

            {!isDiscover && (
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onEdit(normalizedJob);
                    }}
                    leftIcon={<Edit2 size={13} />}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onDelete(normalizedJob);
                    }}
                    className="text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl border border-sky-200/70 dark:border-sky-900/50 bg-gradient-to-r from-sky-50/50 via-cyan-50/30 to-white dark:from-sky-950/30 dark:via-cyan-950/20 dark:to-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-900 dark:text-cyan-300 flex items-center gap-1.5">
                <Sparkles size={15} className="text-cyan-500 animate-pulse" />
                <span>AI Productivity Actions</span>
              </h4>
              <span className="text-[11px] font-medium text-slate-400">
                6 Smart Tools Available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIsAIAnalysisOpen(true)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-cyan-200 dark:border-cyan-800/60 bg-white dark:bg-slate-900 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 transition-all text-xs font-bold text-left cursor-pointer shadow-xs"
              >
                <Sparkles size={14} className="text-cyan-500 shrink-0" />
                <span className="truncate">AI Analyze Job</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMatchModalOpen(true)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-all text-xs font-bold text-left cursor-pointer shadow-xs"
              >
                <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                <span className="truncate">Resume Match</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOptimizerModalOpen(true)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 transition-all text-xs font-bold text-left cursor-pointer shadow-xs"
              >
                <FileText size={14} className="text-sky-500 shrink-0" />
                <span className="truncate">Resume Optimizer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  const params = new URLSearchParams({
                    role: normalizedJob.role,
                  });
                  if (normalizedJob.notes) params.append("jd", normalizedJob.notes);
                  navigate(`/interview-prep?${params.toString()}`);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-all text-xs font-bold text-left cursor-pointer shadow-xs"
              >
                <BookOpen size={14} className="text-amber-500 shrink-0" />
                <span className="truncate">Interview Prep</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  const params = new URLSearchParams({
                    tab: "jobs",
                    role: normalizedJob.role,
                    company: normalizedJob.company,
                  });
                  if (normalizedJob.notes) params.append("jd", normalizedJob.notes);
                  navigate(`/ai-workspace?${params.toString()}`);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-all text-xs font-bold text-left cursor-pointer shadow-xs"
              >
                <FileSpreadsheet
                  size={14}
                  className="text-emerald-500 shrink-0"
                />
                <span className="truncate">Cover Letter</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFollowUpModalOpen(true)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 transition-all text-xs font-bold text-left cursor-pointer shadow-xs"
              >
                <Mail size={14} className="text-sky-500 shrink-0" />
                <span className="truncate">Follow-up Email</span>
              </button>
            </div>
          </div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
              <MapPin size={18} className="text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Location
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {normalizedJob.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
              <DollarSign size={18} className="text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Salary / Compensation
                </span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {normalizedJob.salary
                    ? `$${normalizedJob.salary.toLocaleString()}/yr`
                    : "Not specified"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Calendar size={18} className="text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Applied Date / Posted
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {normalizedJob.appliedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock size={14} className="text-blue-500" />
              <span>Application Timeline</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {timelineStages.map((stg, idx) => (
                <div
                  key={stg.label}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-center space-y-1"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                    Step 0{idx + 1}
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {stg.label}
                  </p>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {stg.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-500" />
                <span>Job Reminders & Alert Schedules</span>
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  useReminderStore.getState().addReminder({
                    jobId: normalizedJob._id,
                    company: normalizedJob.company,
                    role: normalizedJob.role,
                    type: "Follow-up",
                    title: `Follow up with recruiter at ${normalizedJob.company}`,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0],
                  });
                  toast.success("Scheduled follow-up reminder for 7 days!");
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-all cursor-pointer shadow-2xs"
              >
                + Follow up in 7 days
              </button>

              <button
                type="button"
                onClick={() => {
                  useReminderStore.getState().addReminder({
                    jobId: normalizedJob._id,
                    company: normalizedJob.company,
                    role: normalizedJob.role,
                    type: "Interview",
                    title: `Upcoming interview preparation for ${normalizedJob.role}`,
                    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0],
                  });
                  toast.success("Scheduled interview reminder for tomorrow!");
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-all cursor-pointer shadow-2xs"
              >
                + Interview Tomorrow
              </button>

              <button
                type="button"
                onClick={() => {
                  useReminderStore.getState().addReminder({
                    jobId: normalizedJob._id,
                    company: normalizedJob.company,
                    role: normalizedJob.role,
                    type: "Assessment",
                    title: `Complete technical assessment test for ${normalizedJob.company}`,
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0],
                  });
                  toast.success("Scheduled assessment deadline reminder!");
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-all cursor-pointer shadow-2xs"
              >
                + Assessment Deadline
              </button>
            </div>
          </div>

          {normalizedJob.jobLink && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Job Posting Link
              </span>
              <a
                href={normalizedJob.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline break-all p-3 rounded-xl bg-blue-50/40 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 w-full"
              >
                <span className="truncate">{normalizedJob.jobLink}</span>
                <ExternalLink size={14} className="shrink-0" />
              </a>
            </div>
          )}

          {normalizedJob.notes && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Job Description & Application Notes
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 leading-relaxed whitespace-pre-wrap">
                {normalizedJob.notes}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={onClose}>
              Close Details
            </Button>
          </div>
        </div>
      </Modal>

      <ResumeMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        job={normalizedJob}
      />

      <ResumeOptimizerModal
        isOpen={isOptimizerModalOpen}
        onClose={() => setIsOptimizerModalOpen(false)}
        job={normalizedJob}
      />

      <FollowUpEmailModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        job={normalizedJob}
      />

      <AIJobAnalysisModal
        isOpen={isAIAnalysisOpen}
        onClose={() => setIsAIAnalysisOpen(false)}
        job={normalizedJob}
      />
    </>
  );
}
