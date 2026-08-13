import { Loader2 } from "lucide-react";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export default function Loader({
  size = "md",
  fullScreen = false,
  text,
  className = "",
}: LoaderProps) {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Loader2
        className="animate-spin text-indigo-600 dark:text-indigo-400"
        size={sizeMap[size]}
      />
      {text && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs dark:bg-slate-950/40">
        {content}
      </div>
    );
  }

  return content;
}
