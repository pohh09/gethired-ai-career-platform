import TimelineItem from "./TimelineItem";
import type { ActivityItem } from "../../types/activity";

export interface ActivityTimelineProps {
  activities?: ActivityItem[];
  className?: string;
}

export default function ActivityTimeline({
  activities = [],
  className = "",
}: ActivityTimelineProps) {
  const defaultActivities: ActivityItem[] = [
    {
      id: "act-1",
      action: "Status Changed",
      company: "Stripe",
      role: "Senior Frontend Engineer",
      details: "updated status for Stripe (Senior Frontend Engineer)",
      timestamp: "10 mins ago",
      user: { name: "Puja Das", avatarInitials: "PD" },
      previousValue: "Applied",
      newValue: "Interview",
    },
    {
      id: "act-2",
      action: "Interview Scheduled",
      company: "Vercel",
      role: "Staff Product Engineer",
      details: "scheduled Technical Assessment round for Vercel",
      timestamp: "1 hour ago",
      user: { name: "Puja Das", avatarInitials: "PD" },
    },
    {
      id: "act-3",
      action: "Salary Updated",
      company: "Linear",
      role: "Frontend Systems Engineer",
      details: "updated compensation target to $185,000 for Linear",
      timestamp: "3 hours ago",
      user: { name: "Puja Das", avatarInitials: "PD" },
    },
    {
      id: "act-4",
      action: "Notes Added",
      company: "Notion",
      role: "Full Stack Engineer",
      details: "added system design prep notes for Notion",
      timestamp: "1 day ago",
      user: { name: "Puja Das", avatarInitials: "PD" },
    },
    {
      id: "act-5",
      action: "Job Added",
      company: "Google",
      role: "Staff Software Engineer",
      details: "added new application for Google (Staff Software Engineer)",
      timestamp: "2 days ago",
      user: { name: "Puja Das", avatarInitials: "PD" },
    },
    {
      id: "act-6",
      action: "Job Deleted",
      company: "Legacy Tech",
      role: "Web Developer",
      details: "archived and removed legacy application entry",
      timestamp: "3 days ago",
      user: { name: "Puja Das", avatarInitials: "PD" },
    },
  ];

  const items = activities.length > 0 ? activities : defaultActivities;

  return (
    <div
      className={`relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 ${className}`}
    >
      {items.map((act) => (
        <TimelineItem key={act.id} item={act} />
      ))}
    </div>
  );
}
