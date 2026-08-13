import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight } from "lucide-react";
import ActivityTimeline from "./ActivityTimeline";
import type { ActivityItem } from "../../types/activity";

export interface RecentActivityWidgetProps {
  activities?: ActivityItem[];
  limit?: number;
  className?: string;
}

export default function RecentActivityWidget({
  activities = [],
  limit = 5,
  className = "",
}: RecentActivityWidgetProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-2xs">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Recent Workspace Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live audit trail of application updates and interview events
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/activity")}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <ActivityTimeline activities={activities.slice(0, limit)} />
    </div>
  );
}
