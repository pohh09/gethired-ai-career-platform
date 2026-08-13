import { useMemo } from "react";
import { Plus, CalendarDays } from "lucide-react";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

export interface DashboardHeaderProps {
  onAddJobClick?: () => void;
  className?: string;
}

export default function DashboardHeader({
  onAddJobClick,
  className = "",
}: DashboardHeaderProps) {
  const { user } = useAuthStore();

  const greetingObj = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", emoji: "☀️" };
    if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
    if (hour < 22) return { text: "Good Evening", emoji: "🌙" };
    return { text: "Working Late?", emoji: "🌃" };
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const userName = user?.name || "Pooja";

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>
              {greetingObj.text}, {userName}
            </span>
            <span>{greetingObj.emoji}</span>
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            Keep tracking your applications and stay consistent.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <CalendarDays size={15} className="text-indigo-500" />
            <span>{formattedDate}</span>
          </div>

          {onAddJobClick && (
            <Button
              variant="primary"
              size="md"
              onClick={onAddJobClick}
              leftIcon={<Plus size={16} />}
            >
              Add Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
