import React, { type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  iconOnly = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const sizeStyles = {
    sm: iconOnly ? "p-1.5 text-xs" : "px-3 py-1.5 text-xs gap-1.5",
    md: iconOnly ? "p-2 text-sm" : "px-4 py-2 text-sm gap-2",
    lg: iconOnly ? "p-3 text-base" : "px-6 py-3 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-sm shadow-blue-500/25 focus:ring-cyan-400 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-offset-slate-900",
    secondary:
      "bg-blue-50/80 hover:bg-blue-100/80 text-blue-900 focus:ring-blue-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:focus:ring-offset-slate-900 border border-blue-100 dark:border-slate-700",
    outline:
      "border border-blue-200 dark:border-blue-900/50 bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-blue-900 dark:text-blue-200 focus:ring-cyan-400 dark:focus:ring-offset-slate-900",
    ghost:
      "bg-transparent hover:bg-blue-50/80 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 focus:ring-cyan-400 dark:focus:ring-offset-slate-900",
    danger:
      "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm shadow-rose-500/20 focus:ring-rose-500 dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-offset-slate-900",
    success:
      "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-500/20 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-offset-slate-900",
    accent:
      "bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold shadow-sm shadow-cyan-500/30 focus:ring-cyan-400 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:focus:ring-offset-slate-900",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={combinedClasses}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <Loader2 size={size === "sm" ? 14 : size === "lg" ? 18 : 16} className="animate-spin" />
          {!iconOnly && children}
        </>
      ) : (
        <>
          {leftIcon}
          {!iconOnly && children}
          {rightIcon}
        </>
      )}
    </motion.button>
  );
}
