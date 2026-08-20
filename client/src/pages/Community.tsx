import { useState, useEffect } from "react";
import {
  Users,
  MessageSquareShare,
  Flame,
  PartyPopper,
  HelpCircle,
  Plus,
  Search,
  FileText,
  Briefcase,
  Globe,
  Lock,
  ThumbsUp,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Send,
  Shield,
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import PeerReviewModal from "../components/community/PeerReviewModal";
import ShareDocumentModal from "../components/community/ShareDocumentModal";
import CreateStoryModal from "../components/community/CreateStoryModal";
import AskQuestionModal from "../components/community/AskQuestionModal";
import { useCommunityStore } from "../store/communityStore";
import type { SharedDocumentItem } from "../types/community";
import toast from "react-hot-toast";

type CommunityTab = "peer_feedback" | "streaks" | "success_stories" | "qa";

export default function Community() {
  const {
    sharedDocuments,
    selectedDocument,
    setSelectedDocument,
    myStreak,
    cohortStreaks,
    updateStreakPrefs,
    successStories,
    cheerStory,
    questions,
    voteQuestion,
    answerQuestion,
    fetchSharedDocuments,
    fetchStreakData,
    fetchStories,
    fetchQuestions,
  } = useCommunityStore();

  const [activeTab, setActiveTab] = useState<CommunityTab>("peer_feedback");

  // Modals
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);

  // Filters
  const [docFilter, setDocFilter] = useState<"all" | "resume" | "cover_letter" | "mine">("all");
  const [docSearch, setDocSearch] = useState("");

  const [storyFilter, setStoryFilter] = useState<"all" | "offer" | "interview" | "milestone">("all");

  const [qaCategory, setQaCategory] = useState<string>("All");
  const [qaSearch, setQaSearch] = useState("");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchSharedDocuments();
    fetchStreakData();
    fetchStories();
    fetchQuestions();
  }, []);

  // Filtered documents
  const filteredDocs = sharedDocuments.filter((doc) => {
    if (docFilter === "mine" && doc.userId !== "user-current") return false;
    if (docFilter === "resume" && doc.documentType !== "resume") return false;
    if (docFilter === "cover_letter" && doc.documentType !== "cover_letter") return false;
    if (docSearch.trim()) {
      const q = docSearch.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.targetRole.toLowerCase().includes(q) ||
        (doc.targetCompany && doc.targetCompany.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered stories
  const filteredStories = successStories.filter((s) => {
    if (storyFilter !== "all" && s.storyType !== storyFilter) return false;
    return true;
  });

  // Filtered QA
  const filteredQuestions = questions.filter((q) => {
    if (qaCategory !== "All" && q.category !== qaCategory) return false;
    if (qaSearch.trim()) {
      const term = qaSearch.toLowerCase();
      return (
        q.title.toLowerCase().includes(term) ||
        q.body.toLowerCase().includes(term) ||
        q.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handleOpenDocReview = (doc: SharedDocumentItem) => {
    setSelectedDocument(doc);
    setIsReviewOpen(true);
  };

  const handlePostAnswer = async (questionId: string) => {
    if (!replyText.trim()) return;
    try {
      await answerQuestion(questionId, replyText.trim());
      setReplyText("");
      toast.success("Answer posted! +1 Streak activity logged 🔥");
    } catch {
      toast.error("Failed to post reply.");
    }
  };

  return (
    <div className="w-full max-w-[1750px] mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Users size={13} className="text-indigo-400" />
              Community & Peer Support
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              GetHired Job Seeker Community
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              You are never alone in your job search. Share drafts for peer feedback, stay accountable with streak cohorts, celebrate interview wins, and exchange career advice.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {activeTab === "peer_feedback" && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsShareOpen(true)}
                className="font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Plus size={16} />
                <span>Share Draft for Review</span>
              </Button>
            )}

            {activeTab === "success_stories" && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsStoryOpen(true)}
                className="font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
              >
                <PartyPopper size={16} />
                <span>Celebrate a Win 🎉</span>
              </Button>
            )}

            {activeTab === "qa" && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsQuestionOpen(true)}
                className="font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <HelpCircle size={16} />
                <span>Ask Question</span>
              </Button>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("peer_feedback")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === "peer_feedback"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <MessageSquareShare size={15} />
          <span>Peer Review & Feedback</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] ${
              activeTab === "peer_feedback"
                ? "bg-white/20 text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {sharedDocuments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("streaks")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === "streaks"
              ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <Flame size={15} />
          <span>Accountability Streaks</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] ${
              activeTab === "streaks"
                ? "bg-white/20 text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {myStreak.currentStreak}d 🔥
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("success_stories")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === "success_stories"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <PartyPopper size={15} />
          <span>Success Stories Wall</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] ${
              activeTab === "success_stories"
                ? "bg-white/20 text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {successStories.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("qa")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === "qa"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <HelpCircle size={15} />
          <span>Community Q&A</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] ${
              activeTab === "qa"
                ? "bg-white/20 text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {questions.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PEER REVIEW & FEEDBACK */}
      {/* ========================================================= */}
      {activeTab === "peer_feedback" && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setDocFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  docFilter === "all"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                All Drafts
              </button>
              <button
                type="button"
                onClick={() => setDocFilter("resume")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  docFilter === "resume"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Resumes
              </button>
              <button
                type="button"
                onClick={() => setDocFilter("cover_letter")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  docFilter === "cover_letter"
                    ? "bg-purple-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Cover Letters
              </button>
              <button
                type="button"
                onClick={() => setDocFilter("mine")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  docFilter === "mine"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                My Shared Drafts
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                placeholder="Search by role, company, title..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Document Cards Grid */}
          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center border border-blue-200/50">
                <FileText size={26} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  No feedback drafts found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Be the first to share your resume or cover letter draft to receive actionable feedback from peers!
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsShareOpen(true)}
                className="font-bold inline-flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Share a Draft Now</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocs.map((doc) => {
                const isMine = doc.userId === "user-current";
                return (
                  <div
                    key={doc._id}
                    onClick={() => handleOpenDocReview(doc)}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant={
                            doc.documentType === "resume" ? "primary" : "purple"
                          }
                          className="text-[10px] font-bold uppercase tracking-wider"
                        >
                          {doc.documentType === "resume" ? "Resume" : "Cover Letter"}
                        </Badge>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          {doc.visibility === "shared" ? (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <Globe size={11} />
                              Open
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-400 font-semibold">
                              <Lock size={11} />
                              Private
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-0.5">
                          <Briefcase size={12} className="text-slate-400 shrink-0" />
                          <span>
                            {doc.targetRole}
                            {doc.targetCompany ? ` @ ${doc.targetCompany}` : ""}
                          </span>
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed border border-slate-100 dark:border-slate-800">
                        {doc.content}
                      </div>

                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {doc.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {doc.authorName.charAt(0)}
                        </span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[100px]">
                          {isMine ? "You" : doc.authorName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                          <MessageSquareShare size={13} />
                          {doc.feedbackCount || doc.feedbackList.length} feedback
                        </span>
                        <ChevronRight
                          size={15}
                          className="text-slate-400 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PROGRESS & ACCOUNTABILITY STREAKS */}
      {/* ========================================================= */}
      {activeTab === "streaks" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Your Current Streak & Activity tracker */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Streak Flame Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white shadow-xl space-y-5 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
                      🔥 Daily Momentum
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black">
                      {myStreak.currentStreak} Day Streak!
                    </h2>
                    <p className="text-xs text-white/80 max-w-md">
                      Consistent daily action multiplies your chances of landing interviews. Keep the flame alive!
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                      Personal Best
                    </p>
                    <p className="text-2xl font-black">{myStreak.longestStreak} Days</p>
                  </div>
                </div>

                {/* 7-Day Visual Tracker */}
                <div className="relative z-10 pt-2">
                  <p className="text-xs font-bold mb-2.5 text-white/90">
                    This Week's Activity:
                  </p>
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, idx) => {
                        const isDone = idx < 4; // Visual representation
                        return (
                          <div
                            key={day}
                            className={`p-2.5 rounded-xl text-center space-y-1 border ${
                              isDone
                                ? "bg-white text-orange-600 border-white font-extrabold shadow-sm"
                                : "bg-white/10 text-white/70 border-white/10 font-medium"
                            }`}
                          >
                            <span className="text-[10px] block uppercase">
                              {day}
                            </span>
                            <div className="flex justify-center">
                              {isDone ? (
                                <Flame size={16} className="fill-orange-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-white/30" />
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Privacy & Opt-in settings */}
                <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-white/90">
                    <Shield size={14} />
                    Cohort Display: <strong>{myStreak.privacy === "named" ? "Named Profile" : myStreak.privacy === "anonymized" ? "Anonymous Seeker" : "Private (Hidden)"}</strong>
                  </span>

                  <div className="flex items-center gap-1 bg-white/20 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => updateStreakPrefs({ privacy: "named" })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        myStreak.privacy === "named"
                          ? "bg-white text-orange-600 shadow-xs"
                          : "text-white"
                      }`}
                    >
                      Named
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStreakPrefs({ privacy: "anonymized" })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        myStreak.privacy === "anonymized"
                          ? "bg-white text-orange-600 shadow-xs"
                          : "text-white"
                      }`}
                    >
                      Anonymized
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStreakPrefs({ privacy: "private" })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        myStreak.privacy === "private"
                          ? "bg-white text-orange-600 shadow-xs"
                          : "text-white"
                      }`}
                    >
                      Private
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp size={16} className="text-orange-500" />
                  Recent Accountability Activity
                </h3>

                <div className="space-y-3">
                  {myStreak.activities.map((act, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold shrink-0 border border-orange-200/40">
                          {act.type === "application_submitted" ? (
                            <Briefcase size={15} />
                          ) : act.type === "mock_interview" ? (
                            <Sparkles size={15} />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {act.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {act.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Community Cohort Leaderboard */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Award size={16} className="text-amber-500" />
                      Community Cohort Streaks
                    </h3>
                    <p className="text-xs text-slate-400">
                      Top active job seekers this month
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-200/40">
                    Live Cohort
                  </span>
                </div>

                <div className="space-y-2.5">
                  {cohortStreaks.map((member) => (
                    <div
                      key={member.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        member.isCurrentUser
                          ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 shadow-xs"
                          : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`h-6 w-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                            member.rank === 1
                              ? "bg-amber-400 text-amber-950 shadow-xs"
                              : member.rank === 2
                              ? "bg-slate-300 text-slate-900"
                              : member.rank === 3
                              ? "bg-amber-700 text-amber-100"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                          }`}
                        >
                          {member.rank}
                        </span>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                            <span>{member.displayName}</span>
                            {member.isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-[9px] font-extrabold uppercase">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Active {member.lastActiveDate}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs font-black text-orange-600 dark:text-orange-400">
                          <Flame size={13} className="fill-orange-500" />
                          {member.currentStreak} Days
                        </span>
                        <p className="text-[10px] text-slate-400">
                          PB: {member.longestStreak}d
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SUCCESS STORIES WALL */}
      {/* ========================================================= */}
      {activeTab === "success_stories" && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStoryFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  storyFilter === "all"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                All Wins 🎉
              </button>
              <button
                type="button"
                onClick={() => setStoryFilter("offer")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  storyFilter === "offer"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Offers 🏆
              </button>
              <button
                type="button"
                onClick={() => setStoryFilter("interview")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  storyFilter === "interview"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Interviews 🎯
              </button>
              <button
                type="button"
                onClick={() => setStoryFilter("milestone")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  storyFilter === "milestone"
                    ? "bg-amber-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Milestones 🚀
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsStoryOpen(true)}
              className="font-bold bg-emerald-600 hover:bg-emerald-500 shadow-sm"
            >
              <PartyPopper size={14} />
              <span>Share Your Win</span>
            </Button>
          </div>

          {/* Stories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStories.map((story) => {
              const hasCheered = story.congrats?.includes("user-current");
              return (
                <div
                  key={story._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border flex items-center gap-1 ${
                          story.storyType === "offer"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : story.storyType === "interview"
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {story.storyType === "offer" ? "🏆 Offer Landed" : story.storyType === "interview" ? "🎯 Interview Passed" : "🚀 Application Milestone"}
                      </span>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(story.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                        {story.role}
                      </h3>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        @ {story.company}
                      </p>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      "{story.story}"
                    </p>

                    {story.tips && (
                      <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
                        <strong className="text-[11px] uppercase tracking-wide flex items-center gap-1 text-amber-700 dark:text-amber-400">
                          <Sparkles size={11} /> Top Tip:
                        </strong>
                        <p className="text-[11px] italic font-medium">{story.tips}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      by {story.authorName}
                    </span>

                    <button
                      type="button"
                      onClick={() => cheerStory(story._id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer ${
                        hasCheered
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <PartyPopper size={14} />
                      <span>{story.congratsCount || 0} Congrats</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: COMMUNITY Q&A */}
      {/* ========================================================= */}
      {activeTab === "qa" && (
        <div className="space-y-5">
          {/* Q&A Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {["All", "Interview Prep", "Resume & ATS", "Job Search Strategy", "Salary & Offer"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setQaCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    qaCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={qaSearch}
                onChange={(e) => setQaSearch(e.target.value)}
                placeholder="Search questions or tags..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q._id;
              const hasUpvoted = q.upvotes?.includes("user-current");
              return (
                <div
                  key={q._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 min-w-0">
                      {/* Upvote Box */}
                      <button
                        type="button"
                        onClick={() => voteQuestion(q._id)}
                        className={`flex flex-col items-center justify-center h-12 w-11 rounded-xl border font-bold transition-all cursor-pointer shrink-0 ${
                          hasUpvoted
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <ThumbsUp size={13} className={hasUpvoted ? "fill-white" : ""} />
                        <span className="text-xs font-black">{q.upvoteCount || 0}</span>
                      </button>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200/40">
                            {q.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            Asked by <strong>{q.authorName}</strong>
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {q.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {q.body}
                        </p>

                        {q.tags && q.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                            {q.tags.map((t, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedQuestionId(isExpanded ? null : q._id)
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle size={13} />
                      <span>
                        {q.answersCount || q.answers.length} Answers
                      </span>
                    </button>
                  </div>

                  {/* Expanded Answers Thread */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 pl-0 sm:pl-14">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Answers & Advice ({q.answers.length})
                      </h4>

                      {q.answers.map((ans) => (
                        <div
                          key={ans._id}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {ans.authorName}
                            </span>
                            <span>
                              {new Date(ans.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {ans.body}
                          </p>
                        </div>
                      ))}

                      {/* Answer Input Form */}
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a helpful answer or tip..."
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                        <div className="flex justify-end">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handlePostAnswer(q._id)}
                            className="text-xs font-bold flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500"
                          >
                            <Send size={13} />
                            <span>Post Answer</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <PeerReviewModal
        document={selectedDocument}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />

      <ShareDocumentModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <CreateStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      <AskQuestionModal
        isOpen={isQuestionOpen}
        onClose={() => setIsQuestionOpen(false)}
      />
    </div>
  );
}
