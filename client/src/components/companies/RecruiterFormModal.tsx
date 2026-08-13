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
import type { Recruiter } from "../../types/company";

const recruiterSchema = z.object({
  name: z.string().min(1, "Recruiter name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  linkedIn: z.string().optional(),
  phone: z.string().optional(),
  relationshipStatus: z.enum(["Cold", "Warm", "Active", "Referral"]),
  notes: z.string().optional(),
});

export type RecruiterFormValues = z.infer<typeof recruiterSchema>;

export interface RecruiterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  onSave?: (recruiter: Partial<Recruiter>) => void;
  initialData?: Recruiter | null;
}

export default function RecruiterFormModal({
  isOpen,
  onClose,
  companyName,
  onSave,
  initialData,
}: RecruiterFormModalProps) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterFormValues>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: {
      name: "",
      role: "Lead Tech Recruiter",
      email: "",
      linkedIn: "",
      phone: "",
      relationshipStatus: "Active",
      notes: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        role: initialData.role,
        email: initialData.email || "",
        linkedIn: initialData.linkedIn || "",
        phone: initialData.phone || "",
        relationshipStatus: initialData.relationshipStatus,
        notes: initialData.notes || "",
      });
    } else {
      reset({
        name: "",
        role: "Lead Tech Recruiter",
        email: "",
        linkedIn: "",
        phone: "",
        relationshipStatus: "Active",
        notes: "",
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (values: RecruiterFormValues) => {
    try {
      if (onSave) {
        onSave({
          name: values.name,
          role: values.role,
          email: values.email || undefined,
          linkedIn: values.linkedIn || undefined,
          phone: values.phone || undefined,
          relationshipStatus: values.relationshipStatus,
          notes: values.notes || undefined,
          lastContactDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      }

      toast.success(
        isEditing
          ? `Updated recruiter contact ${values.name}!`
          : `Added ${values.name} to ${companyName} recruiters!`,
      );
      reset();
      onClose();
    } catch {
      toast.error("Failed to save recruiter contact.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? `Edit Recruiter — ${initialData?.name}`
          : `Add Recruiter Contact — ${companyName}`
      }
      description="Store recruiter email, LinkedIn profile, phone number, and relationship status."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Full Name *"
            placeholder="e.g. Sarah Connor"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Role / Title *"
            placeholder="e.g. Lead Tech Recruiter"
            error={errors.role?.message}
            {...register("role")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Email Address"
            type="email"
            placeholder="sarah@stripe.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 234-5678"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="LinkedIn Profile URL"
            type="url"
            placeholder="https://linkedin.com/in/sarah-connor"
            error={errors.linkedIn?.message}
            {...register("linkedIn")}
          />

          <Select
            label="Relationship Status *"
            options={["Cold", "Warm", "Active", "Referral"]}
            error={errors.relationshipStatus?.message}
            {...register("relationshipStatus")}
          />
        </div>

        <Textarea
          label="Recruiter Notes & Connection Details"
          placeholder="Connected via referral, prefers morning emails, scheduled follow-up for Friday..."
          error={errors.notes?.message}
          {...register("notes")}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? "Save Changes" : "Add Recruiter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
