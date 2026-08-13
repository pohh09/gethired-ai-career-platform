import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from "lucide-react";
import type {
  InterviewQuestion,
  QuestionDifficulty,
} from "../../types/interview";

export interface QuestionCardProps {
  question: InterviewQuestion;
  initiallyExpanded?: boolean;
  className?: string;
}

export default function QuestionCard({
  question,
  initiallyExpanded = false,
  className = "",
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(initiallyExpanded);

  const getDifficultyBadge = (diff: QuestionDifficulty) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40";
      case "Medium":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
      case "Hard":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40";
    }
  };

  const getTypeBadge = (_type?: string) => {
    return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40";
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm transition-all overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getTypeBadge(
                question.type,
              )}`}
            >
              {question.type} Round
            </span>

            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getDifficultyBadge(
                question.difficulty,
              )}`}
            >
              {question.difficulty}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
            {question.question}
          </h4>
        </div>

        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 shrink-0">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-5 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 mt-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <HelpCircle size={13} />
              <span>Suggested Answer Strategy</span>
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "{question.suggestedAnswer}"
            </p>
          </div>

          {question.keyPoints.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Key Talking Points
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {question.keyPoints.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 leading-relaxed"
                  >
                    <CheckCircle2
                      size={13}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
