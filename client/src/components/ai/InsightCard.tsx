import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, TrendingUp, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import type { AIInsight } from "../../types/ai";

export interface InsightCardProps {
  insight: AIInsight;
  className?: string;
  onApplyRecommendation?: (insight: AIInsight) => void;
}

export default function InsightCard({
  insight,
  className = "",
  onApplyRecommendation,
}: InsightCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Conversion":
        return <TrendingUp size={16} className="text-emerald-500" />;
      case "Location":
        return <MapPin size={16} className="text-blue-500" />;
      case "Timing":
        return <Calendar size={16} className="text-purple-500" />;
      case "Strategy":
        return <Zap size={16} className="text-amber-500" />;
      default:
        return <Sparkles size={16} className="text-indigo-500" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 shrink-0">
            {getCategoryIcon(insight.category)}
          </div>
          <span>{insight.category} Insight</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
          <CheckCircle2 size={11} />
          <span>{insight.confidenceScore}% AI Confidence</span>
        </div>
      </div>


      <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {insight.title}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
        {insight.description}
      </p>

      {insight.recommendation && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 line-clamp-1">
            💡 {insight.recommendation}
          </span>
          {onApplyRecommendation && (
            <button
              type="button"
              onClick={() => onApplyRecommendation(insight)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Apply</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
