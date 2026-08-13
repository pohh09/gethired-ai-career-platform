import { Plus } from "lucide-react";
import Button from "../ui/Button";
import Timeline, { type ExtendedCalendarEvent } from "./Timeline";

export interface DayPanelProps {
  selectedDate: Date;
  events?: ExtendedCalendarEvent[];
  onScheduleClick?: () => void;
  className?: string;
}

export default function DayPanel({
  selectedDate,
  events = [],
  onScheduleClick,
  className = "",
}: DayPanelProps) {
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Selected Day Agenda
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {formattedDate}
          </h3>
        </div>

        {onScheduleClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onScheduleClick}
            leftIcon={<Plus size={14} />}
          >
            Add Event
          </Button>
        )}
      </div>

      <Timeline events={events} />
    </div>
  );
}
