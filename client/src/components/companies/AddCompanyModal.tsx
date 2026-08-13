import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import type { Company } from "../../types/company";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  website: z.string().optional(),
  size: z.string().min(1, "Company size is required"),
  headquarters: z.string().min(1, "Headquarters is required"),
  workplaceType: z.enum(["Remote", "Hybrid", "Onsite"]),
  tagsStr: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (company: Partial<Company>) => void;
  initialData?: Company | null;
}

const INDUSTRY_OPTIONS = [
  "Software / SaaS",
  "Fintech",
  "AI / Machine Learning",
  "E-Commerce",
  "Healthcare",
  "Developer Tools",
  "Cybersecurity",
];

const SIZE_OPTIONS = [
  "1 - 50 employees",
  "50 - 200 employees",
  "200 - 1,000 employees",
  "1,000 - 5,000 employees",
  "5,000+ employees",
];

export default function AddCompanyModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddCompanyModalProps) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      industry: "Software / SaaS",
      website: "",
      size: "200 - 1,000 employees",
      headquarters: "San Francisco, CA",
      workplaceType: "Remote",
      tagsStr: "Dream Company, Remote",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        industry: initialData.industry,
        website: initialData.website || "",
        size: initialData.size,
        headquarters: initialData.headquarters,
        workplaceType: initialData.workplaceType,
        tagsStr: initialData.tags?.join(", ") || "",
      });
    } else {
      reset({
        name: "",
        industry: "Software / SaaS",
        website: "",
        size: "200 - 1,000 employees",
        headquarters: "San Francisco, CA",
        workplaceType: "Remote",
        tagsStr: "Dream Company, Remote",
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      const parsedTags = values.tagsStr
        ? values.tagsStr
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const companyData: Partial<Company> = {
        name: values.name,
        industry: values.industry,
        website: values.website || undefined,
        size: values.size,
        headquarters: values.headquarters,
        workplaceType: values.workplaceType,
        tags: parsedTags,
      };

      if (onSave) {
        onSave(companyData);
      }

      toast.success(
        isEditing
          ? `Updated company profile for ${values.name}!`
          : `Added ${values.name} to Company CRM!`,
      );
      onClose();
    } catch {
      toast.error("Failed to save company profile.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Company Profile" : "Add Target Company"}
      description="Store company size, industry, headquarters, and relationship tags."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Company Name *"
          placeholder="e.g. Stripe, Vercel, Notion"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Select
            label="Industry *"
            options={INDUSTRY_OPTIONS}
            error={errors.industry?.message}
            {...register("industry")}
          />

          <Select
            label="Company Size *"
            options={SIZE_OPTIONS}
            error={errors.size?.message}
            {...register("size")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Headquarters *"
            placeholder="e.g. San Francisco, CA"
            error={errors.headquarters?.message}
            {...register("headquarters")}
          />

          <Select
            label="Workplace Model *"
            options={["Remote", "Hybrid", "Onsite"]}
            error={errors.workplaceType?.message}
            {...register("workplaceType")}
          />
        </div>

        <Input
          label="Website URL"
          type="url"
          placeholder="https://stripe.com"
          error={errors.website?.message}
          {...register("website")}
        />

        <Input
          label="Tags (comma separated)"
          placeholder="e.g. Dream Company, Referral, Startup, Priority"
          error={errors.tagsStr?.message}
          {...register("tagsStr")}
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
            {isEditing ? "Save Changes" : "Add Company"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
