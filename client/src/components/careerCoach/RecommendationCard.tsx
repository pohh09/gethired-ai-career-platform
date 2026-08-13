import { Lightbulb, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { CoachRecommendation } from "../../types/careerCoach";

export interface RecommendationCardProps {
  recommendations: CoachRecommendation[];
  onActionClick?: (rec: CoachRecommendation) => void;
  className?: string;
}

export default function RecommendationCard({
  recommendations = [],
  onActionClick,
  className = "",
}: RecommendationCardProps) {
  const navigate = useNavigate();

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40";
      case "Medium":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
      default:
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40";
    }
  };

  const handleDefaultClick = (rec: CoachRecommendation) => {
    if (onActionClick) {
      onActionClick(rec);
      return;
    }

    if (rec.actionText.toLowerCase().includes("resume")) {
      navigate("/resume-optimizer");
      toast.success("Redirecting to AI Resume Optimizer...");
    } else if (
      rec.actionText.toLowerCase().includes("filter") ||
      rec.actionText.toLowerCase().includes("browse") ||
      rec.actionText.toLowerCase().includes("remote")
    ) {
      navigate("/jobs");
      toast.success("Navigating to Jobs Management...");
    } else {
      toast.success(`Action acknowledged: ${rec.actionText}`);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
        <Lightbulb size={14} className="text-amber-500" />
        <span>
          Executive AI Career Recommendations ({recommendations.length})
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {rec.category}
                </span>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityStyle(
                    rec.priority,
                  )}`}
                >
                  {rec.priority} Priority
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                {rec.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rec.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDefaultClick(rec)}
                rightIcon={<ArrowRight size={13} />}
                className="text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 font-bold"
              >
                {rec.actionText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
