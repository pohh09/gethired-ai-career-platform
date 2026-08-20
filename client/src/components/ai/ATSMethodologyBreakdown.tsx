import { useState } from "react";
import { Info, ChevronDown, CheckCircle2, AlertTriangle, Sparkles, Cpu } from "lucide-react";

interface ATSMethodologyBreakdownProps {
  source?: "ai" | "fallback";
  className?: string;
}

export default function ATSMethodologyBreakdown({
  source = "ai",
  className = "",
}: ATSMethodologyBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all ${
      source === "fallback"
        ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20"
        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
    } ${className}`}>
      {/* Fallback Reliability Alert */}
      {source === "fallback" && (
        <div className="p-3 bg-amber-500/10 border-b border-amber-200 dark:border-amber-900/40 rounded-t-2xl flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
          <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Basic Analysis Mode: </span>
            <span>AI model is temporarily busy/unavailable — displaying keyword & deterministic heuristic ATS calculations.</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/60 font-bold">
            Fallback Parser
          </span>
        </div>
      )}

      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Info size={15} className="text-indigo-500 shrink-0" />
          <span>How is this ATS Score calculated? (Scoring Methodology)</span>
          {source === "ai" ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Sparkles size={10} />
              <span>Full AI Evaluator</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <Cpu size={10} />
              <span>Keyword & Heuristic Mode</span>
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 text-slate-400 ${
            isExpanded ? "rotate-180 text-indigo-500" : ""
          }`}
        />
      </button>

      {/* Expanded Factors Breakdown */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-3.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-800">
          <p className="text-[11px] leading-relaxed">
            GetHired pairs Gemini AI semantic analysis with deterministic ATS parser checks. We do not use arbitrary random numbers — your score reflects 4 weighted criteria:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-blue-500" />
                  <span>1. Keyword Matching</span>
                </span>
                <span className="text-[11px] text-blue-600 dark:text-cyan-400 font-mono font-extrabold">~35%</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Exact & conceptual matching of target role tech stack skills (e.g. React, Node.js, Cloud, CI/CD).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>2. Quantified Impact (STAR)</span>
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-extrabold">~25%</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Presence of measurable metrics (% latency reduction, $ revenue, user scale, team throughput).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-500" />
                  <span>3. Section Completeness</span>
                </span>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono font-extrabold">~20%</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Coverage of essential ATS sections: Summary, Work History, Education, Skills, and Contact Info.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-500" />
                  <span>4. Format & Readability</span>
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-extrabold">~20%</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Single-column ATS compatibility, standard headings, active verbs, and clean typo-free syntax.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
