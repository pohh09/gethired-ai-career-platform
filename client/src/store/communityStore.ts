import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SharedDocumentItem,
  UserStreakData,
  CohortMemberStreak,
  SuccessStoryItem,
  CommunityQuestionItem,
  DocumentSection,
} from "../types/community";
import { communityService } from "../services/communityService";

interface CommunityState {
  // Shared Documents & Peer Feedback
  sharedDocuments: SharedDocumentItem[];
  selectedDocument: SharedDocumentItem | null;
  isLoadingDocuments: boolean;

  // Streaks & Cohort
  myStreak: UserStreakData;
  cohortStreaks: CohortMemberStreak[];
  isLoadingStreaks: boolean;

  // Success Stories Feed
  successStories: SuccessStoryItem[];
  isLoadingStories: boolean;

  // Community Q&A
  questions: CommunityQuestionItem[];
  isLoadingQuestions: boolean;

  // Actions
  fetchSharedDocuments: () => Promise<void>;
  setSelectedDocument: (doc: SharedDocumentItem | null) => void;
  shareDocument: (data: {
    title: string;
    documentType: "resume" | "cover_letter" | "other";
    targetRole: string;
    targetCompany?: string;
    content: string;
    visibility?: "private" | "shared";
    tags?: string[];
  }) => Promise<void>;
  toggleDocVisibility: (id: string) => Promise<void>;
  addFeedbackToDoc: (
    id: string,
    comment: string,
    targetSection: DocumentSection
  ) => Promise<void>;
  toggleFeedbackVote: (docId: string, feedbackId: string) => Promise<void>;

  // Streak Actions
  fetchStreakData: () => Promise<void>;
  logActivity: (type: string, title: string) => Promise<void>;
  updateStreakPrefs: (prefs: {
    privacy?: "private" | "anonymized" | "named";
    targetWeeklyGoal?: number;
  }) => Promise<void>;

  // Story Actions
  fetchStories: () => Promise<void>;
  postStory: (data: {
    storyType: "offer" | "interview" | "milestone";
    company: string;
    role: string;
    story: string;
    tips?: string;
  }) => Promise<void>;
  cheerStory: (id: string) => Promise<void>;

  // Q&A Actions
  fetchQuestions: () => Promise<void>;
  askQuestion: (data: {
    title: string;
    body: string;
    category: string;
    tags?: string[];
  }) => Promise<void>;
  voteQuestion: (id: string) => Promise<void>;
  answerQuestion: (id: string, body: string) => Promise<void>;
}

