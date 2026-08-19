import { motion } from "framer-motion";
import {
  Sparkles,
  FileCheck2,
  Briefcase,
  HelpCircle,
  FileText,
  Compass,
  Star,
  ArrowRight,
} from "lucide-react";
import type { AITool } from "../../types/aiWorkspace";

interface AIToolCardProps {
  tool: AITool;
  onLaunch: (tool: AITool) => void;
  onToggleFavorite: (toolId: string) => void;
}

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  ResumeMatch: FileCheck2,
  ResumeOptimizer: Sparkles,
  JobAnalyzer: Briefcase,
  InterviewPrep: HelpCircle,
  CoverLetter: FileText,
  CareerCoach: Compass,
};

const gradientMap: Record<string, string> = {
  ResumeMatch: "from-blue-600 to-indigo-600",
  ResumeOptimizer: "from-indigo-600 to-purple-600",
  JobAnalyzer: "from-purple-600 to-pink-600",
  InterviewPrep: "from-amber-500 to-orange-600",
  CoverLetter: "from-teal-600 to-emerald-600",
  CareerCoach: "from-rose-600 to-pink-600",
};

export default function AIToolCard({
  tool,
  onLaunch,
  onToggleFavorite,
}: AIToolCardProps) {
  const IconComponent = iconMap[tool.iconName] || Sparkles;
  const gradient =
    gradientMap[tool.iconName] || "from-indigo-600 to-purple-600";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-200`}
            >
              <IconComponent size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.name}
                </h3>
                {tool.badge && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                    {tool.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {tool.category}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(tool.id);
            }}
            aria-label={
              tool.isFavorite ? "Unpin tool" : "Pin tool to favorites"
            }
            className={`p-2 rounded-xl border transition-all duration-200 ${tool.isFavorite
                ? "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-500"
                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              }`}
          >
            <Star
              size={16}
              className={tool.isFavorite ? "fill-amber-400 text-amber-500" : ""}
            />
          </button>
        </div>

        <p className="mt-3.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[36px]">
          {tool.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Sparkles size={12} className="text-indigo-500" /> AI Powered
        </span>

        <button
          type="button"
          onClick={() => onLaunch(tool)}
          className={`px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${gradient} hover:opacity-95 shadow-xs flex items-center gap-1.5 transition-all duration-200 hover:gap-2`}
        >
          <span>Launch</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
