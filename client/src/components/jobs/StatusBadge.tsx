export type StatusType =
  | "Applied"
  | "Screening"
  | "Assessment"
  | "Interview"
  | "HR Round"
  | "Offer"
  | "Rejected"
  | "Ghosted"
  | "Wishlist"
  | string;

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

export default function StatusBadge({
  status,
  className = "",
  dot = true,
  size = "md",
}: StatusBadgeProps) {
  const getStyles = (st: string) => {
    const s = st.toLowerCase();
    switch (s) {
      case "applied":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/50",
          dot: "bg-blue-500",
        };
      case "screening":
        return {
          bg: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/50",
          dot: "bg-sky-500",
        };
      case "assessment":
        return {
          bg: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/50",
          dot: "bg-cyan-500",
        };
      case "interview":
      case "hr round":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50",
          dot: "bg-amber-500",
        };
      case "offer":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50",
          dot: "bg-emerald-500",
        };
      case "rejected":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50",
          dot: "bg-rose-500",
        };
      case "ghosted":
        return {
          bg: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
          dot: "bg-slate-400",
        };
      case "wishlist":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/50",
          dot: "bg-blue-500",
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
          dot: "bg-slate-500",
        };
    }
  };

  const style = getStyles(status);
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shrink-0 transition-all ${sizeClasses} ${style.bg} ${className}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />
      )}
      <span className="capitalize">{status}</span>
    </span>
  );
}
