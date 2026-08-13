export type AIModuleId = "resume" | "jobs" | "interview" | "career";

export type AICategory = "Resume" | "Jobs" | "Interview" | "Career";

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: AICategory;
  moduleId: AIModuleId;
  iconName: string;
  route?: string;
  badge?: string;
  isFavorite?: boolean;
  isFuture?: boolean;
  inputPlaceholders?: {
    primaryLabel?: string;
    primaryPlaceholder?: string;
    secondaryLabel?: string;
    secondaryPlaceholder?: string;
  };
}

export interface AIModuleCategory {
  id: AIModuleId;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badge?: string;
  color: string;
  gradient: string;
  tools: AITool[];
  suggestedActions: { label: string; toolId: string }[];
}

export interface AIChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedToolId?: string;
  suggestedToolName?: string;
  actionLabel?: string;
}

export interface AIActivityItem {
  id: string;
  title: string;
  type: AICategory;
  date: string;
  timeAgo: string;
  score?: number;
  summary: string;
  targetToolId: string;
  tags?: string[];
  details?: {
    strengths?: string[];
    recommendation?: string;
    metrics?: Record<string, string | number>;
  };
}

export interface AIQuickStatsData {
  analysesPerformed: number;
  resumeScore: number;
  jobMatchScore: number;
  interviewReadiness: number;
  careerHealthScore: number;
}

export interface AIUsageAnalyticsData {
  totalRequests: number;
  mostUsedFeature: string;
  avgResumeScore: number;
  avgMatchScore: number;
  monthlyTrend: { month: string; requests: number; score: number }[];
  categoryDistribution: { name: string; value: number; color: string }[];
}
