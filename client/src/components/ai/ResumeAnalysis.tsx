import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Copy,
  Download,
  RefreshCw,
  Upload,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import KeywordCard from "./KeywordCard";
import SuggestionCard from "./SuggestionCard";
import type { ResumeOptimizationResult } from "../../types/ai";

export interface ResumeAnalysisProps {
  result: ResumeOptimizationResult;
  onRegenerate: () => void;
  onUploadNew: () => void;
  className?: string;
}

export default function ResumeAnalysis({
  result,
  onRegenerate,
  onUploadNew,
  className = "",
}: ResumeAnalysisProps) {
  const handleCopySuggestions = () => {
    const reportText = `
GetHired AI Resume Optimization Report
Overall Score: ${result.overallScore}/100
ATS Compatibility Score: ${result.atsScore}/100

IMPROVED SUMMARY REWRITE:
${result.improvedSummary}

RECOMMENDED ACTION VERBS:
${result.actionVerbs.join(", ")}

MISSING KEYWORDS:
${result.missingSkills.concat(result.suggestedKeywords).join(", ")}

AI RECOMMENDATIONS:
${result.aiRecommendations.map((r) => `- ${r}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(reportText);
    toast.success("Optimization report copied to clipboard!");
  };

  const handleDownloadReport = () => {
    const reportText = `
GETHIRED AI RESUME OPTIMIZATION REPORT
Date: ${new Date().toLocaleDateString()}

==================================================
1. EVALUATION SCORES
==================================================
Overall Resume Quality Score: ${result.overallScore}/100
ATS Scanner Compatibility: ${result.atsScore}/100

==================================================
2. STRENGTHS
==================================================
${result.strengths.map((s) => `• ${s}`).join("\n")}

==================================================
3. AREAS TO IMPROVE
==================================================
${result.weaknesses.map((w) => `• ${w}`).join("\n")}

==================================================
4. MISSING ATS KEYWORDS
==================================================
${result.missingSkills.concat(result.suggestedKeywords).join(", ")}

==================================================
5. IMPROVED RESUME SUMMARY
==================================================
"${result.improvedSummary}"

==================================================
6. IMPROVED PROJECT DESCRIPTIONS
==================================================
${result.improvedProjects.map((p) => `• ${p}`).join("\n")}

==================================================
7. EXECUTIVE ACTION VERBS
==================================================
${result.actionVerbs.join(", ")}

==================================================
8. AI RECOMMENDATIONS
==================================================
${result.aiRecommendations.map((r) => `• ${r}`).join("\n")}
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GetHired_AI_Resume_Optimization_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-500 text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "stroke-amber-500 text-amber-600 dark:text-amber-400";
    return "stroke-rose-500 text-rose-600 dark:text-rose-400";
  };

  return (
    <div className={`space-y-6 ${className}`}>

      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Optimization Analysis Ready
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review ATS compliance, missing keywords, and rewritten sections below.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadNew}
            leftIcon={<Upload size={14} />}
          >
            Upload New Resume
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            leftIcon={<RefreshCw size={14} />}
          >
            Regenerate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySuggestions}
            leftIcon={<Copy size={14} />}
          >
            Copy Suggestions
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadReport}
            leftIcon={<Download size={14} />}
          >
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Resume Score
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {result.overallScore >= 80
                ? "Production Ready 🎉"
                : result.overallScore >= 60
                  ? "Solid Foundation 📈"
                  : "Needs Optimization ⚠️"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculated across clarity, impact metrics, and role relevance.
            </p>
          </div>

          <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ${getScoreColor(result.overallScore)}`}
                strokeDasharray={`${result.overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xl font-extrabold">{result.overallScore}%</span>
          </div>
        </div>


        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ATS Compatibility Score
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {result.atsScore >= 85
                ? "Passes ATS Filters ✅"
                : result.atsScore >= 70
                  ? "Moderate ATS Score ⚠️"
                  : "High ATS Filter Risk ❌"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scanned for section headings, keyword parsing, and plain formatting.
            </p>
          </div>

          <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ${getScoreColor(result.atsScore)}`}
                strokeDasharray={`${result.atsScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xl font-extrabold">{result.atsScore}%</span>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
            <TrendingUp size={16} />
            <span>Key Resume Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
            <AlertTriangle size={16} />
            <span>Areas to Improve</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {result.weaknesses.map((wk, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 font-bold">•</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <KeywordCard
        missingKeywords={result.missingSkills}
        suggestedKeywords={result.suggestedKeywords}
        technicalSkills={result.technicalSkills}
        softSkills={result.softSkills}
      />

      {result.improvedSummary && (
        <div className="p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm">
              <Sparkles size={16} />
              <span>AI-Improved Professional Summary</span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(result.improvedSummary);
                toast.success("Summary copied!");
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Copy size={12} />
              <span>Copy Summary</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
            "{result.improvedSummary}"
          </div>
        </div>
      )}

      <SuggestionCard
        actionVerbs={result.actionVerbs}
        grammarImprovements={result.grammarImprovements}
        projectImprovements={result.projectImprovements}
      />


      <div className="p-5 rounded-2xl border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
        <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-extrabold text-sm">
          <Lightbulb size={16} className="text-purple-500" />
          <span>Executive AI Recommendations</span>
        </div>
        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {result.aiRecommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-purple-500 font-bold"><Check size={14} /></span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
