import { NavLink } from "react-router-dom";
import { Sparkles, ChevronDown } from "lucide-react";
import { GetHiredLogoIcon } from "../common/GetHiredLogo";

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
        <GetHiredLogoIcon size={36} />

        {!collapsed && (
          <div className="flex-1 min-w-0 flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  GetHired AI
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-cyan-300 border border-blue-200/60 dark:border-cyan-800/40">
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
