import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  DollarSign,
  Briefcase,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import Modal from "../ui/Modal";
import type { Job } from "../../types/job";

export interface AIJobAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function AIJobAnalysisModal({
  isOpen,
  onClose,
  job,
}: AIJobAnalysisModalProps) {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const matchScore = 88;
  const matchingSkills = [
    "React",
    "TypeScript",
    "Node.js",
    "REST APIs",
    "Tailwind CSS",
  ];
  const missingSkills = [
    "GraphQL",
    "Docker / Kubernetes",
    "AWS S3 / CloudFront",
  ];
  const resumeSuggestions = [
    "Highlight experience with high-throughput API endpoints in your work history.",
    "Add metric quantitative numbers (e.g. 'boosted page speed by 35%').",
    "Include TypeScript strict-mode project achievements.",
  ];
  const interviewTips = [
    "Be ready to explain React 19 Server Components vs Client Component boundaries.",
    "Prepare a STAR story about managing complex async state and handling network latency.",
    "Review system design principles for frontend caching and state persistence.",
  ];
  const salaryInsights = {
    median: "₹24,00,000 / yr",
    range: "₹18,00,000 - ₹32,00,000 / yr",
    percentile: "Top 15% in Indian Tech Industry",
  };
  const learningSuggestions = [
    "GraphQL Basics & Apollo Client integration course (2 hrs)",
    "Docker Microservice containerization walkthrough",
    "AWS Certified Developer associate overview",
  ];

  const handleCopySummary = () => {
    const summaryText = `AI Analysis for ${job.role} at ${job.company}:\nMatch Score: ${matchScore}%\nMatching Skills: ${matchingSkills.join(", ")}\nMissing Skills: ${missingSkills.join(", ")}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              AI Job Analysis: {job.company}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {job.role} • Deep Intelligent Match Breakdown
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider block">
              Overall AI Fit Score
            </span>
            <p className="text-3xl font-extrabold text-white mt-1">
              {matchScore}% Match Rate
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Strong alignment with your technical background and experience.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
          >
            {copied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
            <span>{copied ? "Copied Report" : "Copy Analysis"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2
                size={15}
                className="text-emerald-600 dark:text-emerald-400"
              />
              <span>Matching Skills ({matchingSkills.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle
                size={15}
                className="text-amber-600 dark:text-amber-400"
              />
              <span>Skill Gaps ({missingSkills.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-bold"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Lightbulb size={15} className="text-amber-500" />
            <span>Resume Tailoring Suggestions</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
            {resumeSuggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
            <BookOpen
              size={15}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <span>Targeted Interview Questions & Prep</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-indigo-950 dark:text-indigo-200 font-medium">
            {interviewTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <DollarSign size={13} /> Salary Benchmark
            </span>
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {salaryInsights.median}
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-500 font-bold block">
              {salaryInsights.range}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
              {salaryInsights.percentile}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Briefcase size={15} className="text-purple-500" />
            <span>Recommended Quick Upskilling</span>
          </h4>
          <div className="space-y-1.5">
            {learningSuggestions.map((ls, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
              >
                <span>{ls}</span>
                <span className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-[10px]">
                  Recommended
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </Modal>
  );
}
