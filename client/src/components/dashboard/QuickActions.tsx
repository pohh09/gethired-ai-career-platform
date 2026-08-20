import { Plus, Calendar, BarChart3, FileText, UserCog } from "lucide-react";
import SectionTitle from "./SectionTitle";

export interface QuickActionsProps {
  onAddApplication?: () => void;
  onScheduleInterview?: () => void;
  onOpenAnalytics?: () => void;
  onManageResumes?: () => void;
  onUpdateProfile?: () => void;
  className?: string;
}

export default function QuickActions({
  onAddApplication,
  onScheduleInterview,
  onOpenAnalytics,
  onManageResumes,
  onUpdateProfile,
  className = "",
}: QuickActionsProps) {
  const actions = [
    {
      title: "Add Application",
      subtitle: "Track a new job opening",
      icon: Plus,
      color:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200/50",
      onClick: onAddApplication,
    },
    {
      title: "Schedule Interview",
      subtitle: "Log upcoming meeting round",
      icon: Calendar,
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200/50",
      onClick: onScheduleInterview,
    },
    {
      title: "Resumes & Docs",
      subtitle: "Manage master files & drafts",
      icon: FileText,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200/50",
      onClick: onManageResumes,
    },
    {
      title: "Pipeline Analytics",
      subtitle: "Review conversion rates",
      icon: BarChart3,
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200/50",
      onClick: onOpenAnalytics,
    },
    {
      title: "Settings & Profile",
      subtitle: "Edit account preferences",
      icon: UserCog,
      color:
        "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50",
      onClick: onUpdateProfile,
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Quick Actions"
        subtitle="Common workflows to speed up your job search management"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              type="button"
              onClick={act.onClick}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all text-left group cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${act.color}`}
              >
                <Icon size={18} />
              </div>

              <div>
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {act.title}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {act.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
