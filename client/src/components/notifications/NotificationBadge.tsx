import type { NotificationType } from "../../types/notification";

export interface NotificationBadgeProps {
  type: NotificationType;
  className?: string;
}

export default function NotificationBadge({
  type,
  className = "",
}: NotificationBadgeProps) {
  const getStyle = (t: NotificationType) => {
    switch (t) {
      case "New Job Added":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40";
      case "Interview Scheduled":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
      case "Application Updated":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40";
      case "Offer Received":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40";
      case "Application Rejected":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40";
      case "Reminder Due":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200/60 dark:border-orange-800/40";
      case "System Notification":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <span
      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${getStyle(
        type,
      )} ${className}`}
    >
      {type}
    </span>
  );
}
