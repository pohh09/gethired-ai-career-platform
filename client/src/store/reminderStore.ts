import { create } from "zustand";

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
  currentUserId: string | null;
  reminders: JobReminder[];
  initUser: (userId: string | null) => void;
  reset: () => void;
  addReminder: (
    reminder: Omit<JobReminder, "id" | "isCompleted" | "createdAt">,
  ) => void;
  toggleCompleteReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  getRemindersForJob: (jobId: string) => JobReminder[];
}

const getReminderStorageKey = (userId: string | null) =>
  userId ? `gethired_reminders_${userId}` : "gethired_reminders_guest";

const loadRemindersFromStorage = (userId: string | null): JobReminder[] => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getReminderStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRemindersToStorage = (
  userId: string | null,
  reminders: JobReminder[],
) => {
  if (!userId) return;
  try {
    localStorage.setItem(
      getReminderStorageKey(userId),
      JSON.stringify(reminders),
    );
  } catch {}
};

export const useReminderStore = create<ReminderState>()((set, get) => ({
  currentUserId: null,
  reminders: [],

  initUser: (userId) => {
    const reminders = loadRemindersFromStorage(userId);
    set({
      currentUserId: userId,
      reminders,
    });
  },

  reset: () => {
    set({
      currentUserId: null,
      reminders: [],
    });
  },

  addReminder: (reminder) => {
    const { currentUserId, reminders } = get();
    const newReminder: JobReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      isCompleted: false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newReminder, ...reminders];
    saveRemindersToStorage(currentUserId, updated);
    set({ reminders: updated });
  },

  toggleCompleteReminder: (id) => {
    const { currentUserId, reminders } = get();
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r,
    );
    saveRemindersToStorage(currentUserId, updated);
    set({ reminders: updated });
  },

  deleteReminder: (id) => {
    const { currentUserId, reminders } = get();
    const updated = reminders.filter((r) => r.id !== id);
    saveRemindersToStorage(currentUserId, updated);
    set({ reminders: updated });
  },

  getRemindersForJob: (jobId) => {
    return get().reminders.filter((r) => r.jobId === jobId);
  },
}));

