import { Sparkles } from "lucide-react";
import Modal from "../ui/Modal";
import JobAnalyzer from "./JobAnalyzer";
import type { Job } from "../../types/job";

export interface JobAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function JobAnalyzerModal({
  isOpen,
  onClose,
  job,
}: JobAnalyzerModalProps) {
  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              AI Job Description Analyzer
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Evaluating match & risks for {job.role} at {job.company}
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <JobAnalyzer initialJob={job} />
    </Modal>
  );
}
