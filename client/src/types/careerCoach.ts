export interface CareerHealthMetrics {
  overall: number;
  consistency: number;
  interviewPerf: number;
  resumeQuality: number;
  profileCompleteness: number;
  activityLevel: number;
}

export interface WeeklyReportMetrics {
  applicationsThisWeek: number;
  interviewsAttended: number;
  offersReceived: number;
  rejectionsCount: number;
  followUpsPending: number;
}

export interface CoachRecommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  category: string;
  priority: "High" | "Medium" | "Low" | "Tip";
}

export interface SkillGapData {
  currentSkills: string[];
  missingSkills: string[];
  requestedSkills: string[];
  learningPriority: string[];
}

export interface RoadmapItem {
  week: string;
  topic: string;
  description: string;
  resources: string[];
}

export interface CareerInsightsData {
  bestRole: string;
  bestLocation: string;
  bestDay: string;
  avgResponseDays: number;
  interviewConversionPct: number;
  offerConversionPct: number;
}

export interface CareerGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface CareerCoachResult {
  healthScore: CareerHealthMetrics;
  weeklyMetrics: WeeklyReportMetrics;
  recommendations: CoachRecommendation[];
  skillGap: SkillGapData;
  roadmap: RoadmapItem[];
  insights: CareerInsightsData;
  goals: CareerGoal[];
}

export interface CareerCoachResponse {
  success: boolean;
  message: string;
  data: CareerCoachResult;
}
