import { FileText } from "lucide-react";
import Modal from "../ui/Modal";
import CoverLetterGenerator from "./CoverLetterGenerator";
import type { Job } from "../../types/job";

export interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onSaveNotes?: (updatedJob: Job, notes: string) => void;
}

export default function CoverLetterModal({
  isOpen,
  onClose,
  job,
}: CoverLetterModalProps) {
  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-xs">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              AI Cover Letter Generator
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {job.role} at {job.company}
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <CoverLetterGenerator initialJob={job} />
    </Modal>
  );
}
