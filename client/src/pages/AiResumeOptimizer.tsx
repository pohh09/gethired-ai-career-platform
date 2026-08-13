import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import ResumeUpload from "../components/ai/ResumeUpload";
import ResumeAnalysis from "../components/ai/ResumeAnalysis";
import Loader from "../components/ui/Loader";
import Skeleton from "../components/ui/Skeleton";
import { optimizeResume } from "../services/aiService";
import type { ResumeOptimizationResult } from "../types/ai";

export default function AiResumeOptimizer() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResumeOptimizationResult | null>(null);
  const [lastResumeText, setLastResumeText] = useState<string>("");
  const [lastJd, setLastJd] = useState<string>("");

  const handleAnalyze = async (resumeText: string, jobDescription?: string) => {
    setLastResumeText(resumeText);
    setLastJd(jobDescription || "");
    setIsLoading(true);

    try {
      const response = await optimizeResume({
        resumeText,
        jobDescription,
      });

      if (response.success && response.data) {
        setResult(response.data);
        toast.success("Resume optimization complete!");
      } else {
        toast.error(
          "Analysis failed. Please check input content and try again.",
        );
      }
    } catch (_err) {
      toast.error("Failed to connect to AI optimizer service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastResumeText) {
      handleAnalyze(lastResumeText, lastJd);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="AI Resume Optimizer"
        subtitle="Upload your resume to receive instant ATS compatibility scores, keyword gaps, and executive rewrite recommendations."
      />

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4">
            <Loader size="lg" className="mx-auto" />
            <div className="space-y-2 max-w-sm mx-auto">
              <Skeleton height={20} width="80%" className="mx-auto" />
              <Skeleton height={14} width="60%" className="mx-auto" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <Skeleton height={16} width={120} />
              <Skeleton height={32} width={180} />
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <Skeleton height={16} width={120} />
              <Skeleton height={32} width={180} />
            </div>
          </div>
        </div>
      ) : result ? (
        <ResumeAnalysis
          result={result}
          onRegenerate={handleRegenerate}
          onUploadNew={() => setResult(null)}
        />
      ) : (
        <ResumeUpload onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}
    </div>
  );
}
