import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Copy,
  RefreshCw,
  FileText,
  Briefcase,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import Loader from "../ui/Loader";
import { matchResumeWithJob } from "../../services/aiService";
import type { Job } from "../../types/job";
import type { ResumeMatchResult } from "../../types/ai";

export interface ResumeMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function ResumeMatchModal({
  isOpen,
  onClose,
  job,
}: ResumeMatchModalProps) {
  const [resumeText, setResumeText] = useState<string>(
    "Senior Product Engineer with 5+ years experience building web apps with React, TypeScript, Node.js, REST APIs, Tailwind CSS, and state management tools.",
  );
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResumeMatchResult | null>(null);

  useEffect(() => {
    if (job) {
      const jd = job.notes
        ? `${job.role} at ${job.company}\nLocation: ${job.location || "Remote"}\nNotes: ${job.notes}`
        : `${job.role} at ${job.company}\nRequirements: Experience in modern web development, TypeScript, state management, and building user interfaces.`;
      setJobDescription(jd);
      setResult(null);
    }
  }, [job]);

  if (!job) return null;

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error("Please enter or paste your resume text.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter or verify the job description.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await matchResumeWithJob({
        resumeText,
        jobDescription,
      });

      if (response.success && response.data) {
        setResult(response.data);
        toast.success("AI Resume Match analysis complete!");
      } else {
        toast.error("Analysis failed. Please try again.");
      }
    } catch (_err) {
      toast.error("Failed to connect to AI match service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const text = `
AI Resume Match Report for ${job.role} at ${job.company}
Match Score: ${result.matchScore}%

Matching Skills: ${result.matchingSkills.join(", ")}
Missing Skills: ${result.missingSkills.join(", ")}

Strengths:
${result.strengths.map((s) => `- ${s}`).join("\n")}

Suggestions:
${result.suggestions.map((s) => `- ${s}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("Analysis report copied to clipboard!");
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

  const scoreColor = (score: number) => {
    if (score >= 80)
      return "stroke-emerald-500 text-emerald-600 dark:text-emerald-400";
    if (score >= 60)
      return "stroke-amber-500 text-amber-600 dark:text-amber-400";
    return "stroke-rose-500 text-rose-600 dark:text-rose-400";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold border border-blue-200/50">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              AI Resume Match
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Comparing your resume against {job.role} at {job.company}
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {!result && !isLoading && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 text-xs text-sky-900 dark:text-sky-200 flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-500 shrink-0" />
              <span>
                Paste your resume text below or upload your PDF/DOCX content to
                analyze keyword match, ATS scores, and improvement
                recommendations.
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText size={14} />
                  <span>Candidate Resume Content</span>
                </label>

                <label className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
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
                rows={5}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume work history, technical skills, and experience bullet points..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Briefcase size={14} />
                <span>Job Description / Target Requirements</span>
              </label>

              <Textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Job description and required candidate skills..."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyze}
                leftIcon={<Sparkles size={18} />}
              >
                Analyze Resume Match
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-12 text-center space-y-4">
            <Loader size="lg" className="mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Analyzing Resume Match with AI...
              </h4>
              <p className="text-xs text-slate-500">
                Comparing skills, keyword frequencies, ATS metrics, and
                strengths.
              </p>
            </div>
          </div>
        )}

        {result && !isLoading && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  ATS Match Evaluation
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {result.matchScore >= 80
                    ? "Excellent Fit for this Role! 🎉"
                    : result.matchScore >= 60
                      ? "Good Match with Growth Potential 📈"
                      : "Resume Requires Optimization ⚠️"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target Role: {job.role} at {job.company}
                </p>
                {result.source === "fallback" && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
                    <AlertTriangle size={12} className="text-amber-600 shrink-0" />
                    <span>Estimated (AI temporarily unavailable — showing keyword-based analysis)</span>
                  </div>
                )}
              </div>

              <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`transition-all duration-1000 ${scoreColor(result.matchScore)}`}
                    strokeDasharray={`${result.matchScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold tracking-tight">
                    {result.matchScore}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                    Match
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs">
                  <CheckCircle2 size={16} />
                  <span>Matching Skills ({result.matchingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.matchingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300/40"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/30 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-extrabold text-xs">
                  <XCircle size={16} />
                  <span>
                    Missing / Recommended Skills ({result.missingSkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.missingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300/40"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2">
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-blue-500" />
                  <span>Resume Strengths</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {result.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2">
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span>Areas for Improvement</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {result.weaknesses.map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-cyan-200/60 dark:border-cyan-900/40 bg-cyan-50/40 dark:bg-cyan-950/20 space-y-3">
              <h5 className="text-xs font-extrabold text-cyan-950 dark:text-cyan-200 flex items-center gap-1.5">
                <Lightbulb size={15} className="text-cyan-500" />
                <span>ATS Optimization Tips & Recommendations</span>
              </h5>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {result.suggestions.concat(result.atsTips).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResult(null)}
                leftIcon={<RefreshCw size={14} />}
              >
                Re-Analyze
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAnalysis}
                  leftIcon={<Copy size={14} />}
                >
                  Copy Report
                </Button>

                <Button variant="primary" size="sm" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
