import { motion } from "framer-motion";
import {
  PlusCircle,
  RefreshCw,
  DollarSign,
  Trash2,
  Calendar,
  FileText,
  Activity,
  ArrowRight,
} from "lucide-react";
import StatusBadge from "../jobs/StatusBadge";
import type { ActivityItem } from "../../types/activity";

export interface TimelineItemProps {
  item: ActivityItem;
  className?: string;
}

export default function TimelineItem({ item, className = "" }: TimelineItemProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "Job Added":
        return <PlusCircle size={14} className="text-blue-500" />;
      case "Status Changed":
        return <RefreshCw size={14} className="text-amber-500" />;
      case "Salary Updated":
        return <DollarSign size={14} className="text-emerald-500" />;
      case "Job Deleted":
        return <Trash2 size={14} className="text-rose-500" />;
      case "Interview Scheduled":
        return <Calendar size={14} className="text-purple-500" />;
      case "Notes Added":
        return <FileText size={14} className="text-indigo-500" />;
      default:
        return <Activity size={14} className="text-slate-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative pl-8 pb-6 group last:pb-0 ${className}`}
    >

      <div className="absolute left-0 top-0.5 h-6 w-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:border-indigo-400 transition-all z-10">
        {getActionIcon(item.action)}
      </div>


      <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-200 dark:hover:border-slate-700 transition-all space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
              {item.user.avatarInitials}
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {item.user.name}{" "}
              <span className="font-normal text-slate-500 dark:text-slate-400">
                {item.details}
              </span>
            </h4>
          </div>

          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 font-mono">
            {item.timestamp}
          </span>
        </div>


        {item.previousValue && item.newValue && (
          <div className="flex items-center gap-2 text-xs pt-1">
            <StatusBadge status={item.previousValue} size="sm" />
            <ArrowRight size={12} className="text-slate-400" />
            <StatusBadge status={item.newValue} size="sm" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
