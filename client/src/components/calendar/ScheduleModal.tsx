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

const scheduleSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role title is required"),
  type: z.string().min(1, "Interview type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  meetingLink: z.string().optional(),
  location: z.string().optional(),
  interviewer: z.string().optional(),
  reminderTime: z.string().optional(),
  notes: z.string().optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: ScheduleFormValues) => void;
  initialDate?: Date;
  initialData?: ScheduleFormValues | null;
}

const EVENT_TYPES = [
  "Interview",
  "Assessment",
  "HR Call",
  "Technical Round",
  "Manager Round",
  "Offer Discussion",
  "Follow-up",
  "Reminder",
];

const REMINDER_TIMES = [
  "15 minutes before",
  "30 minutes before",
  "1 hour before",
  "2 hours before",
  "1 day before",
];

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
  initialData,
}: ScheduleModalProps) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      company: "",
      role: "",
      type: "Technical Round",
      date: initialDate
        ? initialDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      time: "10:00",
      meetingLink: "",
      location: "Google Meet",
      interviewer: "",
      reminderTime: "30 minutes before",
      notes: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        company: "",
        role: "",
        type: "Technical Round",
        date: initialDate
          ? initialDate.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        time: "10:00",
        meetingLink: "",
        location: "Google Meet",
        interviewer: "",
        reminderTime: "30 minutes before",
        notes: "",
      });
    }
  }, [initialData, initialDate, reset, isOpen]);

  const onSubmit = async (values: ScheduleFormValues) => {
    try {
      if (onSave) {
        onSave(values);
      }
      toast.success(
        isEditing
          ? `Updated interview for ${values.company}!`
          : `Scheduled ${values.type} with ${values.company}!`,
      );
      onClose();
    } catch {
      toast.error("Failed to schedule event.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Scheduled Event" : "Schedule Interview / Event"}
      description="Add interview rounds, technical assessments, and reminders to your schedule."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Company Name *"
            placeholder="e.g. Google, Stripe, Vercel"
            error={errors.company?.message}
            {...register("company")}
          />

          <Input
            label="Role Title *"
            placeholder="e.g. Senior Frontend Engineer"
            error={errors.role?.message}
            {...register("role")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Select
            label="Event Type *"
            error={errors.type?.message}
            options={EVENT_TYPES}
            {...register("type")}
          />

          <Input
            label="Date *"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />

          <Input
            label="Time *"
            type="time"
            error={errors.time?.message}
            {...register("time")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Meeting Link (URL)"
            type="url"
            placeholder="https://meet.google.com/abc-defg-hij"
            error={errors.meetingLink?.message}
            {...register("meetingLink")}
          />

          <Input
            label="Location / Platform"
            placeholder="e.g. Google Meet, Zoom, SF Office"
            error={errors.location?.message}
            {...register("location")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Interviewer Name(s)"
            placeholder="e.g. Sarah Connor, Tech Lead"
            error={errors.interviewer?.message}
            {...register("interviewer")}
          />

          <Select
            label="Reminder Notification"
            options={REMINDER_TIMES}
            error={errors.reminderTime?.message}
            {...register("reminderTime")}
          />
        </div>

        <Textarea
          label="Preparation Notes & Focus Topics"
          placeholder="System design prep, behavioral stories, coding interview questions..."
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
            {isEditing ? "Save Changes" : "Schedule Event"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
