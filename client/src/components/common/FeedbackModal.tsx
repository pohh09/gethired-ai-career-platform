import { useState, useEffect } from "react";
import { Send, Bug, Lightbulb, HelpCircle, MessageCircle, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import api from "../../services/api";
import { useAuthStore } from "../../store/authStore";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEEDBACK_TYPES = [
  { id: "suggestion", label: "Feature Suggestion", icon: Lightbulb, color: "text-amber-500" },
  { id: "bug", label: "Bug Report", icon: Bug, color: "text-rose-500" },
  { id: "question", label: "Question", icon: HelpCircle, color: "text-blue-500" },
  { id: "other", label: "General Feedback", icon: MessageCircle, color: "text-purple-500" },
];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuthStore();
  const [type, setType] = useState<string>("suggestion");
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name && !authorName) setAuthorName(user.name);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/feedback", {
        type,
        message: message.trim(),
        authorName: authorName.trim() || user?.name || "Anonymous",
        email: email.trim() || user?.email || "",
        pageUrl: window.location.pathname,
      });

      if (response.data?.success) {
        toast.success(
          response.data.message || "Thanks! Your feedback has been sent successfully.",
        );
        setMessage("");
        setType("suggestion");
        onClose();
      } else {
        toast.error("Unable to send feedback. Please try again.");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Unable to send feedback. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Feedback & Suggestions" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-200">
          <Mail size={16} className="text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Your message will be delivered <strong>directly to the creator's inbox via email</strong> for prompt review!
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Feedback Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FEEDBACK_TYPES.map((ft) => {
              const Icon = ft.icon;
              const isSelected = type === ft.id;
              return (
                <button
                  key={ft.id}
                  type="button"
                  onClick={() => setType(ft.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={15} className={ft.color} />
                  <span>{ft.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Your Name (Optional)"
            placeholder="e.g. Alex Rivera"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            leftIcon={<User size={14} />}
          />
          <Input
            label="Your Email (Optional, for reply)"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={14} />}
          />
        </div>

        <Textarea
          label="Your Feedback / Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Describe what you'd like improved, any bugs encountered, or ideas for new career tools..."
          required
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Send size={13} />}
          >
            Send Feedback by Email
          </Button>
        </div>
      </form>
    </Modal>
  );
}

