export type ActivityActionType =
  | "Job Added"
  | "Status Changed"
  | "Salary Updated"
  | "Job Deleted"
  | "Interview Scheduled"
  | "Notes Added"
  | "System Action";

export interface ActivityItem {
  id: string;
  action: ActivityActionType;
  company: string;
  role: string;
  details: string;
  timestamp: string;
  user: {
    name: string;
    avatarInitials: string;
  };
  previousValue?: string;
  newValue?: string;
  jobId?: string;
}
