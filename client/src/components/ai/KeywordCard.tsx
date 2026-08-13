import { Tag, CheckCircle2, Plus, Sparkles } from "lucide-react";

export interface KeywordCardProps {
  missingKeywords?: string[];
  suggestedKeywords?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  className?: string;
}

export default function KeywordCard({
  missingKeywords = [],
  suggestedKeywords = [],
  technicalSkills = [],
  softSkills = [],
  className = "",
}: KeywordCardProps) {
  const combinedMissing = [...new Set([...missingKeywords, ...suggestedKeywords])];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/30 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-sm">
          <Tag size={16} />
          <span>Missing Keywords & Industry Terms ({combinedMissing.length})</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Critical keywords absent from your resume text that ATS filters search for:
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {combinedMissing.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300/50"
            >
              <Plus size={12} />
              <span>{kw}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
            <CheckCircle2 size={16} />
            <span>Recommended Technical Skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {technicalSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/50"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>


        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-sm">
            <Sparkles size={16} />
            <span>Soft Skills & Leadership</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {softSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
