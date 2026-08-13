import React from "react";
import { motion } from "framer-motion";
import Skeleton from "./Skeleton";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  accentColor?: "indigo" | "blue" | "amber" | "emerald" | "rose" | "purple";
  isLoading?: boolean;
  subtitle?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  accentColor = "indigo",
  isLoading = false,
  subtitle,
  className = "",
}: StatCardProps) {
  const accentStyles = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/60",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "hover:border-indigo-300 dark:hover:border-indigo-800",
      glow: "group-hover:shadow-indigo-500/10",
      bar: "bg-indigo-600 dark:bg-indigo-500",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/60",
      text: "text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-300 dark:hover:border-blue-800",
      glow: "group-hover:shadow-blue-500/10",
      bar: "bg-blue-600 dark:bg-blue-500",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/60",
      text: "text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-300 dark:hover:border-amber-800",
      glow: "group-hover:shadow-amber-500/10",
      bar: "bg-amber-600 dark:bg-amber-500",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-800",
      glow: "group-hover:shadow-emerald-500/10",
      bar: "bg-emerald-600 dark:bg-emerald-500",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/60",
      text: "text-rose-600 dark:text-rose-400",
      border: "hover:border-rose-300 dark:hover:border-rose-800",
      glow: "group-hover:shadow-rose-500/10",
      bar: "bg-rose-600 dark:bg-rose-500",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/60",
      text: "text-purple-600 dark:text-purple-400",
      border: "hover:border-purple-300 dark:hover:border-purple-800",
      glow: "group-hover:shadow-purple-500/10",
      bar: "bg-purple-600 dark:bg-purple-500",
    },
  };

  const style = accentStyles[accentColor];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Skeleton width="45%" height={16} />
          <Skeleton circle width={40} height={40} />
        </div>
        <Skeleton width="35%" height={32} className="mb-2" />
        <Skeleton width="65%" height={12} />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 ${style.border} ${style.glow} ${className}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${style.bar}`} />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 border border-slate-200/50 dark:border-slate-800/50 ${style.bg} ${style.text}`}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
