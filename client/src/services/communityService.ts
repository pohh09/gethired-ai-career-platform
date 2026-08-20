import api from "./api";
import type {
  SharedDocumentItem,
  UserStreakData,
  CohortMemberStreak,
  SuccessStoryItem,
  CommunityQuestionItem,
  DocumentSection,
} from "../types/community";

export const communityService = {
  // Shared Documents & Peer Feedback
  async getSharedDocuments(params?: { type?: string; filter?: string; search?: string }) {
    const res = await api.get<{ success: boolean; data: SharedDocumentItem[] }>("/community/documents", { params });
    return res.data;
  },

  async getSharedDocumentById(id: string) {
    const res = await api.get<{ success: boolean; data: SharedDocumentItem }>(`/community/documents/${id}`);
    return res.data;
  },

  async createSharedDocument(data: {
    title: string;
    documentType: "resume" | "cover_letter" | "other";
    targetRole: string;
    targetCompany?: string;
    content: string;
    visibility?: "private" | "shared";
    tags?: string[];
  }) {
    const res = await api.post<{ success: boolean; message: string; data: SharedDocumentItem }>("/community/documents", data);
    return res.data;
  },

  async toggleDocumentVisibility(id: string) {
    const res = await api.patch<{ success: boolean; message: string; data: SharedDocumentItem }>(`/community/documents/${id}/visibility`);
    return res.data;
  },

  async addFeedback(id: string, data: { comment: string; targetSection: DocumentSection }) {
    const res = await api.post<{ success: boolean; message: string; data: SharedDocumentItem }>(`/community/documents/${id}/feedback`, data);
    return res.data;
  },

  async toggleFeedbackUpvote(id: string, feedbackId: string) {
    const res = await api.post<{ success: boolean; message: string; data: SharedDocumentItem }>(`/community/documents/${id}/feedback/${feedbackId}/upvote`);
    return res.data;
  },

  // Streaks & Cohorts
  async getMyStreak() {
    const res = await api.get<{ success: boolean; data: UserStreakData }>("/community/streaks/me");
    return res.data;
  },

  async logActivity(data: { type: string; title: string }) {
    const res = await api.post<{ success: boolean; message: string; data: UserStreakData }>("/community/streaks/activity", data);
    return res.data;
  },

  async getCohortStreaks() {
    const res = await api.get<{ success: boolean; data: CohortMemberStreak[] }>("/community/streaks/cohort");
    return res.data;
  },

  async updateStreakPreferences(data: { privacy?: "private" | "anonymized" | "named"; targetWeeklyGoal?: number }) {
    const res = await api.patch<{ success: boolean; message: string; data: UserStreakData }>("/community/streaks/preferences", data);
    return res.data;
  },

  // Success Stories
  async getSuccessStories(params?: { type?: string }) {
    const res = await api.get<{ success: boolean; data: SuccessStoryItem[] }>("/community/stories", { params });
    return res.data;
  },

  async createSuccessStory(data: {
    storyType: "offer" | "interview" | "milestone";
    company: string;
    role: string;
    story: string;
    tips?: string;
  }) {
    const res = await api.post<{ success: boolean; message: string; data: SuccessStoryItem }>("/community/stories", data);
    return res.data;
  },

  async toggleCongrats(id: string) {
    const res = await api.post<{ success: boolean; message: string; data: SuccessStoryItem }>(`/community/stories/${id}/congrats`);
    return res.data;
  },

  // Community Q&A
  async getQuestions(params?: { category?: string; search?: string }) {
    const res = await api.get<{ success: boolean; data: CommunityQuestionItem[] }>("/community/qa", { params });
    return res.data;
  },

  async createQuestion(data: {
    title: string;
    body: string;
    category: string;
    tags?: string[];
  }) {
    const res = await api.post<{ success: boolean; message: string; data: CommunityQuestionItem }>("/community/qa", data);
    return res.data;
  },

  async toggleQuestionUpvote(id: string) {
    const res = await api.post<{ success: boolean; message: string; data: CommunityQuestionItem }>(`/community/qa/${id}/upvote`);
    return res.data;
  },

  async addAnswer(id: string, data: { body: string }) {
    const res = await api.post<{ success: boolean; message: string; data: CommunityQuestionItem }>(`/community/qa/${id}/answers`, data);
    return res.data;
  },
};
