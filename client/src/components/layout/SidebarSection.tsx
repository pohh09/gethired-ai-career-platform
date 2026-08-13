import { type ReactNode } from "react";

export interface SidebarSectionProps {
  title?: string;
  children: ReactNode;
  collapsed?: boolean;
}

export default function SidebarSection({
  title,
  children,
  collapsed = false,
}: SidebarSectionProps) {
  return (
    <div className="space-y-1 py-1">
      {title && !collapsed && (
        <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          {title}
        </h4>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
