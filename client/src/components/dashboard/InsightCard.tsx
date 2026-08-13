import { Sparkles, TrendingUp, Compass, Clock, ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";

export interface AIInsightItem {
  id: string;
  type: "trend" | "strategy" | "target" | "action";
  title: string;
  description: string;
  metricBadge?: string;
  icon: React.ReactNode;
}

export interface InsightCardProps {
  insights?: AIInsightItem[];
  onActionClick?: (type: string) => void;
  className?: string;
}

export default function InsightCard({
  insights = [],
  onActionClick,
  className = "",
}: InsightCardProps) {
  const mockInsights: AIInsightItem[] =
    insights.length > 0
      ? insights
      : [
          {
            id: "ins-1",
            type: "trend",
            title: "Interview Rate Increased by +18%",
            description:
              "Your interview callback conversion rate jumped from 12% to 30% over the last 30 days.",
            metricBadge: "+18% Conversion",
            icon: <TrendingUp size={16} className="text-emerald-500" />,
          },
          {
            id: "ins-2",
            type: "strategy",
            title: "2.4x Higher Callbacks from Remote Roles",
            description:
              "Remote product engineering applications are converting 2.4x faster than hybrid postings.",
            metricBadge: "Remote Advantage",
            icon: <Compass size={16} className="text-blue-500" />,
          },
          {
            id: "ins-3",
            type: "target",
            title: "Apply to 3 More Target Companies",
            description:
              "Reaching 15 applications this week increases your probability of receiving an offer by 65%.",
            metricBadge: "Weekly Goal",
            icon: <Sparkles size={16} className="text-purple-500" />,
          },
          {
            id: "ins-4",
            type: "action",
            title: "Follow Up with Microsoft Team",
            description:
              "8 days have elapsed since your technical screening. A polite follow-up increases recruiter response rate.",
            metricBadge: "Follow Up Alert",
            icon: <Clock size={16} className="text-amber-500" />,
          },
        ];

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="AI Career Insights"
        subtitle="Data-driven recommendations to optimize your job search performance"
        action={
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200/50">
            ✨ AI Recommendation Engine
          </span>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockInsights.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {item.icon}
                </div>

                {item.metricBadge && (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/50 shrink-0 uppercase tracking-wider">
                    {item.metricBadge}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => onActionClick?.(item.type)}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <span>Take Action</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
