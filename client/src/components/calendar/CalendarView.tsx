import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import CalendarCell, { type CalendarEventItem } from "./CalendarCell";

export interface CalendarViewProps {
  currentDate: Date;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  events?: CalendarEventItem[];
  className?: string;
}

export default function CalendarView({
  currentDate,
  selectedDate,
  onDateChange,
  onSelectDate,
  events = [],
  className = "",
}: CalendarViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const todayStr = new Date().toISOString().split("T")[0];
  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEventItem[]>();
    events.forEach((ev) => {
      const list = map.get(ev.date) || [];
      list.push(ev);
      map.set(ev.date, list);
    });
    return map;
  }, [events]);

  const gridCells = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDayOfMonth.getDay() - 1; // Mon = 0
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const totalDays = lastDayOfMonth.getDate();
    const cells = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        dayNumber: d,
        dateObj,
        dateStr,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDateStr,
        events: eventsByDate.get(dateStr) || [],
      });
    }

    return cells;
  }, [year, month, todayStr, selectedDateStr, eventsByDate]);

  const handlePrevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    onDateChange(now);
    onSelectDate(now);
  };

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 sm:p-6 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-2xs">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {monthName} {year}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive interview schedule and assessment calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Today
          </button>

          <div className="flex items-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
        {weekdays.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {gridCells.map((cell, idx) => {
          if (!cell) {
            return <CalendarCell key={`pad-${idx}`} />;
          }

          return (
            <CalendarCell
              key={cell.dateStr}
              dayNumber={cell.dayNumber}
              dateStr={cell.dateStr}
              isToday={cell.isToday}
              isSelected={cell.isSelected}
              events={cell.events}
              onClick={() => onSelectDate(cell.dateObj)}
            />
          );
        })}
      </div>
    </div>
  );
}
