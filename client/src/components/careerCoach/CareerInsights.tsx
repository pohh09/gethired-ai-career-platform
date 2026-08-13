import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import type { CareerInsightsData } from "../../types/careerCoach";

export interface CareerInsightsProps {
  insights: CareerInsightsData;
  className?: string;
}

export default function CareerInsights({
  insights,
  className = "",
}: CareerInsightsProps) {
  const items = [
    {
      label: "Top Target Role",
      value: insights.bestRole,
      icon: Compass,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60",
    },
    {
      label: "Best Conversion Location",
      value: insights.bestLocation,
      icon: MapPin,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60",
    },
    {
      label: "Optimal Application Day",
      value: insights.bestDay,
      icon: Calendar,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60",
    },
    {
      label: "Avg Response Velocity",
      value: `${insights.avgResponseDays} Days`,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60",
    },
    {
      label: "Interview Conversion Rate",
      value: `${insights.interviewConversionPct}%`,
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      label: "Offer Finalization Rate",
      value: `${insights.offerConversionPct}%`,
      icon: Award,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60",
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
        <TrendingUp size={14} className="text-emerald-500" />
        <span>Application Conversion & Velocity Insights</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((it) => {
          const IconComponent = it.icon;
          return (
            <div
              key={it.label}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {it.label}
                </span>
                <div className={`p-1.5 rounded-lg ${it.color}`}>
                  <IconComponent size={14} />
                </div>
              </div>

              <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                {it.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
