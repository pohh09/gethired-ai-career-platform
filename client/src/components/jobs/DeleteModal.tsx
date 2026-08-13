import ConfirmModal from "../ui/ConfirmModal";
import type { Job } from "../../types/job";

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  job?: Job | null;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  job,
  isLoading = false,
}: DeleteModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Job Application"
      message={
        <span>
          Are you sure you want to delete the job application for{" "}
          <strong className="text-slate-900 dark:text-slate-100 font-bold">
            {job?.role || "this role"}
          </strong>{" "}
          at{" "}
          <strong className="text-slate-900 dark:text-slate-100 font-bold">
            {job?.company || "this company"}
          </strong>
          ? This action is permanent and cannot be undone.
        </span>
      }
      confirmText="Delete Application"
      cancelText="Cancel"
      isLoading={isLoading}
      variant="danger"
    />
  );
}
