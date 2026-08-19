import { Calendar as CalendarIcon, Video, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DEMO_UPCOMING_INTERVIEWS } from "../../data/demoData";

export default function DemoCalendar() {
  return (
    <div className="space-y-6 w-full pb-10">
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <CalendarIcon size={22} className="text-blue-600 dark:text-cyan-400" />
            <span>Interview Schedule & Milestones</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Synchronized interview rounds, technical challenges, and hiring decision deadlines.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {DEMO_UPCOMING_INTERVIEWS.map((interview) => (
          <div
            key={interview.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-2xl text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md ${interview.color}`}>
                {interview.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {interview.company}
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                    {interview.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  {interview.role}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                  <Video size={13} className="text-blue-500 dark:text-cyan-400" />
                  <span>{interview.type} • Interviewer: {interview.interviewer}</span>
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-cyan-800">
                {interview.date} @ {interview.time}
              </span>
              <Link
                to="/demo/ai-workspace?tab=interview"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>Prep with AI</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
