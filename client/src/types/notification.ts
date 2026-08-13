export type NotificationType =
  | "New Job Added"
  | "Interview Scheduled"
  | "Application Updated"
  | "Offer Received"
  | "Application Rejected"
  | "Reminder Due"
  | "System Notification";

export type NotificationCategory =
  "All" | "Unread" | "Jobs" | "Interviews" | "System";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string; // ISO string or human relative time
  isRead: boolean;
  category: "Jobs" | "Interviews" | "System";
  linkUrl?: string;
  jobId?: string;
}
