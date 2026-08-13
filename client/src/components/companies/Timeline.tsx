import { Mail, Phone, MessageSquare, Users, Calendar, Trash2, Video } from "lucide-react";
import type { CommunicationLog, InteractionType } from "../../types/company";

export interface TimelineProps {
  logs?: CommunicationLog[];
  onDeleteLog?: (logId: string) => void;
  className?: string;
}

export default function Timeline({
  logs = [],
  onDeleteLog,
  className = "",
}: TimelineProps) {
  const getLogIcon = (type: InteractionType) => {
    switch (type) {
      case "Email":
        return <Mail size={15} className="text-blue-600 dark:text-blue-400" />;
      case "Call":
        return <Phone size={15} className="text-emerald-600 dark:text-emerald-400" />;
      case "LinkedIn Message":
        return <MessageSquare size={15} className="text-cyan-600 dark:text-cyan-400" />;
      case "Referral":
        return <Users size={15} className="text-purple-600 dark:text-purple-400" />;
      case "Meeting":
        return <Video size={15} className="text-amber-600 dark:text-amber-400" />;
      case "Interview":
        return <Calendar size={15} className="text-rose-600 dark:text-rose-400" />;
      default:
        return <MessageSquare size={15} className="text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getLogBadgeStyle = (type: InteractionType) => {
    switch (type) {
      case "Email":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40";
      case "Call":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40";
      case "LinkedIn Message":
        return "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/40";
      case "Referral":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40";
      case "Meeting":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
      case "Interview":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40";
      default:
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40";
    }
  };

  if (logs.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/90 dark:bg-slate-900/90">
        <MessageSquare size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          No Communication Logs Yet
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
          Log calls, emails, LinkedIn messages, and recruiter interviews to build your interaction history.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 ${className}`}>
      {logs.map((log) => (
        <div key={log.id} className="relative group">
          <div className="absolute -left-[30px] top-1 h-7 w-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center">
            {getLogIcon(log.type)}
          </div>


          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800 transition-all">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getLogBadgeStyle(log.type)}`}>
                  {log.type}
                </span>

                {log.recruiterName && (
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    with {log.recruiterName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {log.date}
                </span>

                {onDeleteLog && (
                  <button
                    type="button"
                    onClick={() => onDeleteLog(log.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete log entry"
                    aria-label="Delete log entry"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {log.notes}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
