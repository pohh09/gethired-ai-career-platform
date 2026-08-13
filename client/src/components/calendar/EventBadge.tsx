export type CalendarEventType =
  | "Interview"
  | "Assessment"
  | "HR Call"
  | "Technical Round"
  | "Manager Round"
  | "Offer Discussion"
  | "Follow-up"
  | "Reminder"
  | string;

export interface EventBadgeProps {
  type: CalendarEventType;
  title?: string;
  className?: string;
  size?: "sm" | "md";
  dot?: boolean;
}

export default function EventBadge({
  type,
  title,
  className = "",
  size = "md",
  dot = true,
}: EventBadgeProps) {
  const getStyles = (t: string) => {
    const tp = t.toLowerCase();
    switch (tp) {
      case "interview":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50",
          dot: "bg-amber-500",
        };
      case "assessment":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/50",
          dot: "bg-purple-500",
        };
      case "hr call":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/50",
          dot: "bg-blue-500",
        };
      case "technical round":
        return {
          bg: "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/50",
          dot: "bg-indigo-500",
        };
      case "manager round":
        return {
          bg: "bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/50",
          dot: "bg-cyan-500",
        };
      case "offer discussion":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50",
          dot: "bg-emerald-500",
        };
      case "follow-up":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50",
          dot: "bg-rose-500",
        };
      case "reminder":
        return {
          bg: "bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border-orange-200/60 dark:border-orange-800/50",
          dot: "bg-orange-500",
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
          dot: "bg-slate-500",
        };
    }
  };

  const style = getStyles(type);
  const sizeClasses =
    size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md border shrink-0 transition-all truncate ${sizeClasses} ${style.bg} ${className}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />
      )}
      <span className="truncate">{title || type}</span>
    </span>
  );
}
