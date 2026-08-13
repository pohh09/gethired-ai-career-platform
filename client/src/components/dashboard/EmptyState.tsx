import { type ReactNode } from "react";
import { Plus, Rocket } from "lucide-react";
import Button from "../ui/Button";

export interface DashboardEmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "No Job Applications Tracked Yet",
  description = "Start adding companies and job titles to view live pipeline analytics, interview conversion rates, and weekly submission trends.",
  icon,
  actionText = "Add Your First Job",
  onAction,
  className = "",
}: DashboardEmptyStateProps) {
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center p-10 sm:p-14 text-center rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-b from-indigo-50/40 via-white to-white dark:from-indigo-950/20 dark:via-slate-900/40 dark:to-slate-900/60 shadow-xs ${className}`}
    >
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/10 dark:ring-indigo-400/20">
          {icon || <Rocket size={38} className="animate-pulse" />}
        </div>
        <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md">
          <Plus size={16} />
        </div>
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="lg"
          leftIcon={<Plus size={18} />}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
