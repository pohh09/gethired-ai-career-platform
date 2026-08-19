import { Send, Calendar, FileText, CheckCircle2 } from "lucide-react";
import SectionTitle from "./SectionTitle";

export interface ActivityEvent {
  id: string;
  type: "applied" | "interview" | "resume" | "offer";
  title: string;
  subtitle: string;
  timeAgo: string;
}

export interface ActivityTimelineProps {
  events?: ActivityEvent[];
  className?: string;
}

export default function ActivityTimeline({
  events = [],
  className = "",
}: ActivityTimelineProps) {
  const mockEvents: ActivityEvent[] =
    events.length > 0
      ? events
      : [
        {
          id: "act-ev-1",
          type: "applied",
          title: "Applied to Stripe",
          subtitle: "Senior Frontend Engineer — Payments role",
          timeAgo: "2 hours ago",
        },
        {
          id: "act-ev-2",
          type: "interview",
          title: "Interview Scheduled with Vercel",
          subtitle:
            "Technical Architecture round scheduled with Marcus Vance",
          timeAgo: "1 day ago",
        },
        {
          id: "act-ev-3",
          type: "resume",
          title: "Updated Resume Attachment",
          subtitle: "Uploaded Senior_Frontend_Tailored_Resume.pdf",
          timeAgo: "2 days ago",
        },
        {
          id: "act-ev-4",
          type: "offer",
          title: "Offer Package Received",
          subtitle: "Stripe Connect team sent official compensation offer",
          timeAgo: "3 days ago",
        },
      ];

  const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "applied":
        return <Send size={14} className="text-blue-500" />;
      case "interview":
        return <Calendar size={14} className="text-amber-500" />;
      case "resume":
        return <FileText size={14} className="text-purple-500" />;
      case "offer":
        return <CheckCircle2 size={14} className="text-emerald-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Recent Activity"
        subtitle="Chronological feed of your latest application updates and events"
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {mockEvents.map((ev) => (
            <div
              key={ev.id}
              className="relative flex items-start justify-between gap-3 group"
            >
              <div className="absolute -left-[29px] top-0.5 h-6 w-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center">
                {getEventIcon(ev.type)}
              </div>

              <div>
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {ev.title}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {ev.subtitle}
                </p>
              </div>

              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {ev.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
