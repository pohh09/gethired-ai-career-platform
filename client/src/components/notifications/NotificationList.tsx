import { useState, useMemo } from "react";
import { CheckCheck, Trash2, BellOff } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { useReminderStore } from "../../store/reminderStore";
import type {
  AppNotification,
  NotificationCategory,
} from "../../types/notification";

export interface NotificationListProps {
  initialNotifications?: AppNotification[];
  className?: string;
}

export default function NotificationList({
  initialNotifications = [],
  className = "",
}: NotificationListProps) {
  const reminders = useReminderStore((state) => state.reminders);

  const [items, setItems] = useState<AppNotification[]>(() => {
    if (initialNotifications.length > 0) return initialNotifications;
    return [
      {
        id: "notif-1",
        type: "Interview Scheduled",
        title: "Upcoming Technical Interview with Stripe",
        description: "Staff Engineer technical round scheduled for today.",
        timestamp: "10 mins ago",
        isRead: false,
        category: "Interviews",
      },
      {
        id: "notif-2",
        type: "New Job Added",
        title: "Added Vercel Application",
        description:
          "Senior Product Engineer position added to active job pipeline.",
        timestamp: "2 hours ago",
        isRead: false,
        category: "Jobs",
      },
      {
        id: "notif-3",
        type: "Offer Received",
        title: "Weekly Goal Completed 🎉",
        description: "You completed 5 application submissions this week!",
        timestamp: "1 day ago",
        isRead: true,
        category: "System",
      },
      {
        id: "notif-4",
        type: "Reminder Due",
        title: "Follow-up Reminder",
        description:
          "7 days elapsed since application submission. Consider recruiter check-in.",
        timestamp: "2 days ago",
        isRead: true,
        category: "Jobs",
      },
    ];
  });

  const combinedNotifications = useMemo(() => {
    const reminderNotifs: AppNotification[] = reminders.map((r) => ({
      id: `rem-notif-${r.id}`,
      type: r.type === "Interview" ? "Interview Scheduled" : "Reminder Due",
      title: `${r.type}: ${r.title}`,
      description: `For ${r.role} at ${r.company}. Due on ${r.dueDate}. ${r.notes || ""}`,
      timestamp: `Due ${r.dueDate}`,
      isRead: r.isCompleted,
      category: r.type === "Interview" ? "Interviews" : "Jobs",
    }));

    return [...reminderNotifs, ...items];
  }, [reminders, items]);

  const [activeCategory, setActiveCategory] =
    useState<NotificationCategory>("All");

  const filteredNotifications = useMemo(() => {
    return combinedNotifications.filter((item) => {
      if (activeCategory === "Unread") return !item.isRead;
      if (activeCategory === "All") return true;
      return item.category === activeCategory;
    });
  }, [combinedNotifications, activeCategory]);

  const unreadCount = combinedNotifications.filter((i) => !i.isRead).length;

  const handleMarkRead = (id: string) => {
    if (id.startsWith("rem-notif-")) {
      const remId = id.replace("rem-notif-", "");
      useReminderStore.getState().toggleCompleteReminder(remId);
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isRead: true } : i)),
      );
    }
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
    reminders.forEach((r) => {
      if (!r.isCompleted) {
        useReminderStore.getState().toggleCompleteReminder(r.id);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (id.startsWith("rem-notif-")) {
      const remId = id.replace("rem-notif-", "");
      useReminderStore.getState().deleteReminder(remId);
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const categories: NotificationCategory[] = [
    "All",
    "Unread",
    "Jobs",
    "Interviews",
    "System",
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
          {categories.map((cat) => {
            const count =
              cat === "Unread"
                ? unreadCount
                : cat === "All"
                  ? combinedNotifications.length
                  : combinedNotifications.filter((i) => i.category === cat)
                    .length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${activeCategory === cat
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          )}

          {combinedNotifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <BellOff
            size={32}
            className="mx-auto text-slate-300 dark:text-slate-600 mb-2"
          />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No notifications found
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            You're all caught up! Workspace notifications and scheduled
            reminders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
