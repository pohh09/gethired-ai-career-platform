import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import Skeleton from "../ui/Skeleton";

export interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  comparisonText?: string;
  percentageChange?: string;
  trendDirection?: "up" | "down" | "neutral";
  accentColor?: "indigo" | "amber" | "emerald" | "purple" | "blue" | "rose" | "cyan" | "sky";
  isLoading?: boolean;
  miniGraphData?: number[];
  className?: string;
}

export default function KpiCard({
  title,
  value,
  icon,
  comparisonText = "vs last month",
  percentageChange = "+14%",
  trendDirection = "up",
  accentColor = "blue",
  isLoading = false,
  miniGraphData = [4, 6, 5, 8, 7, 10, 12],
  className = "",
}: KpiCardProps) {
  const accentStyles = {
    indigo: {
      bg: "bg-blue-50 dark:bg-blue-950/60",
      text: "text-blue-600 dark:text-cyan-400",
      border: "hover:border-blue-300 dark:hover:border-blue-800",
      glow: "hover:shadow-blue-500/10",
      bar: "bg-blue-600 dark:bg-blue-500",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/60",
      text: "text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-300 dark:hover:border-amber-800",
      glow: "hover:shadow-amber-500/10",
      bar: "bg-amber-600 dark:bg-amber-500",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-800",
      glow: "hover:shadow-emerald-500/10",
      bar: "bg-emerald-600 dark:bg-emerald-500",
    },
    purple: {
      bg: "bg-cyan-50 dark:bg-cyan-950/60",
      text: "text-cyan-800 dark:text-cyan-300",
      border: "hover:border-cyan-300 dark:hover:border-cyan-800",
      glow: "hover:shadow-cyan-500/10",
      bar: "bg-cyan-600 dark:bg-cyan-500",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/60",
      text: "text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-300 dark:hover:border-blue-800",
      glow: "hover:shadow-blue-500/10",
      bar: "bg-blue-600 dark:bg-blue-500",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/60",
      text: "text-cyan-800 dark:text-cyan-300",
      border: "hover:border-cyan-300 dark:hover:border-cyan-800",
      glow: "hover:shadow-cyan-500/10",
      bar: "bg-cyan-600 dark:bg-cyan-500",
    },
    sky: {
      bg: "bg-sky-50 dark:bg-sky-950/60",
      text: "text-sky-600 dark:text-sky-400",
      border: "hover:border-sky-300 dark:hover:border-sky-800",
      glow: "hover:shadow-sky-500/10",
      bar: "bg-sky-600 dark:bg-sky-500",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/60",
      text: "text-rose-600 dark:text-rose-400",
      border: "hover:border-rose-300 dark:hover:border-rose-800",
      glow: "hover:shadow-rose-500/10",
      bar: "bg-rose-600 dark:bg-rose-500",
    },
  };

  const style = accentStyles[accentColor];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Skeleton width="50%" height={16} />
          <Skeleton circle width={40} height={40} />
        </div>
        <Skeleton width="40%" height={36} className="mb-3" />
        <Skeleton width="70%" height={14} />
      </div>
    );
  }

  const maxVal = Math.max(...miniGraphData, 1);

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 ${style.border} ${style.glow} ${className}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${style.bar}`} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border border-slate-200/50 dark:border-slate-800/50 ${style.bg} ${style.text}`}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 mb-3">
        <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>

        <div className="flex items-end gap-1 h-8 shrink-0">
          {miniGraphData.map((val, idx) => {
            const heightPercent = Math.max(15, (val / maxVal) * 100);
            return (
              <div
                key={idx}
                style={{ height: `${heightPercent}%` }}
                className={`w-1.5 rounded-full transition-all duration-300 ${idx === miniGraphData.length - 1
                    ? style.bar
                    : "bg-slate-200 dark:bg-slate-800"
                  }`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span
          className={`inline-flex items-center gap-0.5 font-extrabold px-2 py-0.5 rounded-md text-[11px] ${trendDirection === "up"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : trendDirection === "down"
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
        >
          {trendDirection === "up" ? (
            <TrendingUp size={12} />
          ) : trendDirection === "down" ? (
            <TrendingDown size={12} />
          ) : null}
          <span>{percentageChange}</span>
        </span>
        <span className="truncate">{comparisonText}</span>
      </div>
    </motion.div>
  );
}
