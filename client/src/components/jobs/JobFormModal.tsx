import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { useCreateJob } from "../../hooks/useCreateJob";
import { useUpdateJob } from "../../hooks/useUpdateJob";
import { JOB_PRIORITY, JOB_STATUS } from "../../constants/status";
import type { Job } from "../../types/job";

const jobSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role title is required"),
  location: z.string().optional(),
  salary: z.union([z.number(), z.string()]).nullable().optional(),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  jobLink: z.string().optional(),
  notes: z.string().optional(),
  appliedDate: z.string().optional(),
});

export type JobFormValues = z.infer<typeof jobSchema>;

export interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Job | null;
  isDuplicate?: boolean;
}

export default function JobModal({
  isOpen,
  onClose,
  initialData,
  isDuplicate = false,
}: JobModalProps) {
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();

  const isEditing = Boolean(initialData?._id) && !isDuplicate;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: "",
      role: "",
      location: "",
      salary: null,
      status: "Applied",
      priority: "Medium",
      jobLink: "",
      notes: "",
      appliedDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        company: isDuplicate
          ? `${initialData.company} (Copy)`
          : initialData.company,
        role: initialData.role,
        location: initialData.location || "",
        salary: initialData.salary ?? null,
        status: isDuplicate ? "Applied" : initialData.status,
        priority: initialData.priority,
        jobLink: initialData.jobLink || "",
        notes: initialData.notes || "",
        appliedDate: new Date().toISOString().split("T")[0],
      });
    } else {
      reset({
        company: "",
        role: "",
        location: "",
        salary: null,
        status: "Applied",
        priority: "Medium",
        jobLink: "",
        notes: "",
        appliedDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData, isDuplicate, reset, isOpen]);

  const onSubmit = (values: JobFormValues) => {
    const parsedSalary =
      values.salary === "" ||
        values.salary === undefined ||
        values.salary === null
        ? null
        : Number(values.salary);

    const payload = {
      company: values.company,
      role: values.role,
      status: values.status,
      priority: values.priority,
      location: values.location || "",
      salary: parsedSalary,
      jobLink: values.jobLink || "",
      notes: values.notes || "",
      appliedDate: values.appliedDate || new Date().toISOString().split("T")[0],
    };

    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData._id, data: payload },
        {
          onSuccess: () => {
            toast.success(`Updated ${values.company} application!`);
            onClose();
          },
          onError: () => {
            toast.error("Failed to update application.");
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success(
            isDuplicate
              ? `Duplicated application for ${values.company}!`
              : `Added application for ${values.company}!`,
          );
          reset();
          onClose();
        },
        onError: () => {
          toast.error("Failed to create application.");
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? "Edit Application"
          : isDuplicate
            ? "Duplicate Application"
            : "New Job Application"
      }
      description={
        isEditing
          ? "Modify application details and update interview stages."
          : "Track a new job opportunity in your ATS pipeline."
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Company Name *"
            placeholder="e.g. Stripe, Vercel, Linear"
            error={errors.company?.message}
            {...register("company")}
          />

          <Input
            label="Role / Title *"
            placeholder="e.g. Senior Frontend Engineer"
            error={errors.role?.message}
            {...register("role")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Location"
            placeholder="e.g. Remote, San Francisco, CA"
            error={errors.location?.message}
            {...register("location")}
          />

          <Input
            label="Annual Salary ($ USD)"
            type="number"
            placeholder="e.g. 165000"
            error={errors.salary?.message}
            {...register("salary")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Select
            label="Application Status *"
            error={errors.status?.message}
            options={JOB_STATUS}
            {...register("status")}
          />

          <Select
            label="Priority Level *"
            error={errors.priority?.message}
            options={JOB_PRIORITY}
            {...register("priority")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Job Posting URL"
            type="url"
            placeholder="https://company.com/careers/role-id"
            error={errors.jobLink?.message}
            {...register("jobLink")}
          />

          <Input
            label="Applied Date"
            type="date"
            error={errors.appliedDate?.message}
            {...register("appliedDate")}
          />
        </div>

        <Textarea
          label="Notes & Interview Prep"
          placeholder="Recruiter contact, referral link, technical stack, compensation notes..."
          error={errors.notes?.message}
          {...register("notes")}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? "Save Changes" : "Create Application"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export { JobModal as JobFormModal };
