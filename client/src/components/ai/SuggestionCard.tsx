import { Zap, Wrench, FileCheck } from "lucide-react";

export interface SuggestionCardProps {
  actionVerbs?: string[];
  grammarImprovements?: string[];
  projectImprovements?: string[];
  className?: string;
}

export default function SuggestionCard({
  actionVerbs = [],
  grammarImprovements = [],
  projectImprovements = [],
  className = "",
}: SuggestionCardProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>

      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
          <Zap size={16} />
          <span>High-Impact Action Verbs</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Start work experience bullet points with these executive verbs:
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {actionVerbs.map((verb) => (
            <span
              key={verb}
              className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60"
            >
              {verb}
            </span>
          ))}
        </div>
      </div>


      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
          <FileCheck size={16} />
          <span>Phrasing & Tone</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {grammarImprovements.map((imp, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-blue-500 font-bold">•</span>
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      </div>


      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
          <Wrench size={16} />
          <span>Project Descriptions</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {projectImprovements.map((proj, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-emerald-500 font-bold">•</span>
              <span>{proj}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
