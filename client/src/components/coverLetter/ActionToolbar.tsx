import { Copy, RefreshCw, BookmarkPlus } from "lucide-react";
import Button from "../ui/Button";
import DownloadButton from "./DownloadButton";

export interface ActionToolbarProps {
  company: string;
  role: string;
  letterText: string;
  onCopy: () => void;
  onSaveToJob?: () => void;
  onRegenerate: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function ActionToolbar({
  company,
  role,
  letterText,
  onCopy,
  onSaveToJob,
  onRegenerate,
  isLoading = false,
  className = "",
}: ActionToolbarProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          leftIcon={<Copy size={14} className="text-slate-500" />}
        >
          Copy Letter
        </Button>

        <DownloadButton company={company} role={role} letterText={letterText} />

        {onSaveToJob && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveToJob}
            leftIcon={<BookmarkPlus size={14} className="text-indigo-500" />}
          >
            Save to Job
          </Button>
        )}
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={onRegenerate}
        isLoading={isLoading}
        leftIcon={<RefreshCw size={14} />}
        className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
      >
        Regenerate
      </Button>
    </div>
  );
}
