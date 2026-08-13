import { type ReactNode } from "react";
import { motion } from "framer-motion";

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  hoverable = false,
  animate = false,
  onClick,
}: CardProps) {
  const baseClasses = `rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 shadow-sm transition-all duration-200 ${
    hoverable
      ? "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer hover:-translate-y-0.5"
      : ""
  } ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col space-y-1.5 pb-4 border-b border-slate-100 dark:border-slate-800/60 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>
      {children}
    </p>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`pt-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center pt-4 border-t border-slate-100 dark:border-slate-800/60 ${className}`}
    >
      {children}
    </div>
  );
}
