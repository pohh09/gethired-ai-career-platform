import Textarea from "../ui/Textarea";
import { Tag, Lightbulb, CheckCircle2, Sparkles } from "lucide-react";

export interface GeneratedLetterProps {
  letterText: string;
  onChangeText: (text: string) => void;
  highlightedSkills?: string[];
  keywordsUsed?: string[];
  atsTips?: string[];
  className?: string;
}

export default function GeneratedLetter({
  letterText,
  onChangeText,
  highlightedSkills = [],
  keywordsUsed = [],
  atsTips = [],
  className = "",
}: GeneratedLetterProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-500" />
            <span>Cover Letter (Live Editable)</span>
          </label>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>{letterText.split(/\s+/).filter(Boolean).length} words</span>
            <span>•</span>
            <span>{letterText.length} chars</span>
          </div>
        </div>

        <Textarea
          rows={13}
          value={letterText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Your AI-generated cover letter text will appear here..."
          className="font-sans leading-relaxed text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <CheckCircle2 size={14} />
            <span>Highlighted Core Skills ({highlightedSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {highlightedSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/50"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            <Tag size={14} />
            <span>ATS Keywords Included ({keywordsUsed.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {keywordsUsed.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {atsTips.length > 0 && (
        <div className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
            <Lightbulb size={14} className="text-amber-500" />
            <span>ATS Optimization Advice</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {atsTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
