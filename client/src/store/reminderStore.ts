import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface JobReminder {
  id: string;
  jobId: string;
  company: string;
  role: string;
  type: "Follow-up" | "Interview" | "Assessment" | "Deadline";
  title: string;
  dueDate: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
}

interface ReminderState {
  reminders: JobReminder[];
  addReminder: (
    reminder: Omit<JobReminder, "id" | "isCompleted" | "createdAt">,
  ) => void;
  toggleCompleteReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  getRemindersForJob: (jobId: string) => JobReminder[];
}

const INITIAL_REMINDERS: JobReminder[] = [
  {
    id: "rem-1",
    jobId: "demo-1",
    company: "Stripe",
    role: "Senior Frontend Engineer",
    type: "Interview",
    title: "Technical System Architecture Interview Today at 2:00 PM",
    dueDate: new Date().toISOString().split("T")[0],
    notes:
      "Review React fiber architecture, virtual DOM batching, and Stripe API design.",
    isCompleted: false,
    createdAt: "2026-08-01",
  },
  {
    id: "rem-2",
    jobId: "demo-2",
    company: "Vercel",
    role: "Staff Product Engineer",
    type: "Follow-up",
    title: "Follow up with Recruiter regarding Next.js assessment feedback",
    dueDate: "2026-08-06",
    notes: "Send polite check-in email if response pending.",
    isCompleted: false,
    createdAt: "2026-08-02",
  },
];

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: INITIAL_REMINDERS,

      addReminder: (reminder) => {
        const newReminder: JobReminder = {
          ...reminder,
          id: `rem-${Date.now()}`,
          isCompleted: false,
          createdAt: new Date().toISOString().split("T")[0],
        };

        set((state) => ({
          reminders: [newReminder, ...state.reminders],
        }));
      },

      toggleCompleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, isCompleted: !r.isCompleted } : r,
          ),
        }));
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },

      getRemindersForJob: (jobId) => {
        return get().reminders.filter((r) => r.jobId === jobId);
      },
    }),
    {
      name: "jobflow_reminder_store_v1",
    },
  ),
);
