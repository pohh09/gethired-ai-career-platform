import { useAuthStore } from "../../store/authStore";

export interface UserCardProps {
  collapsed?: boolean;
}

export default function UserCard({ collapsed = false }: UserCardProps) {
  const { user } = useAuthStore();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {getInitials(user?.name)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-xs flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </span>
        </div>

        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {user?.name || "GetHired User"}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email || "user@gethired.ai"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
