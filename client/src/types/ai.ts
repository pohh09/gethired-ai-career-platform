export interface ResumeMatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  atsTips: string[];
  source?: "ai" | "fallback";
}

export interface ResumeMatchRequest {
  resumeText: string;
  jobDescription: string;
}

export interface ResumeMatchResponse {
  success: boolean;
  message: string;
  data: ResumeMatchResult;
}

export interface ResumeOptimizationResult {
  overallScore: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestedKeywords: string[];
  grammarImprovements: string[];
  actionVerbs: string[];
  projectImprovements: string[];
  technicalSkills: string[];
  softSkills: string[];
  improvedSummary: string;
  improvedProjects: string[];
  aiRecommendations: string[];
  source?: "ai" | "fallback";
}

export interface SectionImprovementResult {
  improvedContent: string;
  keyChanges: string[];
  score: number;
  source?: "ai" | "fallback";
}

export interface ResumeOptimizationRequest {
  resumeText: string;
  jobDescription?: string;
}

export interface ResumeOptimizationResponse {
  success: boolean;
  message: string;
  data: ResumeOptimizationResult;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidenceScore: number;
  impact: "high" | "medium" | "low";
  category: "Conversion" | "Location" | "Timing" | "Strategy" | "Velocity";
  recommendation: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  priority: "High" | "Medium" | "Low" | "Tip";
  impactEstimate: string;
  category: "Targeting" | "Follow-up" | "Preparation" | "Consistency";
}

export interface JobScoreFactor {
  label: string;
  score: number;
  passed: boolean;
}

export interface JobScore {
  jobId: string;
  company: string;
  role: string;
  overallScore: number;
  status: string;
  factors: JobScoreFactor[];
  verdict: "Strong Application" | "Moderate Match" | "Needs Optimization";
}

export interface ActivitySummaryMetrics {
  applicationsThisWeek: number;
  interviewsThisMonth: number;
  offersCount: number;
  avgResponseTimeDays: number;
  streakDays: number;
}
