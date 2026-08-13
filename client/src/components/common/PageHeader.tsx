import { type ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  showBreadcrumbs?: boolean;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
  secondaryAction,
  showBreadcrumbs = true,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 ${className}`}
    >
      <div className="space-y-1">
        {showBreadcrumbs && (
          <div className="mb-2">
            <Breadcrumbs />
          </div>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex items-center gap-2.5 shrink-0">
          {secondaryAction}
          {action}
        </div>
      )}
    </div>
  );
}
