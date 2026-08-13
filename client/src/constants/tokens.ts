export const colors = {
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#090d16",
  },
  success: {
    light: "#ecfdf5",
    DEFAULT: "#10b981",
    dark: "#065f46",
  },
  warning: {
    light: "#fffbeb",
    DEFAULT: "#f59e0b",
    dark: "#92400e",
  },
  danger: {
    light: "#fef2f2",
    DEFAULT: "#ef4444",
    dark: "#991b1b",
  },
  info: {
    light: "#f0f9ff",
    DEFAULT: "#0ea5e9",
    dark: "#075985",
  },
} as const;

export const typography = {
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display: "text-4xl lg:text-5xl font-extrabold tracking-tight leading-none",
  h1: "text-3xl font-extrabold tracking-tight leading-tight",
  h2: "text-2xl font-bold tracking-tight leading-snug",
  h3: "text-xl font-bold tracking-tight leading-snug",
  h4: "text-lg font-semibold leading-normal",
  body: "text-sm leading-relaxed font-normal",
  caption:
    "text-xs font-medium leading-normal text-slate-500 dark:text-slate-400",
  label:
    "text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300",
} as const;

export const spacing = {
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
} as const;

export const radius = {
  none: "0px",
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.25rem", // 20px
  full: "9999px",
} as const;

export const shadows = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  glowPrimary: "0 0 20px -3px rgba(99, 102, 241, 0.3)",
} as const;

export const zIndex = {
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
} as const;

export const transitions = {
  fast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
