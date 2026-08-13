import { useState } from "react";
import { Video, Copy, Calendar as CalendarIcon, Clock } from "lucide-react";
import toast from "react-hot-toast";
import EventBadge from "./EventBadge";
import type { ExtendedCalendarEvent } from "./Timeline";

export interface UpcomingEventsProps {
  events?: ExtendedCalendarEvent[];
  className?: string;
}

export default function UpcomingEvents({
  events = [],
  className = "",
}: UpcomingEventsProps) {
  const [tab, setTab] = useState<"today" | "tomorrow" | "week">("today");

  const todayStr = new Date().toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);

  const filteredEvents = events.filter((ev) => {
    if (tab === "today") return ev.date === todayStr;
    if (tab === "tomorrow") return ev.date === tomorrowStr;
    const evDate = new Date(ev.date);
    return evDate >= new Date() && evDate <= weekEnd;
  });

  const handleCopyLink = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success("Copied meeting link!");
  };

  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Upcoming Schedule
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interviews, assessments and upcoming preparation deadlines
          </p>
        </div>


        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("today")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${tab === "today"
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setTab("tomorrow")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${tab === "tomorrow"
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => setTab("week")}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${tab === "week"
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
          >
            This Week
          </button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <CalendarIcon size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            No interviews scheduled for {tab === "today" ? "today" : tab === "tomorrow" ? "tomorrow" : "this week"}.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-indigo-100 dark:from-indigo-950/60 dark:to-slate-800 border border-indigo-200/50 dark:border-indigo-800/30 flex items-center justify-center font-bold text-sm text-indigo-700 dark:text-indigo-300 shrink-0">
                  {ev.company.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {ev.company} — <span className="font-semibold text-slate-600 dark:text-slate-300">{ev.title}</span>
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-slate-600 dark:text-slate-400">
                      <Clock size={11} /> {ev.time || "All Day"}
                    </span>
                    <span>•</span>
                    <span>{ev.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <EventBadge type={ev.type} size="sm" />
                {ev.meetingLink && (
                  <a
                    href={ev.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                    title="Join meeting"
                  >
                    <Video size={15} />
                  </a>
                )}
                {ev.meetingLink && (
                  <button
                    type="button"
                    onClick={() => handleCopyLink(ev.meetingLink)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Copy link"
                  >
                    <Copy size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
