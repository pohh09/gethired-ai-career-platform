import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useCommunityStore } from "../../store/communityStore";
import toast from "react-hot-toast";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Interview Prep",
  "Resume & ATS",
  "Job Search Strategy",
  "Salary & Offer",
  "General Advice",
];

export default function AskQuestionModal({
  isOpen,
  onClose,
}: AskQuestionModalProps) {
  const { askQuestion } = useCommunityStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Interview Prep");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please enter a question title and details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await askQuestion({
        title: title.trim(),
        body: body.trim(),
        category,
        tags: tags.length > 0 ? tags : [category],
      });

      toast.success("Question posted to Community Q&A! 💬");
      onClose();
      setTitle("");
      setBody("");
      setTagsInput("");
    } catch {
      toast.error("Failed to post question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="Ask the Community">
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ask questions about interview questions, compensation negotiation, ATS tips, or career transitions.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium outline-hidden"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Question Title"
          placeholder="e.g. How to answer 'What is your greatest technical weakness'?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Details & Context
          </label>
          <textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Provide background, your current approach, or what specific advice you are looking for..."
            required
            className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <Input
          label="Tags (Comma separated)"
          placeholder="e.g. Behavioral, Negotiation, SystemDesign"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            className="font-bold flex items-center gap-1.5"
          >
            <MessageSquare size={14} />
            <span>Post Question</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
