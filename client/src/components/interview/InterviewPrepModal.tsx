import { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  PlayCircle,
  Trophy,
  HelpCircle,
  Building,
  Briefcase,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import QuestionCard from "./QuestionCard";
import PracticeMode from "./PracticeMode";
import MockInterview from "./MockInterview";
import ScoreCard from "./ScoreCard";
import { fetchInterviewPrep } from "../../services/aiInterviewService";
import type { Job } from "../../types/job";
import type { InterviewPrepResult } from "../../types/interview";

export interface InterviewPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export type ModalTab = "guide" | "practice" | "mock" | "readiness";

export default function InterviewPrepModal({
  isOpen,
  onClose,
  job,
}: InterviewPrepModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("guide");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<InterviewPrepResult | null>(null);

  useEffect(() => {
    if (isOpen && job) {
      loadPrepData();
    }
  }, [isOpen, job]);

  if (!job) return null;

  const loadPrepData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchInterviewPrep({
        company: job.company,
        role: job.role,
        jobDescription: job.notes || `${job.role} at ${job.company}`,
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast.error("Failed to generate AI interview prep.");
      }
    } catch (_err) {
      toast.error("Error connecting to interview prep service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrep = () => {
    if (!result) return;
    const text = `
AI Interview Prep Guide for ${job.role} at ${job.company}

Company Overview:
${result.companySummary}

Technical Topics to Revise:
${result.technicalTopics.map((t) => `- ${t}`).join("\n")}

Questions to Ask the Interviewer:
${result.questionsToAskInterviewer.map((q) => `- ${q}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("Interview prep guide copied to clipboard!");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              AI Interview Preparation
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {job.role} at {job.company}
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {result && !isLoading && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === "guide"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <BookOpen size={14} />
              <span>Full Prep Guide</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("practice")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === "practice"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <PlayCircle size={14} />
              <span>Practice Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("mock")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === "mock"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Trophy size={14} />
              <span>Mock Interview (10 Qs)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("readiness")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === "readiness"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Sparkles size={14} />
              <span>Readiness Score</span>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="p-12 text-center space-y-4">
            <Loader size="lg" className="mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Generating Interview Preparation with AI...
              </h4>
              <p className="text-xs text-slate-500">
                Customizing questions for {job.role} at {job.company}.
              </p>
            </div>
          </div>
        )}

        {result && !isLoading && activeTab === "guide" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
              <h4 className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                <Building size={14} />
                <span>Company Overview & Culture Summary</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {result.companySummary}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Interview Questions & Answers ({result.questions.length})
              </h4>
              <div className="space-y-3">
                {result.questions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2">
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-indigo-500" />
                  <span>Important Technical Revision Topics</span>
                </h5>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {result.technicalTopics.map((t, idx) => (
                    <li key={idx}>• {t}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2">
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-purple-500" />
                  <span>Questions to Ask the Interviewer</span>
                </h5>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {result.questionsToAskInterviewer.map((q, idx) => (
                    <li key={idx}>• {q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {result && !isLoading && activeTab === "practice" && (
          <PracticeMode questions={result.questions} />
        )}

        {result && !isLoading && activeTab === "mock" && (
          <MockInterview questions={result.questions} />
        )}

        {result && !isLoading && activeTab === "readiness" && (
          <ScoreCard metrics={result.readinessMetrics} />
        )}

        {result && !isLoading && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPrep}
              leftIcon={<Copy size={14} />}
            >
              Copy Guide
            </Button>

            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
