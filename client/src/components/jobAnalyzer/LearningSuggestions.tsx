import { BookOpen, ExternalLink, HelpCircle } from "lucide-react";
import type { LearningResourceItem } from "../../types/jobAnalyzer";

export interface LearningSuggestionsProps {
  interviewTopics?: string[];
  learningResources?: LearningResourceItem[];
  className?: string;
}

export default function LearningSuggestions({
  interviewTopics = [],
  learningResources = [],
  className = "",
}: LearningSuggestionsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <HelpCircle size={16} />
          <span>Potential Interview Topics ({interviewTopics.length})</span>
        </div>

        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
          {interviewTopics.map((topic, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 font-medium"
            >
              <span className="h-5 w-5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] flex items-center justify-center font-mono font-bold shrink-0">
                ?
              </span>
              <span className="truncate">{topic}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          <BookOpen size={16} />
          <span>
            Recommended Learning Resources ({learningResources.length})
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {learningResources.map((res, idx) => (
            <a
              key={idx}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-purple-300 transition-colors group"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 block">
                  {res.type}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block group-hover:underline">
                  {res.title}
                </span>
              </div>
              <ExternalLink
                size={14}
                className="text-slate-400 group-hover:text-purple-500 shrink-0"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
