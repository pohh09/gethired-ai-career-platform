import { useState } from "react";
import { Mail, Copy, Check, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { Job } from "../../types/job";

export interface FollowUpEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function FollowUpEmailModal({
  isOpen,
  onClose,
  job,
}: FollowUpEmailModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [tone, setTone] = useState<"polite" | "enthusiastic" | "executive">(
    "polite",
  );

  if (!job) return null;

  const getEmailSubject = () => {
    return `Following up on my application for ${job.role} - ${job.company}`;
  };

  const getEmailBody = () => {
    const formattedDate = new Date(
      job.appliedDate || job.createdAt,
    ).toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (tone === "enthusiastic") {
      return `Dear Hiring Team at ${job.company},

I hope this message finds you well!

I submitted my application for the ${job.role} position on ${formattedDate} and wanted to express my continued enthusiasm for the role. Having closely followed ${job.company}'s work, I am very excited about the possibility of contributing to your team's mission.

Please let me know if you need any further information or additional samples of my work. I look forward to the opportunity to connect!

Best regards,
Candidate Name`;
    }

    if (tone === "executive") {
      return `Dear Hiring Manager,

I am writing to follow up on my recent submission for the ${job.role} opening at ${job.company} (submitted on ${formattedDate}).

Given my background delivering high-impact solutions in software engineering, I remain eager to discuss how my skill set aligns with your team's strategic goals for this role.

Thank you for your time and consideration. I welcome the opportunity for a brief conversation at your convenience.

Sincerely,
Candidate Name`;
    }

    return `Dear Recruiter / Hiring Team,

I hope you are having a great week.

I am following up on my application submitted on ${formattedDate} for the ${job.role} position at ${job.company}. I remain very interested in this role and would love to confirm if there are any updates regarding the hiring timeline or next steps.

Thank you for your time and support.

Best regards,
Candidate Name`;
  };

  const handleCopy = () => {
    const fullText = `Subject: ${getEmailSubject()}\n\n${getEmailBody()}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Follow-up email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-200/50">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Generate Follow-up Email
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tailored check-in email for {job.company}
            </p>
          </div>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Select Tone:
          </span>
          <div className="flex items-center gap-1.5">
            {(["polite", "enthusiastic", "executive"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  tone === t
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Email Subject Line
          </label>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
            {getEmailSubject()}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Generated Email Body
          </label>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
            {getEmailBody()}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles size={12} className="text-indigo-500" />
            AI Generated Template
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
            >
              {copied ? "Copied!" : "Copy Email"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
