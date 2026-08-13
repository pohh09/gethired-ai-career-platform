import { type ReactNode } from "react";
import { Sparkles, TrendingUp, MapPin, Calendar, Award } from "lucide-react";

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  type: "positive" | "info" | "highlight";
  icon?: ReactNode;
}

export interface InsightCardProps {
  insights?: InsightItem[];
  className?: string;
}

export default function InsightCard({
  insights = [],
  className = "",
}: InsightCardProps) {
  const defaultInsights: InsightItem[] = [
    {
      id: "1",
      title: "Interview Conversion Growth",
      description:
        "Your interview rate increased by 18% compared to last month's submissions.",
      type: "positive",
      icon: <TrendingUp size={16} className="text-emerald-500" />,
    },
    {
      id: "2",
      title: "Remote Preference Response",
      description:
        "Remote roles yield a 32% higher response rate than onsite postings.",
      type: "info",
      icon: <MapPin size={16} className="text-blue-500" />,
    },
    {
      id: "3",
      title: "Submission Velocity Peak",
      description:
        "Most applications submitted on Tuesdays receive responses within 4 days.",
      type: "highlight",
      icon: <Calendar size={16} className="text-purple-500" />,
    },
    {
      id: "4",
      title: "High Priority Correlation",
      description:
        "High priority jobs demonstrate a 2.4x higher offer conversion rate.",
      type: "positive",
      icon: <Award size={16} className="text-amber-500" />,
    },
  ];

  const items = insights.length > 0 ? insights : defaultInsights;

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Intelligent Insights
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated performance takeaways derived from your job search data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex items-start gap-3 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-colors"
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-2xs shrink-0 mt-0.5">
              {item.icon || <Sparkles size={16} className="text-indigo-500" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
