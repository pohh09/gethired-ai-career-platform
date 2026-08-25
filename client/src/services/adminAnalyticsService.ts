import api from "./api";
import type {
  OverviewMetrics,
  UserAnalyticsResponse,
  LoginAnalyticsResponse,
  FeatureRankingItem,
  AIAnalyticsResponse,
  JobAnalyticsResponse,
  ResumeAnalyticsResponse,
  FeedbackAnalyticsResponse,
  UserDetailResponse,
} from "../types/adminAnalytics";

export const adminAnalyticsService = {
  // 1. Overview KPIs
  async getOverview(): Promise<OverviewMetrics> {
    const res = await api.get("/admin/analytics/overview");
    return res.data.data;
  },

  // 2. User Registrations & Table
  async getUserAnalytics(params?: {
    range?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filterRole?: string;
  }): Promise<UserAnalyticsResponse> {
    const res = await api.get("/admin/analytics/users", { params });
    return res.data.data;
  },

  // 3. Login Analytics
  async getLoginAnalytics(params?: {
    range?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<LoginAnalyticsResponse> {
    const res = await api.get("/admin/analytics/logins", { params });
    return res.data.data;
  },

  // 4. Feature Rankings
  async getFeatureAnalytics(): Promise<{ rankings: FeatureRankingItem[] }> {
    const res = await api.get("/admin/analytics/features");
    return res.data.data;
  },

  // 5. AI Usage
  async getAIAnalytics(): Promise<AIAnalyticsResponse> {
    const res = await api.get("/admin/analytics/ai");
    return res.data.data;
  },

  // 6. Jobs & Applications
  async getJobAnalytics(): Promise<JobAnalyticsResponse> {
    const res = await api.get("/admin/analytics/jobs");
    return res.data.data;
  },

  // 7. Resume Analytics
  async getResumeAnalytics(): Promise<ResumeAnalyticsResponse> {
    const res = await api.get("/admin/analytics/resumes");
    return res.data.data;
  },

  // 8. Feedback Analytics
  async getFeedbackAnalytics(): Promise<FeedbackAnalyticsResponse> {
    const res = await api.get("/admin/analytics/feedback");
    return res.data.data;
  },

  // 9. User Detail View
  async getUserDetail(id: string): Promise<UserDetailResponse> {
    const res = await api.get(`/admin/analytics/users/${id}`);
    return res.data.data;
  },
};

export default adminAnalyticsService;
