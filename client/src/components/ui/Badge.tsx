import React from "react";

export type BadgeVariant =
  | "applied"
  | "screening"
  | "assessment"
  | "interview"
  | "hr"
  | "offer"
  | "rejected"
  | "high"
  | "medium"
  | "low"
  | "default"
  | "neutral";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant | string;
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  dot = false,
}: BadgeProps) {
  const normalizedVariant = (
    typeof children === "string"
      ? children.toLowerCase()
      : variant.toLowerCase()
  ) as string;

  const getVariantStyles = (v: string) => {
    switch (v) {
      case "applied":
        return "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/40";
      case "screening":
        return "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/40";
      case "assessment":
        return "bg-cyan-50 text-cyan-700 border-cyan-200/60 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800/40";
      case "interview":
        return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/40";
      case "hr round":
      case "hr":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/40";
      case "offer":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/40";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/40";
      case "high":
        return "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/40";
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/40";
      case "low":
        return "bg-slate-100 text-slate-700 border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/40";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const getDotStyles = (v: string) => {
    switch (v) {
      case "applied":
        return "bg-blue-500";
      case "screening":
        return "bg-purple-500";
      case "assessment":
        return "bg-cyan-500";
      case "interview":
        return "bg-amber-500";
      case "hr round":
      case "hr":
        return "bg-indigo-500";
      case "offer":
        return "bg-emerald-500";
      case "rejected":
        return "bg-rose-500";
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-slate-400";
      default:
        return "bg-slate-500";
    }
  };

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${getVariantStyles(
        normalizedVariant,
      )} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${getDotStyles(normalizedVariant)}`}
        />
      )}
      {children}
    </span>
  );
}
