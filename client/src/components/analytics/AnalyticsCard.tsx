import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react";
import Skeleton from "../ui/Skeleton";

export type AnalyticsAccentColor =
  | "indigo"
  | "blue"
  | "amber"
  | "emerald"
  | "rose"
  | "purple"
  | "violet"
  | "cyan";

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trendText?: string;
  percentage?: string;
  trendDirection?: "up" | "down" | "neutral";
  accentColor?: AnalyticsAccentColor;
  tooltipText?: string;
  isLoading?: boolean;
  className?: string;
}

export default function AnalyticsCard({
  title,
  value,
  icon,
  trendText = "vs previous month",
  percentage = "+12%",
  trendDirection = "up",
  accentColor = "indigo",
  tooltipText,
  isLoading = false,
  className = "",
}: AnalyticsCardProps) {
  const colorMap: Record<
    AnalyticsAccentColor,
    {
      border: string;
      bg: string;
      iconText: string;
      pill: string;
      bar: string;
    }
  > = {
    indigo: {
      border:
        "border-indigo-500/20 hover:border-indigo-500/40 dark:border-indigo-500/20 dark:hover:border-indigo-500/50",
      bg: "bg-indigo-50/70 dark:bg-indigo-950/50",
      iconText: "text-indigo-600 dark:text-indigo-400",
      pill: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/50",
      bar: "from-indigo-600 to-indigo-400",
    },
    blue: {
      border:
        "border-blue-500/20 hover:border-blue-500/40 dark:border-blue-500/20 dark:hover:border-blue-500/50",
      bg: "bg-blue-50/70 dark:bg-blue-950/50",
      iconText: "text-blue-600 dark:text-blue-400",
      pill: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/50",
      bar: "from-blue-600 to-blue-400",
    },
    amber: {
      border:
        "border-amber-500/20 hover:border-amber-500/40 dark:border-amber-500/20 dark:hover:border-amber-500/50",
      bg: "bg-amber-50/70 dark:bg-amber-950/50",
      iconText: "text-amber-600 dark:text-amber-400",
      pill: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50",
      bar: "from-amber-600 to-amber-400",
    },
    emerald: {
      border:
        "border-emerald-500/20 hover:border-emerald-500/40 dark:border-emerald-500/20 dark:hover:border-emerald-500/50",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/50",
      iconText: "text-emerald-600 dark:text-emerald-400",
      pill: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50",
      bar: "from-emerald-600 to-emerald-400",
    },
    rose: {
      border:
        "border-rose-500/20 hover:border-rose-500/40 dark:border-rose-500/20 dark:hover:border-rose-500/50",
      bg: "bg-rose-50/70 dark:bg-rose-950/50",
      iconText: "text-rose-600 dark:text-rose-400",
      pill: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50",
      bar: "from-rose-600 to-rose-400",
    },
    purple: {
      border:
        "border-purple-500/20 hover:border-purple-500/40 dark:border-purple-500/20 dark:hover:border-purple-500/50",
      bg: "bg-purple-50/70 dark:bg-purple-950/50",
      iconText: "text-purple-600 dark:text-purple-400",
      pill: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/50",
      bar: "from-purple-600 to-purple-400",
    },
    violet: {
      border:
        "border-violet-500/20 hover:border-violet-500/40 dark:border-violet-500/20 dark:hover:border-violet-500/50",
      bg: "bg-violet-50/70 dark:bg-violet-950/50",
      iconText: "text-violet-600 dark:text-violet-400",
      pill: "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200/60 dark:border-violet-800/50",
      bar: "from-violet-600 to-violet-400",
    },
    cyan: {
      border:
        "border-cyan-500/20 hover:border-cyan-500/40 dark:border-cyan-500/20 dark:hover:border-cyan-500/50",
      bg: "bg-cyan-50/70 dark:bg-cyan-950/50",
      iconText: "text-cyan-600 dark:text-cyan-400",
      pill: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/50",
      bar: "from-cyan-600 to-cyan-400",
    },
  };

  const c = colorMap[accentColor] || colorMap.indigo;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <Skeleton width="45%" height={14} />
          <Skeleton circle width={38} height={38} />
        </div>
        <Skeleton width="35%" height={32} className="mb-3" />
        <div className="flex items-center gap-2">
          <Skeleton width="40px" height={18} className="rounded-full" />
          <Skeleton width="50%" height={14} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.15 } }}
      className={`group relative overflow-hidden rounded-2xl border bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all duration-200 ${c.border} ${className}`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.bar}`}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {title}
          </span>
          {tooltipText && (
            <div className="relative group/tooltip">
              <HelpCircle
                size={13}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help"
              />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tooltip:block w-48 p-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] font-medium shadow-md z-50 pointer-events-none text-center">
                {tooltipText}
              </div>
            </div>
          )}
        </div>

        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-200 ${c.bg} ${c.iconText}`}
        >
          {icon}
        </div>
      </div>

      <div className="mb-3">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${c.pill}`}
        >
          {trendDirection === "up" ? (
            <TrendingUp size={12} />
          ) : trendDirection === "down" ? (
            <TrendingDown size={12} />
          ) : (
            <Minus size={12} />
          )}
          {percentage}
        </span>

        <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
          {trendText}
        </span>
      </div>
    </motion.div>
  );
}
