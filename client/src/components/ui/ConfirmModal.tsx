import { type ReactNode } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "primary";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${
            variant === "danger"
              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
              : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
          }`}
        >
          {variant === "danger" ? (
            <Trash2 size={26} />
          ) : (
            <AlertTriangle size={26} />
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "primary"}
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
