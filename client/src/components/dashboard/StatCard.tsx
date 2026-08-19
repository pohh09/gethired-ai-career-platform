import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Skeleton from "../ui/Skeleton";

export type StatAccentColor =
  "indigo" | "blue" | "amber" | "emerald" | "rose" | "purple";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trendText?: string;
  percentage?: number | string;
  trendDirection?: "up" | "down" | "neutral";
  accentColor?: StatAccentColor;
  isLoading?: boolean;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trendText = "vs last month",
  percentage = "+12%",
  trendDirection = "up",
  accentColor = "indigo",
  isLoading = false,
  className = "",
}: StatCardProps) {
  const colorMap: Record<
    StatAccentColor,
    {
      border: string;
      bg: string;
      iconText: string;
      accentBar: string;
      pill: string;
    }
  > = {
    indigo: {
      border:
        "border-blue-500/20 hover:border-blue-500/40 dark:border-blue-500/20 dark:hover:border-blue-500/50",
      bg: "bg-blue-50/70 dark:bg-blue-950/50",
      iconText: "text-blue-600 dark:text-cyan-400",
      accentBar: "from-blue-600 to-cyan-400",
      pill: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border-blue-200/60 dark:border-blue-800/50",
    },
    blue: {
      border:
        "border-sky-500/20 hover:border-sky-500/40 dark:border-sky-500/20 dark:hover:border-sky-500/50",
      bg: "bg-sky-50/70 dark:bg-sky-950/50",
      iconText: "text-sky-600 dark:text-sky-400",
      accentBar: "from-sky-500 to-blue-600",
      pill: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/50",
    },
    amber: {
      border:
        "border-amber-500/20 hover:border-amber-500/40 dark:border-amber-500/20 dark:hover:border-amber-500/50",
      bg: "bg-amber-50/70 dark:bg-amber-950/50",
      iconText: "text-amber-600 dark:text-amber-400",
      accentBar: "from-amber-600 to-amber-400",
      pill: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50",
    },
    emerald: {
      border:
        "border-emerald-500/20 hover:border-emerald-500/40 dark:border-emerald-500/20 dark:hover:border-emerald-500/50",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/50",
      iconText: "text-emerald-600 dark:text-emerald-400",
      accentBar: "from-emerald-600 to-emerald-400",
      pill: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50",
    },
    rose: {
      border:
        "border-rose-500/20 hover:border-rose-500/40 dark:border-rose-500/20 dark:hover:border-rose-500/50",
      bg: "bg-rose-50/70 dark:bg-rose-950/50",
      iconText: "text-rose-600 dark:text-rose-400",
      accentBar: "from-rose-600 to-rose-400",
      pill: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50",
    },
    purple: {
      border:
        "border-cyan-500/20 hover:border-cyan-500/40 dark:border-cyan-500/20 dark:hover:border-cyan-500/50",
      bg: "bg-cyan-50/70 dark:bg-cyan-950/50",
      iconText: "text-cyan-700 dark:text-cyan-300",
      accentBar: "from-cyan-500 to-blue-500",
      pill: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/50",
    },
  };

  const c = colorMap[accentColor] || colorMap.indigo;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs transition-all">
        <div className="flex items-center justify-between mb-3">
          <Skeleton width="45%" height={14} />
          <Skeleton circle width={40} height={40} />
        </div>
        <Skeleton width="35%" height={36} className="mb-3" />
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
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.accentBar}`}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate pr-2">
          {title}
        </span>

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
