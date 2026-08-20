export type DocumentSection =
  | "General"
  | "Summary / Intro"
  | "Work Experience"
  | "Skills & Tech Stack"
  | "Education & Certs"
  | "Formatting & Tone";

export interface DocumentFeedbackItem {
  _id: string;
  authorId: string;
  authorName: string;
  comment: string;
  targetSection: DocumentSection;
  upvotes: string[];
  upvoteCount: number;
  createdAt: string;
}

export interface SharedDocumentItem {
  _id: string;
  userId: string;
  authorName: string;
  title: string;
  documentType: "resume" | "cover_letter" | "other";
  targetRole: string;
  targetCompany?: string;
  content: string;
  visibility: "private" | "shared";
  tags: string[];
  feedbackList: DocumentFeedbackItem[];
  feedbackCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  type:
    | "application_submitted"
    | "resume_updated"
    | "mock_interview"
    | "feedback_given"
    | "daily_login";
  title: string;
  date: string;
  timestamp: string;
}

export interface UserStreakData {
  userId: string;
  displayName: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activeDates: string[];
  privacy: "private" | "anonymized" | "named";
  targetWeeklyGoal: number;
  activities: ActivityItem[];
}

export interface CohortMemberStreak {
  rank: number;
  id: string;
  displayName: string;
  currentStreak: number;
  longestStreak: number;
  activeDaysCount: number;
  lastActiveDate: string;
  isCurrentUser: boolean;
}

export interface SuccessStoryItem {
  _id: string;
  userId: string;
  authorName: string;
  storyType: "offer" | "interview" | "milestone";
  company: string;
  role: string;
  story: string;
  tips?: string;
  congrats: string[];
  congratsCount: number;
  createdAt: string;
}

export interface CommunityAnswerItem {
  _id: string;
  userId: string;
  authorName: string;
  body: string;
  upvotes: string[];
  upvoteCount: number;
  isHelpful: boolean;
  createdAt: string;
}

export interface CommunityQuestionItem {
  _id: string;
  userId: string;
  authorName: string;
  title: string;
  body: string;
  category:
    | "Interview Prep"
    | "Resume & ATS"
    | "Job Search Strategy"
    | "Salary & Offer"
    | "General Advice";
  tags: string[];
  upvotes: string[];
  upvoteCount: number;
  answers: CommunityAnswerItem[];
  answersCount: number;
  createdAt: string;
}
