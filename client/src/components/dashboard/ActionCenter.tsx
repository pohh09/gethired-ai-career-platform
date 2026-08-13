import { useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  ArrowUpRight,
  Check,
} from "lucide-react";
import Button from "../ui/Button";
import SectionTitle from "./SectionTitle";

export interface ActionItem {
  id: string;
  type:
    "followup" | "interview" | "assessment" | "stale" | "offer" | "rejection";
  title: string;
  subtitle: string;
  companyName: string;
  priority: "High" | "Medium" | "Low";
  actionText: string;
  onAction?: () => void;
  dateStr?: string;
}

export interface ActionCenterProps {
  onNavigateToJobs?: () => void;
  onNavigateToCalendar?: () => void;
  className?: string;
}

export default function ActionCenter({
  onNavigateToJobs,
  onNavigateToCalendar,
  className = "",
}: ActionCenterProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const initialItems: ActionItem[] = [
    {
      id: "act-1",
      type: "interview",
      title: "Technical System Design Interview",
      subtitle: "Scheduled with Stripe • Sarah Connor (Lead Recruiter)",
      companyName: "Stripe",
      priority: "High",
      actionText: "Join Meeting",
      dateStr: "Today, 3:00 PM",
      onAction: onNavigateToCalendar,
    },
    {
      id: "act-2",
      type: "followup",
      title: "Follow-up email expected for Senior Frontend Engineer",
      subtitle: "8 days since last screening interview with Linear team",
      companyName: "Linear",
      priority: "High",
      actionText: "Follow Up",
      dateStr: "Overdue by 1 day",
      onAction: onNavigateToJobs,
    },
    {
      id: "act-3",
      type: "assessment",
      title: "Complete Take-Home Coding Assessment",
      subtitle: "Vercel Next.js Core Engineering assessment due in 48 hours",
      companyName: "Vercel",
      priority: "Medium",
      actionText: "Start Test",
      dateStr: "Due Aug 6, 2026",
      onAction: onNavigateToJobs,
    },
    {
      id: "act-4",
      type: "offer",
      title: "Review Compensation & Offer Package",
      subtitle: "Official offer received for Staff Product Engineer role",
      companyName: "Stripe",
      priority: "High",
      actionText: "Review Offer",
      dateStr: "Expires Aug 10",
      onAction: onNavigateToJobs,
    },
  ];

  const activeItems = initialItems.filter((i) => !dismissedIds.includes(i.id));

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const getPriorityStyle = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40";
      case "Medium":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getTypeIcon = (type: ActionItem["type"]) => {
    switch (type) {
      case "interview":
        return <Calendar size={16} className="text-amber-500" />;
      case "followup":
        return <Clock size={16} className="text-indigo-500" />;
      case "assessment":
        return <AlertCircle size={16} className="text-purple-500" />;
      case "offer":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      default:
        return <MessageSquare size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Action Center"
        subtitle="High-priority application items requiring your immediate attention today"
        action={
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {activeItems.length} Urgent Item
            {activeItems.length !== 1 ? "s" : ""}
          </span>
        }
      />

      {activeItems.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm space-y-2">
          <Check size={28} className="mx-auto text-emerald-500 mb-1" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            All Caught Up!
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You have no pending follow-ups or urgent interview tasks for today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.companyName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityStyle(
                        item.priority,
                      )}`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-400 font-medium">
                  {item.dateStr}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDismiss(item.id)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={item.onAction}
                    rightIcon={<ArrowUpRight size={13} />}
                  >
                    {item.actionText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
