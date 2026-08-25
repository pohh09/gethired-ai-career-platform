import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface UIState {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  mobileDrawerOpen: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  toggleMobileDrawer: () => void;
}

const applyThemeToDOM = (theme: ThemeMode = "dark") => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "dark",
      sidebarCollapsed: false,
      mobileDrawerOpen: false,

      setTheme: (theme: ThemeMode) => {
        applyThemeToDOM(theme);
        set({ theme });
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed: boolean) =>
        set({ sidebarCollapsed: collapsed }),

      setMobileDrawerOpen: (open: boolean) => set({ mobileDrawerOpen: open }),

      toggleMobileDrawer: () =>
        set((state) => ({ mobileDrawerOpen: !state.mobileDrawerOpen })),
    }),
    {
      name: "jobflow-ui-settings",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        applyThemeToDOM(state?.theme || "dark");
      },
    },
  ),
);

export { applyThemeToDOM };
