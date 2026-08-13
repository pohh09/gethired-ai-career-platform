import { Calendar, Video, Clock, ExternalLink } from "lucide-react";
import Button from "../ui/Button";
import SectionTitle from "./SectionTitle";

export interface InterviewItem {
  id: string;
  companyName: string;
  roleTitle: string;
  interviewType:
    "System Design" | "Behavioral" | "Technical Coding" | "HR Screening";
  dateStr: string;
  timeStr: string;
  countdownStr: string;
  meetingUrl?: string;
}

export interface InterviewTimelineProps {
  interviews?: InterviewItem[];
  className?: string;
}

export default function InterviewTimeline({
  interviews = [],
  className = "",
}: InterviewTimelineProps) {
  const displayInterviews: InterviewItem[] =
    interviews.length > 0
      ? interviews
      : [
          {
            id: "int-1",
            companyName: "Stripe",
            roleTitle: "Senior Frontend Engineer — Payments",
            interviewType: "Technical Coding",
            dateStr: "Today, Aug 4",
            timeStr: "3:00 PM - 4:00 PM EST",
            countdownStr: "Today",
            meetingUrl: "https://meet.google.com/abc-defg-hij",
          },
          {
            id: "int-2",
            companyName: "Vercel",
            roleTitle: "Staff Software Engineer — Next.js",
            interviewType: "System Design",
            dateStr: "Tomorrow, Aug 5",
            timeStr: "11:00 AM - 12:00 PM EST",
            countdownStr: "Tomorrow",
            meetingUrl: "https://zoom.us/j/123456789",
          },
        ];

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Upcoming Interviews"
        subtitle="Scheduled interview rounds, types, and video meeting links"
        action={
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {displayInterviews.length} Scheduled
          </span>
        }
      />

      {displayInterviews.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-2">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-2 border border-amber-200/50">
            <Calendar size={24} />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            No interviews scheduled.
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Upcoming interviews will appear here automatically when scheduled.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayInterviews.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:border-amber-300 dark:hover:border-amber-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {item.companyName}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    • {item.roleTitle}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/50">
                    <Clock size={10} /> {item.countdownStr}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Calendar size={13} className="text-amber-500" />
                    <span>
                      {item.dateStr} at {item.timeStr}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                    {item.interviewType}
                  </span>
                </div>
              </div>

              {item.meetingUrl && (
                <div className="shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(item.meetingUrl, "_blank")}
                    leftIcon={<Video size={14} />}
                    rightIcon={<ExternalLink size={12} />}
                  >
                    Join Meeting
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
