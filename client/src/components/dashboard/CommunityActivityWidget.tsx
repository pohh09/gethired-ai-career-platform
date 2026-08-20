import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Flame,
  PartyPopper,
  HelpCircle,
  ArrowRight,
  Share2,
  Send,
  Trophy,
} from "lucide-react";
import Button from "../ui/Button";
import { useCommunityStore } from "../../store/communityStore";
import ShareDocumentModal from "../community/ShareDocumentModal";
import toast from "react-hot-toast";

export default function CommunityActivityWidget() {
  const {
    myStreak,
    cohortStreaks,
    successStories,
    cheerStory,
    questions,
    answerQuestion,
    fetchStreakData,
    fetchStories,
    fetchQuestions,
  } = useCommunityStore();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [quickReplyText, setQuickReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    fetchStreakData();
    fetchStories();
    fetchQuestions();
  }, []);

  const latestStory = successStories[0] || {
    _id: "seed-story",
    authorName: "Sarah M.",
    role: "Senior Frontend Engineer",
    company: "Stripe",
    storyType: "offer",
    story: "Received a formal offer after 4 intense interview rounds! GetHired's mock interview prep helped me nail system design questions.",
    congratsCount: 18,
    congrats: [],
  };

  const openQuestion = questions[0] || {
    _id: "seed-question",
    authorName: "Alex Rivera",
    title: "How should I structure the 'Tell me about a time you had a technical disagreement' answer?",
    category: "Interview Prep",
    answersCount: 1,
    upvoteCount: 14,
    body: "I struggle with behavioral questions about conflict without sounding defensive. Any proven STAR frameworks?",
  };

  const hasCongratulated = latestStory.congrats?.includes("user-current");

  const handleCheer = async () => {
    try {
      await cheerStory(latestStory._id);
      toast.success("Cheered on this win! 🎉");
    } catch {
      toast.error("Failed to cheer.");
    }
  };

  const handleQuickAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReplyText.trim()) return;
    try {
      setIsReplying(true);
      await answerQuestion(openQuestion._id, quickReplyText.trim());
      setQuickReplyText("");
      toast.success("Your answer was shared with the community! 🔥 +1 Streak activity");
    } catch {
      toast.error("Failed to post answer.");
    } finally {
      setIsReplying(false);
    }
  };

  const cohortRank = cohortStreaks.findIndex((s) => s.isCurrentUser || s.id === "user-current") + 1 || 4;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Users size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Community Activity & Streaks</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Stay motivated with peer feedback, candidate streaks, and mutual cheering.
            </p>
          </div>
        </div>

        <Link
          to="/community"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Community Hub</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* 3-Column Community Highlight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. User Momentum & Streak Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/70 dark:border-amber-900/40 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Flame size={16} className="text-amber-500 fill-amber-500 animate-pulse" />
                <span>Search Momentum</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Cohort Rank #{cohortRank}
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {myStreak.currentStreak}
              </span>
              <span className="text-xs font-bold text-slate-500">Day Streak 🔥</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Longest: <strong className="text-slate-800 dark:text-slate-200">{myStreak.longestStreak} days</strong> • Keep momentum alive with 1 daily action.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            className="w-full text-xs font-bold justify-center border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-950"
            leftIcon={<Share2 size={13} />}
          >
            Share Draft for Review
          </Button>
        </div>

        {/* 2. Recent Success Story Celebration */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/70 dark:border-emerald-900/40 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <PartyPopper size={15} className="text-emerald-500" />
                <span>Latest Win Cheered</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {latestStory.storyType.toUpperCase()}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {latestStory.authorName} landed {latestStory.role}
              </p>
              {latestStory.company && (
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  @{latestStory.company}
                </p>
              )}
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed italic">
              "{latestStory.story}"
            </p>
          </div>

          <button
            type="button"
            onClick={handleCheer}
            className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              hasCongratulated
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
            }`}
          >
            <Trophy size={13} />
            <span>{hasCongratulated ? "Congrats Sent! 🎉" : "Send Congrats 🎉"} ({latestStory.congratsCount || 0})</span>
          </button>
        </div>

        {/* 3. Open Candidate Question (Need Help) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/70 dark:border-indigo-900/40 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <HelpCircle size={15} className="text-indigo-500" />
                <span>Q&A Needs Advice</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {openQuestion.category}
              </span>
            </div>

            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
              {openQuestion.title}
            </p>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              Asked by {openQuestion.authorName} • {openQuestion.answersCount || 0} replies
            </p>
          </div>

          <form onSubmit={handleQuickAnswer} className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="Share quick advice..."
              value={quickReplyText}
              onChange={(e) => setQuickReplyText(e.target.value)}
              className="flex-1 text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isReplying || !quickReplyText.trim()}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white cursor-pointer transition-all shrink-0"
              title="Post Reply"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Share Document Modal */}
      {isShareModalOpen && (
        <ShareDocumentModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
