import { motion } from "framer-motion";
import { Lightbulb, ArrowUpRight, Zap } from "lucide-react";
import type { AIRecommendation } from "../../types/ai";

export interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onAction?: (rec: AIRecommendation) => void;
  className?: string;
}

export default function RecommendationCard({
  recommendation,
  onAction,
  className = "",
}: RecommendationCardProps) {
  const getPriorityStyle = (p: string) => {
    switch (p.toLowerCase()) {
      case "high":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40";
      case "medium":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
      default:
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityStyle(
            recommendation.priority,
          )}`}
        >
          {recommendation.priority} Priority
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
          <Zap size={11} />
          {recommendation.impactEstimate}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Lightbulb size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {recommendation.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {recommendation.description}
          </p>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onAction && onAction(recommendation)}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <span>{recommendation.actionText}</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
