import React, { useState } from "react";
import {
  PartyPopper,
  Award,
  Video,
  Sparkles,
} from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useCommunityStore } from "../../store/communityStore";
import toast from "react-hot-toast";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateStoryModal({
  isOpen,
  onClose,
}: CreateStoryModalProps) {
  const { postStory } = useCommunityStore();

  const [storyType, setStoryType] = useState<"offer" | "interview" | "milestone">("offer");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [story, setStory] = useState("");
  const [tips, setTips] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !story.trim()) {
      toast.error("Please fill in company, role, and your story.");
      return;
    }

    setIsSubmitting(true);
    try {
      await postStory({
        storyType,
        company: company.trim(),
        role: role.trim(),
        story: story.trim(),
        tips: tips.trim(),
      });

      toast.success("Congratulations! Your win has been shared to the feed! 🎉");
      onClose();
      setCompany("");
      setRole("");
      setStory("");
      setTips("");
    } catch {
      toast.error("Failed to post story.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="Celebrate a Job Search Win 🎉">
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Share your milestone to inspire fellow job seekers and celebrate your hard work!
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Milestone Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStoryType("offer")}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                storyType === "offer"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              <Award size={14} />
              <span>Job Offer</span>
            </button>

            <button
              type="button"
              onClick={() => setStoryType("interview")}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                storyType === "interview"
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              <Video size={14} />
              <span>Interview</span>
            </button>

            <button
              type="button"
              onClick={() => setStoryType("milestone")}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                storyType === "milestone"
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              <PartyPopper size={14} />
              <span>Milestone</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Company"
            placeholder="e.g. Stripe, Figma, Apple"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <Input
            label="Role Title"
            placeholder="e.g. Senior Frontend Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Your Story / Reflection
          </label>
          <textarea
            rows={3}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="What was the journey like? How did you prepare or overcome challenges?"
            required
            className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" />
            Top Tip for Others (Optional)
          </label>
          <input
            type="text"
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="e.g. Practice behavioral STAR stories with a timer!"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            <PartyPopper size={14} />
            <span>Post Celebration</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
