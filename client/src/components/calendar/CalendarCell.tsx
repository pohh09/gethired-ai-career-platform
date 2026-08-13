import { type ReactNode } from "react";

export interface CalendarEventItem {
  id: string;
  title: string;
  company: string;
  type: string;
  time?: string;
  date: string; // YYYY-MM-DD
}

export interface CalendarCellProps {
  dayNumber?: number;
  dateStr?: string;
  isToday?: boolean;
  isSelected?: boolean;
  isCurrentMonth?: boolean;
  events?: CalendarEventItem[];
  onClick?: () => void;
  children?: ReactNode;
}

export default function CalendarCell({
  dayNumber,
  isToday = false,
  isSelected = false,
  isCurrentMonth = true,
  events = [],
  onClick,
}: CalendarCellProps) {
  if (!dayNumber) {
    return <div className="h-16 sm:h-28 border border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-950/20 opacity-40" />;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-16 sm:h-28 p-1 sm:p-2 border transition-all text-left flex flex-col justify-between group cursor-pointer relative ${isSelected
        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xs ring-2 ring-indigo-500/20"
        : isToday
          ? "border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900"
          : isCurrentMonth
            ? "border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            : "border-slate-100 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-950/20 opacity-50"
        }`}
    >

      <div className="flex items-center justify-between w-full">
        <span
          className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 ${isToday
            ? "bg-indigo-600 text-white shadow-xs"
            : isSelected
              ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
              : isCurrentMonth
                ? "text-slate-800 dark:text-slate-200"
                : "text-slate-400 dark:text-slate-600"
            }`}
        >
          {dayNumber}
        </span>

        {events.length > 0 && (
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {events.length}
          </span>
        )}
      </div>


      <div className="w-full space-y-1 overflow-hidden my-1">
        {events.slice(0, 2).map((ev) => (
          <div
            key={ev.id}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 truncate"
          >
            <span className="font-bold">{ev.time ? `${ev.time} ` : ""}</span>
            <span className="truncate">{ev.company || ev.title}</span>
          </div>
        ))}

        {events.length > 2 && (
          <span className="text-[10px] font-bold text-slate-400 pl-1">
            +{events.length - 2} more
          </span>
        )}
      </div>
    </button>
  );
}
