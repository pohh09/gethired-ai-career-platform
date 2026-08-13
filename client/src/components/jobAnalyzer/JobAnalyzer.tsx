import { useState, useEffect } from "react";
import {
  Sparkles,
  AlertCircle,
  FileText,
  BookOpen,
  Clock,
  BookmarkPlus,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MatchScore from "./MatchScore";
import RecommendationCard from "./RecommendationCard";
import RedFlags from "./RedFlags";
import SalaryInsight from "./SalaryInsight";
import SkillGap from "./SkillGap";
import LearningSuggestions from "./LearningSuggestions";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Loader from "../ui/Loader";
import Skeleton from "../ui/Skeleton";
import CoverLetterModal from "../coverLetter/CoverLetterModal";
import InterviewPrepModal from "../interview/InterviewPrepModal";
import { analyzeJobDescription } from "../../services/jobAnalyzerService";
import type { Job } from "../../types/job";
import type {
  JobAnalyzerResult,
  SavedAnalysisHistory,
} from "../../types/jobAnalyzer";

export interface JobAnalyzerProps {
  initialJob?: Job | null;
  className?: string;
}

export default function JobAnalyzer({
  initialJob = null,
  className = "",
}: JobAnalyzerProps) {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState<string>(initialJob?.role || "");
  const [company, setCompany] = useState<string>(initialJob?.company || "");
  const [jobDescription, setJobDescription] = useState<string>(
    initialJob?.notes || "",
  );
  const [resumeText, setResumeText] = useState<string>("");
  const [showAdvancedInputs, setShowAdvancedInputs] = useState<boolean>(false);

  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState<boolean>(false);
  const [isInterviewPrepOpen, setIsInterviewPrepOpen] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobAnalyzerResult | null>(null);
  const [history, setHistory] = useState<SavedAnalysisHistory[]>([]);

  useEffect(() => {
    if (initialJob) {
      setJobTitle(initialJob.role);
      setCompany(initialJob.company);
      setJobDescription(
        initialJob.notes
          ? `${initialJob.role} at ${initialJob.company}\nLocation: ${initialJob.location || "Remote"}\nNotes: ${initialJob.notes}`
          : `${initialJob.role} at ${initialJob.company}\nLocation: ${initialJob.location || "Remote"}`,
      );
    }
  }, [initialJob]);

  useEffect(() => {
    const savedResume = localStorage.getItem("jobflow_user_resume_text");
    if (savedResume) {
      setResumeText(savedResume);
    }

    const savedHistoryStr = localStorage.getItem("jobflow_saved_analyzers");
    if (savedHistoryStr) {
      try {
        setHistory(JSON.parse(savedHistoryStr));
      } catch (_e) {
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!jobTitle.trim()) {
      toast.error("Please enter a job title.");
      return;
    }
    if (!company.trim()) {
      toast.error("Please enter a company name.");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (resumeText.trim()) {
      localStorage.setItem("jobflow_user_resume_text", resumeText.trim());
    }

    try {
      const response = await analyzeJobDescription({
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        jobDescription: jobDescription.trim(),
        resumeText: resumeText.trim(),
      });

      if (response.success && response.data) {
        setResult(response.data);
        toast.success("Job description analyzed with AI!");
      } else {
        setError(response.message || "Failed to analyze job description.");
        toast.error("Analysis failed.");
      }
    } catch (_err) {
      setError("Network or server connection error.");
      toast.error("Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAnalysis = () => {
    if (!result) return;
    const newEntry: SavedAnalysisHistory = {
      id: `analysis-${Date.now()}`,
      jobTitle,
      company,
      timestamp: new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      result,
    };

    const updatedHistory = [
      newEntry,
      ...history.filter(
        (h) => h.jobTitle !== jobTitle || h.company !== company,
      ),
    ];
    setHistory(updatedHistory);
    localStorage.setItem(
      "jobflow_saved_analyzers",
      JSON.stringify(updatedHistory),
    );
    toast.success("Analysis saved to history!");
  };

  const handleReopenHistory = (item: SavedAnalysisHistory) => {
    setJobTitle(item.jobTitle);
    setCompany(item.company);
    setResult(item.result);
    toast.success(`Reopened analysis for ${item.company}`);
  };

  const dummyJob: Job = {
    _id: initialJob?._id || `temp-${Date.now()}`,
    company: company || "Target Company",
    role: jobTitle || "Target Role",
    location: "Remote",
    salary: null,
    status: "Applied",
    priority: "Medium",
    jobLink: "",
    notes: jobDescription,
    appliedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Job Posting & Candidate Inputs
              </h3>
              <p className="text-xs text-slate-500">
                AI will evaluate compatibility, red flags, market salary, and
                skill gaps.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedInputs((prev) => !prev)}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            {showAdvancedInputs
              ? "Hide Text Fields"
              : "Edit JD & Resume Inputs"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Job Title / Role"
            placeholder="e.g. Senior Full Stack Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
          <Input
            label="Company Name"
            placeholder="e.g. Stripe, Airbnb, Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        {showAdvancedInputs && (
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Job Description Text
              </label>
              <Textarea
                rows={4}
                placeholder="Paste full job description, requirements, or responsibilities..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Candidate Resume Summary (Optional)
              </label>
              <Textarea
                rows={3}
                placeholder="Paste your technical skills or resume work experience..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {!result && !isLoading && (
        <div className="text-center pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAnalyze}
            leftIcon={<Sparkles size={18} />}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-md"
          >
            Analyze Job Description with AI
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <Loader size="md" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Evaluating match score, red flags, and salary benchmarks for{" "}
              {company}...
            </span>
          </div>
          <Skeleton height={100} className="w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton height={80} />
            <Skeleton height={80} />
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-center space-y-3">
          <AlertCircle size={24} className="mx-auto text-rose-500" />
          <p className="text-xs font-semibold">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            leftIcon={<RotateCcw size={14} />}
          >
            Retry Analysis
          </Button>
        </div>
      )}

      {result && !isLoading && (
        <div className="space-y-8">
          <MatchScore
            score={result.matchScore}
            recommendation={result.recommendation}
            difficultyLevel={result.difficultyLevel}
            workType={result.workType}
            experienceRequired={result.experienceRequired}
          />

          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCoverLetterOpen(true)}
                leftIcon={<FileText size={14} className="text-emerald-500" />}
                className="border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 font-bold"
              >
                Generate Cover Letter
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/resume-optimizer")}
                leftIcon={<Sparkles size={14} className="text-purple-500" />}
                className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300 hover:bg-purple-50 font-bold"
              >
                Optimize Resume
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInterviewPrepOpen(true)}
                leftIcon={<BookOpen size={14} className="text-indigo-500" />}
                className="border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-50 font-bold"
              >
                Prepare Interview
              </Button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAnalysis}
              leftIcon={<BookmarkPlus size={14} />}
              className="bg-indigo-600 hover:bg-indigo-500"
            >
              Save Analysis
            </Button>
          </div>

          <RecommendationCard
            recommendation={result.recommendation}
            recommendationReason={result.recommendationReason}
            jobSummary={result.jobSummary}
            strengths={result.strengths}
            weaknesses={result.weaknesses}
          />

          <RedFlags flags={result.redFlags} />

          <SalaryInsight salary={result.salaryInsight} />

          <SkillGap gap={result.skillGap} />

          <LearningSuggestions
            interviewTopics={result.interviewTopics}
            learningResources={result.learningResources}
          />
        </div>
      )}

      {history.length > 0 && (
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3 pt-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <Clock size={14} className="text-indigo-500" />
            <span>Saved Job Analysis History ({history.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => handleReopenHistory(h)}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-purple-400 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                    {h.company}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {h.result.matchScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                  {h.jobTitle}
                </p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {h.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <CoverLetterModal
        isOpen={isCoverLetterOpen}
        onClose={() => setIsCoverLetterOpen(false)}
        job={dummyJob}
      />

      <InterviewPrepModal
        isOpen={isInterviewPrepOpen}
        onClose={() => setIsInterviewPrepOpen(false)}
        job={dummyJob}
      />
    </div>
  );
}
