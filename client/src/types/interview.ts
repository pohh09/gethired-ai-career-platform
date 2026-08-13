export type QuestionDifficulty = "Easy" | "Medium" | "Hard";
export type QuestionType =
  "HR" | "Technical" | "Behavioral" | "Scenario" | "Coding";

export interface InterviewQuestion {
  id: string;
  type: QuestionType;
  question: string;
  suggestedAnswer: string;
  keyPoints: string[];
  difficulty: QuestionDifficulty;
}

export interface InterviewReadinessMetrics {
  overall: number;
  knowledge: number;
  communication: number;
  technical: number;
  behavioral: number;
}

export interface InterviewPrepResult {
  companySummary: string;
  questions: InterviewQuestion[];
  technicalTopics: string[];
  revisionTopics: string[];
  likelyCodingQuestions: string[];
  salaryNegotiationTips: string[];
  questionsToAskInterviewer: string[];
  readinessMetrics: InterviewReadinessMetrics;
}

export interface InterviewPrepRequest {
  company: string;
  role: string;
  jobDescription?: string;
  resumeText?: string;
}

export interface InterviewPrepResponse {
  success: boolean;
  message: string;
  data: InterviewPrepResult;
}
