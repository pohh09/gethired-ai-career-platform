import { useState } from "react";
import { Bell, Check, Volume2 } from "lucide-react";
import toast from "react-hot-toast";

export interface ReminderItem {
  id: string;
  title: string;
  timeLabel: string;
  dueText: string;
  enabled: boolean;
}

export interface ReminderCardProps {
  reminders?: ReminderItem[];
  className?: string;
}

export default function ReminderCard({
  reminders = [],
  className = "",
}: ReminderCardProps) {
  const [items, setItems] = useState<ReminderItem[]>(() => {
    if (reminders.length > 0) return reminders;
    return [
      {
        id: "r1",
        title: "Stripe Technical Round",
        timeLabel: "Tomorrow, 10:00 AM",
        dueText: "In 15h",
        enabled: true,
      },
      {
        id: "r2",
        title: "Vercel System Design Prep",
        timeLabel: "Aug 5, 2:00 PM",
        dueText: "In 2 days",
        enabled: true,
      },
      {
        id: "r3",
        title: "Linear Offer Follow-up",
        timeLabel: "Aug 6, 11:00 AM",
        dueText: "In 3 days",
        enabled: false,
      },
    ];
  });

  const [notificationsGranted, setNotificationsGranted] = useState(() => {
    return (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    );
  });

  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") {
      toast.error(
        "Browser notifications are not supported in this environment.",
      );
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotificationsGranted(true);
      toast.success("Browser notifications enabled for interview reminders!");
    } else {
      toast.error("Notification permission declined.");
    }
  };

  const toggleReminder = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
    toast.success("Updated reminder notification preferences.");
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold shadow-2xs">
            <Bell size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Reminder Notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated alerts before upcoming interview rounds
            </p>
          </div>
        </div>

        {!notificationsGranted ? (
          <button
            type="button"
            onClick={requestNotificationPermission}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Volume2 size={13} />
            <span>Enable Alerts</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
            <Check size={12} /> Active
          </span>
        )}
      </div>

      <div className="space-y-3">
        {items.map((rem) => (
          <div
            key={rem.id}
            className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {rem.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {rem.timeLabel} •{" "}
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {rem.dueText}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleReminder(rem.id)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer shrink-0 ${
                rem.enabled
                  ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/50"
                  : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              }`}
            >
              {rem.enabled ? "On" : "Off"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
