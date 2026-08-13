import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  FileText,
  BookOpen,
  FileSpreadsheet,
  Mail,
  ChevronDown,
} from "lucide-react";
import Button from "../ui/Button";
import ResumeMatchModal from "./ResumeMatchModal";
import ResumeOptimizerModal from "./ResumeOptimizerModal";
import FollowUpEmailModal from "./FollowUpEmailModal";
import InterviewPrepModal from "../interview/InterviewPrepModal";
import CoverLetterModal from "../coverLetter/CoverLetterModal";
import JobAnalyzerModal from "../jobAnalyzer/JobAnalyzerModal";
import type { Job, DiscoverJob } from "../../types/job";

export interface JobAiActionsMenuProps {
  job: Job | DiscoverJob;
  variant?: "button" | "icon" | "dropdown";
  className?: string;
}

export default function JobAiActionsMenu({
  job,
  variant = "dropdown",
  className = "",
}: JobAiActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isMatchOpen, setIsMatchOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isInterviewPrepOpen, setIsInterviewPrepOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all cursor-pointer"
          title="AI Productivity Actions"
        >
          <Sparkles size={16} className="animate-pulse" />
        </button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          leftIcon={
            <Sparkles size={13} className="text-purple-500 animate-pulse" />
          }
          rightIcon={
            <ChevronDown
              size={12}
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          }
          className="text-xs font-bold border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 px-2.5"
        >
          AI Suite
        </Button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Sparkles size={12} />
              AI Tools
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              6 Actions
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsAnalyzerOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-left cursor-pointer"
          >
            <Sparkles size={14} className="text-purple-500 shrink-0" />
            <span>AI Job Analyzer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsMatchOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-left cursor-pointer"
          >
            <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
            <span>AI Resume Match</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsOptimizerOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer"
          >
            <FileText size={14} className="text-indigo-500 shrink-0" />
            <span>AI Resume Optimizer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsCoverLetterOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
          >
            <FileSpreadsheet size={14} className="text-emerald-500 shrink-0" />
            <span>AI Cover Letter</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsInterviewPrepOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-700 dark:hover:text-amber-300 transition-colors text-left cursor-pointer"
          >
            <BookOpen size={14} className="text-amber-500 shrink-0" />
            <span>AI Interview Questions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsFollowUpOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-700 dark:hover:text-sky-300 transition-colors text-left cursor-pointer"
          >
            <Mail size={14} className="text-sky-500 shrink-0" />
            <span>AI Follow-up Email</span>
          </button>
        </div>
      )}

      <ResumeMatchModal
        isOpen={isMatchOpen}
        onClose={() => setIsMatchOpen(false)}
        job={normalizedJob}
      />

      <ResumeOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
        job={normalizedJob}
      />

      <JobAnalyzerModal
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        job={normalizedJob}
      />

      <CoverLetterModal
        isOpen={isCoverLetterOpen}
        onClose={() => setIsCoverLetterOpen(false)}
        job={normalizedJob}
      />

      <InterviewPrepModal
        isOpen={isInterviewPrepOpen}
        onClose={() => setIsInterviewPrepOpen(false)}
        job={normalizedJob}
      />

      <FollowUpEmailModal
        isOpen={isFollowUpOpen}
        onClose={() => setIsFollowUpOpen(false)}
        job={normalizedJob}
      />
    </div>
  );
}
