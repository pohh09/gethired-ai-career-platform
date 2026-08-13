import { Video, Copy, ExternalLink, Clock, User } from "lucide-react";
import toast from "react-hot-toast";
import EventBadge from "./EventBadge";
import type { CalendarEventItem } from "./CalendarCell";

export interface ExtendedCalendarEvent extends CalendarEventItem {
  meetingLink?: string;
  location?: string;
  interviewer?: string;
  notes?: string;
}

export interface TimelineProps {
  events?: ExtendedCalendarEvent[];
  className?: string;
}

export default function Timeline({
  events = [],
  className = "",
}: TimelineProps) {
  const handleCopyLink = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success("Copied meeting link to clipboard!");
  };

  if (events.length === 0) {
    return (
      <div
        className={`p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl ${className}`}
      >
        <Clock
          size={32}
          className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
        />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          No events scheduled for this day.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {events.map((ev) => (
        <div
          key={ev.id}
          className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                  {ev.time || "All Day"}
                </span>
                <EventBadge type={ev.type} size="sm" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                {ev.company} —{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {ev.title}
                </span>
              </h4>
            </div>

            {ev.meetingLink && (
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={ev.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  <Video size={13} />
                  <span>Join</span>
                  <ExternalLink size={11} />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyLink(ev.meetingLink)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy link"
                >
                  <Copy size={14} />
                </button>
              </div>
            )}
          </div>

          {(ev.interviewer || ev.location) && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              {ev.interviewer && (
                <div className="flex items-center gap-1">
                  <User size={13} className="text-slate-400" />
                  <span>Interviewer: {ev.interviewer}</span>
                </div>
              )}
              {ev.location && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Platform: {ev.location}</span>
                </div>
              )}
            </div>
          )}

          {ev.notes && (
            <p className="text-xs text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 leading-relaxed">
              {ev.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
