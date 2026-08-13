import { NavLink } from "react-router-dom";
import { Zap, Sparkles, ChevronDown } from "lucide-react";

export interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

export default function WorkspaceSwitcher({
  collapsed = false,
}: WorkspaceSwitcherProps) {
  return (
    <div className="p-3 border-b border-slate-200/80 dark:border-slate-800">
      <NavLink
        to="/"
        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all duration-200"
      >
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
          <Zap size={18} className="fill-current text-white" />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0 flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  GetHired AI
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                  <Sparkles size={9} /> Pro
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Personal Workspace
              </span>
            </div>
            <ChevronDown
              size={14}
              className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0 ml-1"
            />
          </div>
        )}
      </NavLink>
    </div>
  );
}
