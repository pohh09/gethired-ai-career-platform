import { type ReactNode } from "react";
import Skeleton from "../ui/Skeleton";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  height?: number | string;
}

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  isLoading = false,
  className = "",
}: ChartCardProps) {
  if (isLoading) {
    return (
      <div
        className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm ${className}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton width="160px" height={20} />
            <Skeleton width="220px" height={14} />
          </div>
          <Skeleton width="80px" height={28} className="rounded-full" />
        </div>
        <Skeleton width="100%" height={260} className="rounded-xl" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="w-full min-h-[260px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
