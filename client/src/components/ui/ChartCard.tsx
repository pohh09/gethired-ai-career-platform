import { type ReactNode } from "react";
import Skeleton from "./Skeleton";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
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
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton width="140px" height={20} />
            <Skeleton width="200px" height={14} />
          </div>
        </div>
        <Skeleton width="100%" height={260} className="rounded-xl" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="w-full min-h-[260px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
