import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth";
import { queryClient } from "../lib/queryClient";
import { useResumeStore } from "./resumeStore";
import { useReminderStore } from "./reminderStore";
import { useDocumentStore } from "./documentStore";

import api from "../services/api";

interface AuthState {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => {
        try {
          useResumeStore.getState().initUser(user.id);
          useReminderStore.getState().initUser(user.id);
          useDocumentStore.getState().initUser(user.id);
        } catch {}
        set({
          user,
          token,
        });
      },

      logout: () => {
        try {
          const currentToken = useAuthStore.getState().token;
          if (currentToken) {
            api.post("/auth/logout").catch(() => {});
          }
        } catch {}

        try {
          queryClient.clear();
        } catch {}
        useResumeStore.getState().reset();
        useReminderStore.getState().reset();
        useDocumentStore.getState().reset();
        set({
          user: null,
          token: null,
        });
      },

      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
    }),
    {
      name: "jobflow-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.user?.id) {
          useResumeStore.getState().initUser(state.user.id);
          useReminderStore.getState().initUser(state.user.id);
          useDocumentStore.getState().initUser(state.user.id);
        } else {
          useResumeStore.getState().reset();
          useReminderStore.getState().reset();
          useDocumentStore.getState().reset();
        }
      },
    },
  ),
);

