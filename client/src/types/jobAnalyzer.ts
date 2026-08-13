export type ApplicationRecommendation =
  | "Highly Recommended"
  | "Recommended"
  | "Apply with Resume Improvements"
  | "Not Recommended";

export type DifficultyLevel =
  "Entry Level" | "Moderate" | "Challenging" | "Expert Level";
export type WorkType = "Remote" | "Hybrid" | "Onsite";
export type RedFlagSeverity = "High" | "Medium" | "Low";

export interface RedFlagItem {
  issue: string;
  severity: RedFlagSeverity;
  description: string;
}

export interface SalaryInsightData {
  entryLevel: string;
  averageMarket: string;
  expectedRange: string;
  disclaimer: string;
}

export interface SkillGapData {
  currentSkills: string[];
  missingSkills: string[];
  prioritySkills: string[];
  suggestedOrder: string[];
}

export interface LearningResourceItem {
  title: string;
  type: string;
  url: string;
}

export interface JobAnalyzerResult {
  matchScore: number;
  recommendation: ApplicationRecommendation;
  recommendationReason: string;
  jobSummary: string;
  requiredSkills: string[];
  preferredSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  difficultyLevel: DifficultyLevel;
  experienceRequired: string;
  workType: WorkType;
  redFlags: RedFlagItem[];
  salaryInsight: SalaryInsightData;
  skillGap: SkillGapData;
  interviewTopics: string[];
  learningResources: LearningResourceItem[];
}

export interface JobAnalyzerRequest {
  jobTitle: string;
  company: string;
  jobDescription?: string;
  resumeText?: string;
}

export interface JobAnalyzerResponse {
  success: boolean;
  message: string;
  data: JobAnalyzerResult;
}

export interface SavedAnalysisHistory {
  id: string;
  jobTitle: string;
  company: string;
  timestamp: string;
  result: JobAnalyzerResult;
}
