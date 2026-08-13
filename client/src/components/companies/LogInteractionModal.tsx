import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import type { CommunicationLog, InteractionType } from "../../types/company";

const logSchema = z.object({
  type: z.enum([
    "Email",
    "Call",
    "LinkedIn Message",
    "Referral",
    "Meeting",
    "Interview",
  ]),
  date: z.string().min(1, "Date is required"),
  recruiterName: z.string().optional(),
  notes: z.string().min(1, "Interaction notes are required"),
});

export type LogFormValues = z.infer<typeof logSchema>;

export interface LogInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  onSave?: (log: Partial<CommunicationLog>) => void;
}

export default function LogInteractionModal({
  isOpen,
  onClose,
  companyName,
  onSave,
}: LogInteractionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      type: "Call",
      date: new Date().toISOString().split("T")[0],
      recruiterName: "",
      notes: "",
    },
  });

  const onSubmit = async (values: LogFormValues) => {
    try {
      if (onSave) {
        onSave({
          type: values.type as InteractionType,
          date: values.date,
          recruiterName: values.recruiterName || undefined,
          notes: values.notes,
        });
      }

      toast.success(`Logged ${values.type} interaction for ${companyName}!`);
      reset();
      onClose();
    } catch {
      toast.error("Failed to log interaction.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Log Communication — ${companyName}`}
      description="Track calls, emails, LinkedIn messages, and recruiter meetings."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Select
            label="Interaction Type *"
            options={[
              "Email",
              "Call",
              "LinkedIn Message",
              "Referral",
              "Meeting",
              "Interview",
            ]}
            error={errors.type?.message}
            {...register("type")}
          />

          <Input
            label="Date *"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />
        </div>

        <Input
          label="Recruiter / Contact Name"
          placeholder="e.g. Sarah Connor"
          error={errors.recruiterName?.message}
          {...register("recruiterName")}
        />

        <Textarea
          label="Communication Notes *"
          placeholder="Discussed target role, team structure, remote policy, and salary expectation..."
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
            Log Interaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
