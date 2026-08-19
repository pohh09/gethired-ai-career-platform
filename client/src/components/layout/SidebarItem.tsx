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
            ? "bg-blue-50/90 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-300 font-bold shadow-xs border border-blue-100/80 dark:border-blue-900/50"
            : "text-slate-600 dark:text-slate-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-cyan-300"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={`shrink-0 transition-transform group-hover:scale-110 duration-200 ${
              isActive
                ? "text-blue-600 dark:text-cyan-400"
                : "text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-cyan-400"
            }`}
          />

          {!collapsed && <span className="truncate">{name}</span>}

          {!collapsed && badge !== undefined && (
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-cyan-300">
              {badge}
            </span>
          )}

          {isActive && (
            <motion.div
              layoutId="sidebarActiveBar"
              className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-gradient-to-b from-blue-600 to-cyan-400"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