const INITIAL_SHARED_DOCS: SharedDocumentItem[] = [
  {
    _id: "sdoc-1",
    userId: "user-101",
    authorName: "Sarah Jenkins",
    title: "Senior Product Designer Portfolio & Resume Draft",
    documentType: "resume",
    targetRole: "Lead Product Designer",
    targetCompany: "Figma",
    content: `SARAH JENKINS — LEAD PRODUCT DESIGNER
San Francisco, CA | sarah.j.design@email.com | sarahj.design

SUMMARY:
Staff-level Product Designer with 7+ years designing enterprise collaboration systems, design tokens, and AI-assisted workflows. Looking for feedback on quantifying design system adoption metrics in my Experience section!

EXPERIENCE:
Senior Product Designer | CloudScale Labs (2022 - Present)
• Led end-to-end UX architecture for multi-tenant analytics dashboard serving 180K weekly active designers.
• Built unified design tokens across React, iOS, and Android platforms, cutting frontend handoff discrepancies by 35%.
• Mentored 4 junior and mid-level designers on atomic design tokens and accessibility guidelines.

Product Designer | Nexus Apps (2019 - 2022)
• Redesigned onboarding funnel resulting in a 24% boost in day-30 user retention.
• Conducted 45+ usability interviews and synthesized user research into quarterly product roadmaps.

SKILLS:
Figma, Design Systems, Typography, WCAG 2.1 AA Accessibility, User Research, Prototyping, Tailwind CSS basics.`,
    visibility: "shared",
    tags: ["Product Design", "Design Systems", "Figma", "ATS Ready"],
    feedbackList: [
      {
        _id: "fb-1",
        authorId: "user-202",
        authorName: "Michael Chen (Hiring Mgr)",
        comment:
          "Great experience section! In your first bullet point, try explicitly mentioning how you measured user engagement beyond active users (e.g. task completion speed or CSAT score).",
        targetSection: "Work Experience",
        upvotes: ["user-current", "user-303"],
        upvoteCount: 5,
        createdAt: "2026-08-19T10:15:00Z",
      },
      {
        _id: "fb-2",
        authorId: "user-303",
        authorName: "Elena Rostova",
        comment:
          "The summary is super clear! You might want to bold key keywords like 'Enterprise Collaboration' so it passes fast 6-second recruiter scans.",
        targetSection: "Summary / Intro",
        upvotes: ["user-current"],
        upvoteCount: 3,
        createdAt: "2026-08-19T11:40:00Z",
      },
    ],
    feedbackCount: 2,
    createdAt: "2026-08-18T14:30:00Z",
    updatedAt: "2026-08-19T11:40:00Z",
  },
  {
    _id: "sdoc-2",
    userId: "user-102",
    authorName: "David Miller",
    title: "Cover Letter - Full Stack Engineer at Stripe",
    documentType: "cover_letter",
    targetRole: "Full Stack Software Engineer",
    targetCompany: "Stripe",
    content: `Dear Stripe Engineering Hiring Team,

I am writing to express my enthusiasm for the Full Stack Software Engineer position on the Billing & Subscriptions team. Having followed Stripe's API design principles and developer docs for years, I have always admired your dedication to Developer Experience and ultra-reliable financial infrastructure.

At my previous company, I spearheaded the migration of our recurring billing system to handle idempotent Webhooks and zero-downtime database migrations, cutting billing reconciliation errors by 94%.

I would be thrilled to bring my passion for resilient microservices and crisp TypeScript interfaces to Stripe.

Thank you for your time and consideration.

Sincerely,
David Miller`,
    visibility: "shared",
    tags: ["Stripe", "FinTech", "TypeScript", "Backend"],
    feedbackList: [
      {
        _id: "fb-3",
        authorId: "user-404",
        authorName: "Priya Sharma",
        comment:
          "Very punchy opening paragraph! The 94% reconciliation metric is gold. Consider adding one sentence about why Stripe's billing challenge specifically excites you over other fintechs.",
        targetSection: "General",
        upvotes: ["user-current"],
        upvoteCount: 4,
        createdAt: "2026-08-19T16:20:00Z",
      },
    ],
    feedbackCount: 1,
    createdAt: "2026-08-19T09:00:00Z",
    updatedAt: "2026-08-19T16:20:00Z",
  },
  {
    _id: "sdoc-3",
    userId: "user-103",
    authorName: "Marcus Vance",
    title: "AI Engineer / LLM Practitioner Resume",
    documentType: "resume",
    targetRole: "Applied AI Engineer",
    targetCompany: "Anthropic",
    content: `MARCUS VANCE
marcus.vance@ai-dev.io | San Francisco, CA

PROFESSIONAL PROFILE:
Applied AI Engineer specializing in RAG architectures, prompt evaluation harnesses, and low-latency inference pipelines with LangChain, LlamaIndex, and vLLM.

PROJECTS & EXPERIENCE:
Staff AI Architect | Synapse AI (2023 - Present)
• Built enterprise RAG search pipeline indexing 5M+ vector embeddings with Qdrant and hybrid BM25 search.
• Reduced hallucination rate from 14% to 1.8% using multi-step critique agent evaluation.
• Deployed quantized models reducing GPU hosting expenditure by $18,000/month.`,
    visibility: "shared",
    tags: ["AI/ML", "LLM", "RAG", "Python"],
    feedbackList: [],
    feedbackCount: 0,
    createdAt: "2026-08-20T08:10:00Z",
    updatedAt: "2026-08-20T08:10:00Z",
  },
];

