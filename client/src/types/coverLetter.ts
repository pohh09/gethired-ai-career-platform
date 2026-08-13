export type CoverLetterStyle =
  | "Professional"
  | "Friendly"
  | "Formal"
  | "Startup"
  | "Corporate"
  | "Concise"
  | "Detailed"
  | "Confident"
  | "Enthusiastic";

export type ExperienceLevel = "Fresher" | "Junior" | "Mid-Level" | "Senior";
export type CoverLetterLength = "Short" | "Medium" | "Long";

export interface CoverLetterResult {
  coverLetterText: string;
  highlightedSkills: string[];
  keywordsUsed: string[];
  atsTips: string[];
}

export interface CoverLetterVersion {
  id: string;
  timestamp: string;
  style: CoverLetterStyle;
  experienceLevel: ExperienceLevel;
  length: CoverLetterLength;
  coverLetterText: string;
}

export interface CoverLetterRequest {
  company: string;
  role: string;
  jobDescription?: string;
  resumeText?: string;
  style?: CoverLetterStyle;
  experienceLevel?: ExperienceLevel;
  length?: CoverLetterLength;
  userName?: string;
  userEmail?: string;
}

export interface CoverLetterResponse {
  success: boolean;
  message: string;
  data: CoverLetterResult;
}
