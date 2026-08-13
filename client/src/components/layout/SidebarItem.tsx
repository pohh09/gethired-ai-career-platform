import { type ElementType } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export interface SidebarItemProps {
  name: string;
  path: string;
  icon: ElementType;
  badge?: string | number;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  name,
  path,
  icon: Icon,
  badge,
  collapsed = false,
  onClick,
}: SidebarItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 select-none ${
          isActive
            ? "bg-indigo-50/80 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={`shrink-0 transition-transform group-hover:scale-110 duration-200 ${
              isActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
            }`}
          />

          {!collapsed && <span className="truncate">{name}</span>}

          {!collapsed && badge !== undefined && (
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {badge}
            </span>
          )}

          {isActive && (
            <motion.div
              layoutId="sidebarActiveBar"
              className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-indigo-600 dark:bg-indigo-500"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
