import { FileText, Download, Star } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import type { ResumeItem } from "../../store/resumeStore";

export interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeItem | null;
  onMakeDefault?: (id: string) => void;
}

export default function ResumePreviewModal({
  isOpen,
  onClose,
  resume,
  onMakeDefault,
}: ResumePreviewModalProps) {
  if (!resume) return null;

  const handleDownload = () => {
    const blob = new Blob([resume.content], {
      type: "text/plain;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", resume.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${resume.fileName}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-200/50">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {resume.name}
              </h3>
              {resume.isDefault && (
                <Badge variant="Applied" size="sm">
                  Default Resume
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {resume.fileName} • {resume.fileSize} • Uploaded{" "}
              {resume.uploadDate}
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-5">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto scrollbar-thin">
          {resume.content}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            {!resume.isDefault && onMakeDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onMakeDefault(resume.id);
                  toast.success("Set as default resume!");
                }}
                leftIcon={<Star size={14} className="text-amber-500" />}
              >
                Set as Default Resume
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download size={14} />}
            >
              Download
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
