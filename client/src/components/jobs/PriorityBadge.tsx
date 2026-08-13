export type PriorityType = "High" | "Medium" | "Low" | string;

export interface PriorityBadgeProps {
  priority: PriorityType;
  className?: string;
  size?: "sm" | "md";
}

export default function PriorityBadge({
  priority,
  className = "",
  size = "md",
}: PriorityBadgeProps) {
  const getStyles = (p: string) => {
    const pr = p.toLowerCase();
    switch (pr) {
      case "high":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/60",
          dot: "bg-rose-500",
        };
      case "medium":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/60",
          dot: "bg-amber-500",
        };
      case "low":
        return {
          bg: "bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
          dot: "bg-slate-400",
        };
      default:
        return {
          bg: "bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
          dot: "bg-slate-400",
        };
    }
  };

  const style = getStyles(priority);
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-lg border shrink-0 transition-all ${sizeClasses} ${style.bg} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />
      <span className="capitalize">{priority}</span>
    </span>
  );
}
