import type { TagType } from "../../types/company";

export interface TagsProps {
  tags: TagType[];
  onTagClick?: (tag: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export default function Tags({
  tags,
  onTagClick,
  className = "",
  size = "md",
}: TagsProps) {
  const getTagStyle = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "dream company":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-100 dark:hover:bg-purple-900/60";
      case "referral":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60";
      case "startup":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/60";
      case "mnc":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40 hover:bg-blue-100 dark:hover:bg-blue-900/60";
      case "remote":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60";
      case "priority":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-rose-900/60";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700";
    }
  };

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((t, idx) => {
        const isClickable = Boolean(onTagClick);
        return (
          <span
            key={`${t}-${idx}`}
            onClick={(e) => {
              if (onTagClick) {
                e.stopPropagation();
                onTagClick(t);
              }
            }}
            className={`font-extrabold rounded-md border tracking-wider shrink-0 transition-colors ${
              isClickable ? "cursor-pointer" : ""
            } ${sizeClasses} ${getTagStyle(t)}`}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (isClickable && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                e.stopPropagation();
                onTagClick?.(t);
              }
            }}
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}
