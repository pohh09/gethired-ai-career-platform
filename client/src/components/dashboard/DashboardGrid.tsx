import { type ReactNode } from "react";

export interface DashboardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export default function DashboardGrid({
  children,
  columns = 5,
  className = "",
}: DashboardGridProps) {
  const colClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  };

  return (
    <div
      className={`grid gap-5 ${colClasses[columns] || colClasses[5]} ${className}`}
    >
      {children}
    </div>
  );
}
