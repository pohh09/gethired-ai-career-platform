import React, { useState } from "react";
import { Sparkles, FileText, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import Loader from "../ui/Loader";
import ResumeAnalysis from "../ai/ResumeAnalysis";
import { optimizeResume } from "../../services/aiService";
import type { Job } from "../../types/job";
import type { ResumeOptimizationResult } from "../../types/ai";

export interface ResumeOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function ResumeOptimizerModal({
  isOpen,
  onClose,
  job,
}: ResumeOptimizerModalProps) {
  const [resumeText, setResumeText] = useState<string>(
    "Senior Full-Stack Software Engineer with 5+ years of experience in React, TypeScript, Node.js, REST APIs, and database architecture.",
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResumeOptimizationResult | null>(null);

  if (!job) return null;

  const jobDescription = job.notes
    ? `${job.role} at ${job.company}\nLocation: ${job.location || "Remote"}\nNotes: ${job.notes}`
    : `${job.role} at ${job.company} - Modern web applications engineering role requiring TypeScript and React expertise.`;

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error("Please enter or upload your resume content.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await optimizeResume({
        resumeText,
        jobDescription,
      });

      if (response.success && response.data) {
        setResult(response.data);
        toast.success("Resume optimization completed!");
      } else {
        toast.error("Optimization failed. Please try again.");
      }
    } catch (_err) {
      toast.error("Failed to connect to AI optimizer service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setResumeText(text);
          toast.success(`Loaded ${file.name}`);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-200/50">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              AI Resume Optimizer
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tailoring resume content for {job.role} at {job.company}
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {!result && !isLoading && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500 shrink-0" />
              <span>
                Provide your current resume text to generate optimized bullet
                points, impact metrics, ATS score breakdowns, and executive
                rewrites for {job.company}.
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText size={14} />
                  <span>Resume Text</span>
                </label>

                <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1">
                  <Upload size={12} />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <Textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your current resume content here..."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyze}
                leftIcon={<Sparkles size={18} />}
              >
                Optimize Resume
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-12 text-center space-y-4">
            <Loader size="lg" className="mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Optimizing Resume for {job.company}...
              </h4>
              <p className="text-xs text-slate-500">
                Analyzing skill keywords, action verbs, and impact metrics.
              </p>
            </div>
          </div>
        )}

        {result && !isLoading && (
          <ResumeAnalysis
            result={result}
            onRegenerate={handleAnalyze}
            onUploadNew={() => setResult(null)}
          />
        )}
      </div>
    </Modal>
  );
}
