import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Award,
  XCircle,
  Bell,
  CheckCircle2,
  Trash2,
  Check,
} from "lucide-react";
import NotificationBadge from "./NotificationBadge";
import type { AppNotification } from "../../types/notification";

export interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  className = "",
}: NotificationCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "New Job Added":
        return <Briefcase size={16} className="text-blue-500" />;
      case "Interview Scheduled":
        return <Calendar size={16} className="text-amber-500" />;
      case "Application Updated":
        return <CheckCircle2 size={16} className="text-sky-500" />;
      case "Offer Received":
        return <Award size={16} className="text-emerald-500" />;
      case "Application Rejected":
        return <XCircle size={16} className="text-rose-500" />;
      case "Reminder Due":
        return <Bell size={16} className="text-orange-500" />;
      default:
        return <Bell size={16} className="text-cyan-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`group p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
        !notification.isRead
          ? "border-sky-200 dark:border-sky-800/60 bg-sky-50/40 dark:bg-sky-950/20 shadow-xs"
          : "border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      } ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex items-center justify-center shrink-0 mt-1">
          {!notification.isRead ? (
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-xs ring-2 ring-blue-500/30" />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
          )}
        </div>

        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xs shrink-0">
          {getIcon(notification.type)}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4
              className={`text-xs font-bold ${
                !notification.isRead
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {notification.title}
            </h4>
            <NotificationBadge type={notification.type} />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {notification.description}
          </p>

          <span className="block text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1.5">
            {notification.timestamp}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        {!notification.isRead && onMarkRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
            title="Mark as read"
          >
            <Check size={14} />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            title="Delete notification"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
