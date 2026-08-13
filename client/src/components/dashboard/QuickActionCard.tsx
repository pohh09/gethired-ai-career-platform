import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, FileText, BarChart3, User, ArrowUpRight } from "lucide-react";

export interface QuickActionCardProps {
  onAddJobClick?: () => void;
  onAnalyticsClick?: () => void;
  className?: string;
}

export default function QuickActionCard({
  onAddJobClick,
  onAnalyticsClick,
  className = "",
}: QuickActionCardProps) {
  const navigate = useNavigate();

  const handleAddJob = () => {
    if (onAddJobClick) {
      onAddJobClick();
    } else {
      navigate("/jobs");
    }
  };

  const handleAnalytics = () => {
    if (onAnalyticsClick) {
      onAnalyticsClick();
    } else {
      const el = document.getElementById("analytics-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const actions = [
    {
      id: "add-job",
      title: "+ Add Job",
      subtitle: "Track new application",
      icon: <Plus size={18} className="text-indigo-600 dark:text-indigo-400" />,
      bg: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/60 dark:border-indigo-800/40",
      hoverBg: "hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60",
      onClick: handleAddJob,
      primary: true,
    },
    {
      id: "resume",
      title: "Resume",
      subtitle: "Update resume & links",
      icon: (
        <FileText size={18} className="text-purple-600 dark:text-purple-400" />
      ),
      bg: "bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/40",
      hoverBg: "hover:bg-purple-100/70 dark:hover:bg-purple-900/60",
      onClick: () => navigate("/profile"),
      primary: false,
    },
    {
      id: "analytics",
      title: "Analytics",
      subtitle: "Pipeline metrics & trends",
      icon: (
        <BarChart3
          size={18}
          className="text-emerald-600 dark:text-emerald-400"
        />
      ),
      bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/40",
      hoverBg: "hover:bg-emerald-100/70 dark:hover:bg-emerald-900/60",
      onClick: handleAnalytics,
      primary: false,
    },
    {
      id: "profile",
      title: "Profile",
      subtitle: "Account settings & info",
      icon: <User size={18} className="text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-800/40",
      hoverBg: "hover:bg-blue-100/70 dark:hover:bg-blue-900/60",
      onClick: () => navigate("/profile"),
      primary: false,
    },
  ];

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
    >
      <div className="mb-5">
        <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Quick Actions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Fast-track your job application workflow
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`group text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${action.bg} ${action.hoverBg}`}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs shrink-0">
                {action.icon}
              </div>
              <div className="overflow-hidden">
                <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {action.title}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {action.subtitle}
                </span>
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
