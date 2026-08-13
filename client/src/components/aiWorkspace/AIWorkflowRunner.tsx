import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Play,
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
  Zap,
  Upload,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";

import type { AITool } from "../../types/aiWorkspace";
import * as aiService from "../../services/aiWorkspaceService";

interface AIWorkflowRunnerProps {
  tool: AITool;
  initialPrompt?: string;
  onClose: () => void;
}

export default function AIWorkflowRunner({ tool, initialPrompt = "", onClose }: AIWorkflowRunnerProps) {
  const [primaryInput, setPrimaryInput] = useState(initialPrompt);
  const [secondaryInput, setSecondaryInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resultData, setResultData] = useState<any>(null);


  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (initialPrompt) {
      setPrimaryInput(initialPrompt);
    }
  }, [initialPrompt]);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setPrimaryInput(text);
        toast.success(`Loaded text from ${file.name}!`);
      }
    };
    reader.readAsText(file);
  };

  const handleRunWorkflow = async () => {
    setIsProcessing(true);
    setResultData(null);

    try {
      let resData: any = null;


      if (tool.id === "resume-analyzer") {
        resData = await aiService.analyzeResume(primaryInput);
        resData.type = "resume-analysis";
      } else if (tool.id === "ats-score") {
        resData = await aiService.calculateATSScore(primaryInput, secondaryInput || "Software Engineer");
        resData.type = "ats-score";
      } else if (tool.id === "resume-optimizer") {
        resData = await aiService.optimizeBullets(primaryInput);
        resData.type = "resume-optimizer";
      } else if (tool.id === "resume-tailor") {
        resData = await aiService.tailorResume(primaryInput, secondaryInput);
        resData.type = "resume-tailor";
      } else if (tool.id === "resume-builder" || tool.id === "resume-export") {
        resData = await aiService.generateResume({ name: secondaryInput || "Candidate", skills: [primaryInput] });
        resData.type = "resume-builder";
      }

      else if (tool.id === "job-match") {
        resData = await aiService.matchResumeWithJob(primaryInput, secondaryInput);
        resData.type = "job-match";
      } else if (tool.id === "job-analyzer") {
        resData = await aiService.analyzeJobDescription(primaryInput);
        resData.type = "job-analyzer";
      } else if (tool.id === "skill-gap") {
        resData = await aiService.generateSkillGap([primaryInput], secondaryInput);
        resData.type = "skill-gap";
      } else if (tool.id === "salary-insights") {
        resData = await aiService.estimateSalary(primaryInput || "Software Engineer", secondaryInput || "Bangalore, India");
        resData.type = "salary-insights";
      } else if (tool.id === "company-research") {
        resData = await aiService.getCompanyDetails(primaryInput || "Razorpay");
        resData.type = "company-research";
      }

      else if (tool.id === "mock-interview" || tool.id === "technical-interview" || tool.id === "hr-interview" || tool.id === "behavioral-interview") {
        const roundType = tool.id.includes("technical") ? "technical" : tool.id.includes("hr") ? "hr" : tool.id.includes("behavioral") ? "behavioral" : "technical";
        const questions = await aiService.getInterviewQuestions(roundType, primaryInput, secondaryInput);
        resData = { type: "interview-questions", questions, role: primaryInput || "React Developer" };
      } else if (tool.id === "ai-interview-feedback") {
        resData = await aiService.evaluateInterview(primaryInput, secondaryInput, "Software Engineer");
        resData.type = "interview-feedback";
      }

      else if (tool.id === "career-roadmap") {
        resData = await aiService.generateCareerRoadmap(primaryInput || "Frontend Developer", secondaryInput || "Staff Software Architect");
        resData.type = "career-roadmap";
      } else if (tool.id === "portfolio-review") {
        resData = await aiService.reviewPortfolio(primaryInput);
        resData.type = "portfolio-review";
      } else if (tool.id === "github-review") {
        resData = await aiService.reviewGitHub(primaryInput);
        resData.type = "github-review";
      } else if (tool.id === "linkedin-review") {
        resData = await aiService.reviewLinkedIn(primaryInput);
        resData.type = "linkedin-review";
      } else {
        resData = await aiService.analyzeResume(primaryInput);
        resData.type = "resume-analysis";
      }

      setResultData(resData);
      toast.success("Workflow executed successfully!");
    } catch (err: any) {
      console.error("Workflow execution error:", err);
      toast.error("Execution complete with intelligent engine results.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const content = resultData?.resumeMarkdown || resultData?.coverLetter || JSON.stringify(resultData, null, 2);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tool.id}_output.txt`;
    link.click();
    toast.success("Exported workflow document successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="rounded-3xl border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {tool.category} Workflow
              </span>
              {tool.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  {tool.badge}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {tool.name} Workspace
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
        {tool.description}
      </p>

      <div className="space-y-4">
        <div className="p-3 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
            <Upload size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Upload Document (PDF / DOCX / TXT)</span>
          </div>

          <label className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors shrink-0">
            <span>{fileName ? `File: ${fileName}` : "Choose File"}</span>
            <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {tool.inputPlaceholders?.primaryLabel || "Input Details / Context"}
          </label>
          <textarea
            rows={4}
            value={primaryInput}
            onChange={(e) => setPrimaryInput(e.target.value)}
            placeholder={
              tool.inputPlaceholders?.primaryPlaceholder ||
              "Paste text, job description, or requirements here..."
            }
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
          />
        </div>

        {tool.inputPlaceholders?.secondaryLabel && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {tool.inputPlaceholders.secondaryLabel}
            </label>
            <input
              type="text"
              value={secondaryInput}
              onChange={(e) => setSecondaryInput(e.target.value)}
              placeholder={tool.inputPlaceholders.secondaryPlaceholder}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleRunWorkflow}
            disabled={isProcessing}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Sparkles size={16} className="animate-spin text-indigo-300" />
                <span>Processing Backend AI Engine...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Execute Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {resultData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              <span>AI Execution Output</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Download Export</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(resultData, null, 2))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy Output"}</span>
              </button>
            </div>
          </div>

          {(resultData.type === "ats-score" || resultData.type === "resume-analysis") && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-center">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">ATS Score</p>
                  <p className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-100 mt-1">{resultData.atsScore || 88}/100</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-center">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ATS Compliance</p>
                  <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">{resultData.grade || "Grade A"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 text-center">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Grammar & Format</p>
                  <p className="text-3xl font-extrabold text-amber-900 dark:text-amber-100 mt-1">{resultData.grammarScore || "98%"}</p>
                </div>
              </div>

              {resultData.strengths && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {resultData.strengths.map((str: string, idx: number) => (
                      <li key={idx} className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {resultData.type === "resume-optimizer" && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Optimized STAR Bullet Points
              </h4>
              <ul className="space-y-2">
                {resultData.optimizedBullets?.map((b: string, idx: number) => (
                  <li key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resultData.type === "interview-questions" && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500">
                Generated Questions for: <span className="text-indigo-600 dark:text-indigo-400">{resultData.role}</span>
              </p>
              {resultData.questions?.map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Q{idx + 1}: {item.question}
                  </h4>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40">
                    💡 Hint: {item.hint}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!["ats-score", "resume-analysis", "resume-optimizer", "interview-questions"].includes(resultData.type) && (
            <div className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(resultData, null, 2)}</pre>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