const INITIAL_STREAK: UserStreakData = {
  userId: "user-current",
  displayName: "You",
  currentStreak: 4,
  longestStreak: 12,
  lastActiveDate: new Date().toISOString().split("T")[0],
  activeDates: [
    new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    new Date().toISOString().split("T")[0],
  ],
  privacy: "named",
  targetWeeklyGoal: 5,
  activities: [
    {
      type: "application_submitted",
      title: "Submitted application to Stripe (Senior Frontend)",
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
    },
    {
      type: "mock_interview",
      title: "Completed AI Mock Interview: System Design",
      date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      type: "resume_updated",
      title: "Optimized Resume bullet points for ATS match",
      date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      type: "feedback_given",
      title: "Gave peer feedback on Sarah's UX Resume",
      date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ],
};

const INITIAL_COHORT: CohortMemberStreak[] = [
  {
    rank: 1,
    id: "c-1",
    displayName: "Elena Rostova",
    currentStreak: 21,
    longestStreak: 28,
    activeDaysCount: 21,
    lastActiveDate: "Today",
    isCurrentUser: false,
  },
  {
    rank: 2,
    id: "c-2",
    displayName: "Anonymous Seeker #8492",
    currentStreak: 16,
    longestStreak: 16,
    activeDaysCount: 16,
    lastActiveDate: "Today",
    isCurrentUser: false,
  },
  {
    rank: 3,
    id: "c-3",
    displayName: "Priya Sharma",
    currentStreak: 9,
    longestStreak: 14,
    activeDaysCount: 9,
    lastActiveDate: "Today",
    isCurrentUser: false,
  },
  {
    rank: 4,
    id: "c-4",
    displayName: "You",
    currentStreak: 4,
    longestStreak: 12,
    activeDaysCount: 4,
    lastActiveDate: "Today",
    isCurrentUser: true,
  },
  {
    rank: 5,
    id: "c-5",
    displayName: "Marcus Vance",
    currentStreak: 3,
    longestStreak: 8,
    activeDaysCount: 3,
    lastActiveDate: "Yesterday",
    isCurrentUser: false,
  },
];

const INITIAL_STORIES: SuccessStoryItem[] = [
  {
    _id: "story-1",
    userId: "user-201",
    authorName: "Jessica Wong",
    storyType: "offer",
    company: "Airbnb",
    role: "Senior Frontend Engineer",
    story:
      "After 4 months of grinding applications and practicing on GetHired mock interviews, I just signed my offer letter with Airbnb! Don't lose hope even if you get ghosted — consistency always compounds.",
    tips: "Focus heavily on real-time state management and accessibility during mock interviews.",
    congrats: ["user-current", "u-1", "u-2", "u-3", "u-4"],
    congratsCount: 24,
    createdAt: "2026-08-19T18:00:00Z",
  },
  {
    _id: "story-2",
    userId: "user-202",
    authorName: "Liam O'Connor",
    storyType: "interview",
    company: "Datadog",
    role: "Full Stack Engineer",
    story:
      "Just passed the final round system design interview with Datadog! The ATS resume keyword suggestions from GetHired directly helped me get through the initial recruiter screen.",
    tips: "Always tailor the top 3 bullet points of your resume to the exact tech stack in the job description.",
    congrats: ["user-current", "u-5", "u-6"],
    congratsCount: 18,
    createdAt: "2026-08-20T06:30:00Z",
  },
  {
    _id: "story-3",
    userId: "user-203",
    authorName: "Anonymous Seeker #4910",
    storyType: "milestone",
    company: "Spotify",
    role: "Backend Platform Engineer",
    story:
      "Reached 50 customized applications and landed 6 first-round technical phone screens this month. Staying accountable with the streak counter kept me focused every single day.",
    tips: "Set a realistic daily goal (2 tailored applications > 10 generic ones).",
    congrats: ["user-current"],
    congratsCount: 11,
    createdAt: "2026-08-20T09:15:00Z",
  },
];

const INITIAL_QUESTIONS: CommunityQuestionItem[] = [
  {
    _id: "qa-1",
    userId: "user-301",
    authorName: "Alex Rivera",
    title: "How should I structure the 'Tell me about a time you had a technical disagreement' answer?",
    body: "I struggle with behavioral questions about conflict without sounding defensive or throwing previous teammates under the bus. Any proven STAR frameworks?",
    category: "Interview Prep",
    tags: ["Behavioral", "STAR Method", "Culture Fit"],
    upvotes: ["user-current", "u-1", "u-2"],
    upvoteCount: 14,
    answers: [
      {
        _id: "ans-1",
        userId: "user-302",
        authorName: "Rachel Kim (Engineering Lead)",
        body: "Frame the conflict around the data and trade-offs rather than opinions. E.g. 'We disagreed on whether to use GraphQL vs REST; I proposed running a benchmark spike with 3 core queries, and we jointly presented the latency data to pick REST.' Highlight shared company goals!",
        upvotes: ["user-current"],
        upvoteCount: 8,
        isHelpful: true,
        createdAt: "2026-08-19T14:20:00Z",
      },
    ],
    answersCount: 1,
    createdAt: "2026-08-19T12:00:00Z",
  },
  {
    _id: "qa-2",
    userId: "user-304",
    authorName: "Tyler Bennett",
    title: "Is it better to keep resumes strictly 1 page for 5+ years of experience?",
    body: "Recruiters seem split on this. Should I cut out early junior projects to stay on one page, or keep 2 pages with detailed achievements?",
    category: "Resume & ATS",
    tags: ["Resume Length", "ATS Advice", "Senior Roles"],
    upvotes: ["user-current", "u-4"],
    upvoteCount: 9,
    answers: [
      {
        _id: "ans-2",
        userId: "user-305",
        authorName: "Devon Vance",
        body: "For 5+ years, a dense 2-page resume is completely standard in tech IF both pages contain high-impact metrics. Never leave just 2-3 orphan lines on page 2 though!",
        upvotes: [],
        upvoteCount: 4,
        isHelpful: false,
        createdAt: "2026-08-19T19:00:00Z",
      },
    ],
    answersCount: 1,
    createdAt: "2026-08-19T15:30:00Z",
  },
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      sharedDocuments: INITIAL_SHARED_DOCS,
      selectedDocument: INITIAL_SHARED_DOCS[0],
      isLoadingDocuments: false,

      myStreak: INITIAL_STREAK,
      cohortStreaks: INITIAL_COHORT,
      isLoadingStreaks: false,

      successStories: INITIAL_STORIES,
      isLoadingStories: false,

      questions: INITIAL_QUESTIONS,
      isLoadingQuestions: false,

      fetchSharedDocuments: async () => {
        set({ isLoadingDocuments: true });
        try {
          const res = await communityService.getSharedDocuments();
          if (res?.data && res.data.length > 0) {
            set({ sharedDocuments: res.data });
          }
        } catch {
          // Keep persistent local state
        } finally {
          set({ isLoadingDocuments: false });
        }
      },

      setSelectedDocument: (doc) => set({ selectedDocument: doc }),

      shareDocument: async (data) => {
        const newDoc: SharedDocumentItem = {
          _id: `sdoc-${Date.now()}`,
          userId: "user-current",
          authorName: "You",
          title: data.title,
          documentType: data.documentType,
          targetRole: data.targetRole,
          targetCompany: data.targetCompany || "",
          content: data.content,
          visibility: data.visibility || "shared",
          tags: data.tags || ["Peer Review"],
          feedbackList: [],
          feedbackCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          sharedDocuments: [newDoc, ...state.sharedDocuments],
          selectedDocument: newDoc,
        }));

        try {
          await communityService.createSharedDocument(data);
        } catch {
          // Offline fallback
        }

        // Award streak activity
        await get().logActivity("resume_updated", `Shared draft "${data.title}" for feedback`);
      },

      toggleDocVisibility: async (id) => {
        set((state) => ({
          sharedDocuments: state.sharedDocuments.map((d) =>
            d._id === id
              ? {
                  ...d,
                  visibility: d.visibility === "shared" ? "private" : "shared",
                }
              : d
          ),
          selectedDocument:
            state.selectedDocument?._id === id
              ? {
                  ...state.selectedDocument,
                  visibility:
                    state.selectedDocument.visibility === "shared"
                      ? "private"
                      : "shared",
                }
              : state.selectedDocument,
        }));

        try {
          await communityService.toggleDocumentVisibility(id);
        } catch {
          // fallback
        }
      },

      addFeedbackToDoc: async (id, comment, targetSection) => {
        const newFb = {
          _id: `fb-${Date.now()}`,
          authorId: "user-current",
          authorName: "You",
          comment,
          targetSection,
          upvotes: ["user-current"],
          upvoteCount: 1,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const updatedDocs = state.sharedDocuments.map((doc) => {
            if (doc._id === id) {
              const updatedList = [newFb, ...doc.feedbackList];
              return {
                ...doc,
                feedbackList: updatedList,
                feedbackCount: updatedList.length,
              };
            }
            return doc;
          });

          const currentSelected =
            state.selectedDocument?._id === id
              ? updatedDocs.find((d) => d._id === id) || null
              : state.selectedDocument;

          return {
            sharedDocuments: updatedDocs,
            selectedDocument: currentSelected,
          };
        });

        try {
          await communityService.addFeedback(id, { comment, targetSection });
        } catch {
          // offline fallback
        }

        await get().logActivity("feedback_given", "Gave peer feedback on a shared draft");
      },

      toggleFeedbackVote: async (docId, feedbackId) => {
        set((state) => {
          const updatedDocs = state.sharedDocuments.map((doc) => {
            if (doc._id === docId) {
              const updatedList = doc.feedbackList.map((fb) => {
                if (fb._id === feedbackId) {
                  const hasVoted = fb.upvotes.includes("user-current");
                  const upvotes = hasVoted
                    ? fb.upvotes.filter((u) => u !== "user-current")
                    : [...fb.upvotes, "user-current"];
                  return {
                    ...fb,
                    upvotes,
                    upvoteCount: upvotes.length,
                  };
                }
                return fb;
              });
              // Sort comments so highest voted appear first
              updatedList.sort((a, b) => b.upvoteCount - a.upvoteCount);
              return { ...doc, feedbackList: updatedList };
            }
            return doc;
          });

          const currentSelected =
            state.selectedDocument?._id === docId
              ? updatedDocs.find((d) => d._id === docId) || null
              : state.selectedDocument;

          return {
            sharedDocuments: updatedDocs,
            selectedDocument: currentSelected,
          };
        });

        try {
          await communityService.toggleFeedbackUpvote(docId, feedbackId);
        } catch {
          // offline fallback
        }
      },

      // Streaks
      fetchStreakData: async () => {
        set({ isLoadingStreaks: true });
        try {
          const [myRes, cohortRes] = await Promise.all([
            communityService.getMyStreak(),
            communityService.getCohortStreaks(),
          ]);
          if (myRes?.data) set({ myStreak: myRes.data });
          if (cohortRes?.data && cohortRes.data.length > 0)
            set({ cohortStreaks: cohortRes.data });
        } catch {
          // keep local
        } finally {
          set({ isLoadingStreaks: false });
        }
      },

      logActivity: async (type, title) => {
        const today = new Date().toISOString().split("T")[0];

        set((state) => {
          const currentStreakData = { ...state.myStreak };
          const lastActive = currentStreakData.lastActiveDate;

          if (lastActive !== today) {
            const yesterday = new Date(Date.now() - 86400000)
              .toISOString()
              .split("T")[0];
            if (lastActive === yesterday) {
              currentStreakData.currentStreak += 1;
              if (
                currentStreakData.currentStreak >
                currentStreakData.longestStreak
              ) {
                currentStreakData.longestStreak =
                  currentStreakData.currentStreak;
              }
            } else {
              currentStreakData.currentStreak = 1;
            }
            currentStreakData.lastActiveDate = today;
            if (!currentStreakData.activeDates.includes(today)) {
              currentStreakData.activeDates = [
                ...currentStreakData.activeDates,
                today,
              ];
            }
          }

          const newAct = {
            type: type as any,
            title,
            date: today,
            timestamp: new Date().toISOString(),
          };

          currentStreakData.activities = [
            newAct,
            ...currentStreakData.activities.slice(0, 29),
          ];

          // Update cohort list as well
          const updatedCohort = state.cohortStreaks.map((c) =>
            c.isCurrentUser
              ? {
                  ...c,
                  currentStreak: currentStreakData.currentStreak,
                  longestStreak: currentStreakData.longestStreak,
                  activeDaysCount: currentStreakData.activeDates.length,
                }
              : c
          );
          updatedCohort.sort((a, b) => b.currentStreak - a.currentStreak);
          const rankedCohort = updatedCohort.map((c, i) => ({
            ...c,
            rank: i + 1,
          }));

          return { myStreak: currentStreakData, cohortStreaks: rankedCohort };
        });

        try {
          await communityService.logActivity({ type, title });
        } catch {
          // offline fallback
        }
      },

      updateStreakPrefs: async (prefs) => {
        set((state) => {
          const updated = { ...state.myStreak, ...prefs };
          const updatedCohort = state.cohortStreaks.map((c) => {
            if (c.isCurrentUser) {
              return {
                ...c,
                displayName:
                  prefs.privacy === "anonymized"
                    ? "Anonymous Seeker #YOU"
                    : "You",
              };
            }
            return c;
          });
          return { myStreak: updated, cohortStreaks: updatedCohort };
        });

        try {
          await communityService.updateStreakPreferences(prefs);
        } catch {
          // offline fallback
        }
      },

      // Stories
      fetchStories: async () => {
        set({ isLoadingStories: true });
        try {
          const res = await communityService.getSuccessStories();
          if (res?.data && res.data.length > 0) {
            set({ successStories: res.data });
          }
        } catch {
          // keep local
        } finally {
          set({ isLoadingStories: false });
        }
      },

      postStory: async (data) => {
        const newStory: SuccessStoryItem = {
          _id: `story-${Date.now()}`,
          userId: "user-current",
          authorName: "You",
          storyType: data.storyType,
          company: data.company,
          role: data.role,
          story: data.story,
          tips: data.tips || "",
          congrats: ["user-current"],
          congratsCount: 1,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          successStories: [newStory, ...state.successStories],
        }));

        try {
          await communityService.createSuccessStory(data);
        } catch {
          // offline fallback
        }

        await get().logActivity(
          "application_submitted",
          `Posted celebration milestone at ${data.company}`
        );
      },

      cheerStory: async (id) => {
        set((state) => ({
          successStories: state.successStories.map((story) => {
            if (story._id === id) {
              const alreadyCheered = story.congrats.includes("user-current");
              const congrats = alreadyCheered
                ? story.congrats.filter((u) => u !== "user-current")
                : [...story.congrats, "user-current"];
              return {
                ...story,
                congrats,
                congratsCount: congrats.length,
              };
            }
            return story;
          }),
        }));

        try {
          await communityService.toggleCongrats(id);
        } catch {
          // offline fallback
        }
      },

      // Q&A
      fetchQuestions: async () => {
        set({ isLoadingQuestions: true });
        try {
          const res = await communityService.getQuestions();
          if (res?.data && res.data.length > 0) {
            set({ questions: res.data });
          }
        } catch {
          // keep local
        } finally {
          set({ isLoadingQuestions: false });
        }
      },

      askQuestion: async (data) => {
        const newQ: CommunityQuestionItem = {
          _id: `qa-${Date.now()}`,
          userId: "user-current",
          authorName: "You",
          title: data.title,
          body: data.body,
          category: data.category as any,
          tags: data.tags || ["Career"],
          upvotes: ["user-current"],
          upvoteCount: 1,
          answers: [],
          answersCount: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          questions: [newQ, ...state.questions],
        }));

        try {
          await communityService.createQuestion(data);
        } catch {
          // offline fallback
        }

        await get().logActivity("mock_interview", `Asked Q&A: "${data.title}"`);
      },

      voteQuestion: async (id) => {
        set((state) => ({
          questions: state.questions.map((q) => {
            if (q._id === id) {
              const hasVoted = q.upvotes.includes("user-current");
              const upvotes = hasVoted
                ? q.upvotes.filter((u) => u !== "user-current")
                : [...q.upvotes, "user-current"];
              return {
                ...q,
                upvotes,
                upvoteCount: upvotes.length,
              };
            }
            return q;
          }),
        }));

        try {
          await communityService.toggleQuestionUpvote(id);
        } catch {
          // offline fallback
        }
      },

      answerQuestion: async (id, body) => {
        const newAns = {
          _id: `ans-${Date.now()}`,
          userId: "user-current",
          authorName: "You",
          body,
          upvotes: ["user-current"],
          upvoteCount: 1,
          isHelpful: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          questions: state.questions.map((q) => {
            if (q._id === id) {
              const updatedAnswers = [...q.answers, newAns];
              return {
                ...q,
                answers: updatedAnswers,
                answersCount: updatedAnswers.length,
              };
            }
            return q;
          }),
        }));

        try {
          await communityService.addAnswer(id, { body });
        } catch {
          // offline fallback
        }

        await get().logActivity("feedback_given", "Answered community career question");
      },
    }),
    {
      name: "gethired_community_store_v1",
    }
  )
);
