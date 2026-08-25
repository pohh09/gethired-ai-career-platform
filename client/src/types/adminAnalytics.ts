export interface OverviewMetrics {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  logins: {
    total: number;
    uniqueUsers: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  activeUsers: {
    dau: number;
    wau: number;
    mau: number;
  };
  applications: {
    total: number;
    saved: number;
  };
  resumes: {
    totalUploads: number;
  };
  ai: {
    totalFeatureUses: number;
  };
  feedback: {
    totalSubmissions: number;
  };
  lastUpdated: string;
}

export interface RegistrationTrendItem {
  date: string;
  count: number;
  cumulative: number;
}

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role: "user" | "admin" | string;
  createdAt: string;
  lastLoginAt: string;
  lastLogoutAt?: string | null;
  loginCount: number;
  lastActiveAt: string;
  isOnline?: boolean;
  sessionStatus?: "online" | "logged_in" | "logged_out" | "offline" | string;
  sessionLabel?: string;
  applicationCount: number;
  aiUsageCount: number;
}

export interface UserAnalyticsResponse {
  trend: RegistrationTrendItem[];
  growthPercentage: number;
  currentPeriodCount: number;
  prevPeriodCount: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  users: AdminUserListItem[];
}

export interface LoginAnalyticsResponse {
  totalLogins: number;
  uniqueUsers: number;
  loginsToday: number;
  loginsThisWeek: number;
  loginsThisMonth: number;
  returningUsersRate: number;
  returningUsersCount: number;
  dailyTrend: Array<{
    date: string;
    totalLogins: number;
    uniqueUsers: number;
  }>;
}

export interface FeatureRankingItem {
  eventType: string;
  name: string;
  category: string;
  usageCount: number;
  uniqueUsers: number;
}

export interface AIAnalyticsResponse {
  totalAIRequests: number;
  uniqueAIUsers: number;
  mostUsedAIFeature: string;
  byFeature: Array<{
    featureKey: string;
    name: string;
    count: number;
    percentage: number;
  }>;
  dailyTrend: Array<{
    date: string;
    count: number;
  }>;
}

export interface JobAnalyticsResponse {
  totalSearches: number;
  totalApplications: number;
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
  priorityDistribution: Array<{
    priority: string;
    count: number;
  }>;
  topCompanies: Array<{
    company: string;
    count: number;
  }>;
}

export interface ResumeAnalyticsResponse {
  totalUploads: number;
  uniqueUploaders: number;
  analysisCount: number;
  generatorUsage: number;
  activityOverTime: Array<{
    date: string;
    uploads: number;
    analyses: number;
    generations: number;
  }>;
}

export interface FeedbackAnalyticsResponse {
  total: number;
  byType: Array<{
    type: string;
    count: number;
  }>;
  deliveredToAdminCount: number;
  recent: Array<{
    id: string;
    authorName: string;
    email: string;
    type: string;
    message: string;
    pageUrl: string;
    emailSent: boolean;
    deliveryStatus?: "delivered" | "failed" | "logged";
    emailError?: string | null;
    emailProvider?: string | null;
    deliveredAt?: string | null;
    createdAt: string;
  }>;
  trend: Array<{
    date: string;
    count: number;
  }>;
}

export interface UserDetailResponse {
  user: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    role: string;
    createdAt: string;
    lastLoginAt: string;
    lastLogoutAt?: string | null;
    loginCount: number;
    lastActiveAt: string;
    isOnline?: boolean;
    sessionStatus?: string;
    sessionLabel?: string;
  };
  metrics: {
    totalApplications: number;
    statusBreakdown: Array<{
      status: string;
      count: number;
    }>;
    totalAIEvents: number;
    totalFeedbackSubmitted: number;
  };
  sessionHistory?: Array<{
    eventType: string;
    timestamp: string;
    summary: string;
  }>;
  recentActivity: Array<{
    eventType: string;
    timestamp: string;
    summary: string;
  }>;
}
