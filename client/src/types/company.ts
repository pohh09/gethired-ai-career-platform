export type WorkplaceType = "Remote" | "Hybrid" | "Onsite";

export type RelationshipStatus = "Cold" | "Warm" | "Active" | "Referral";

export type InteractionType =
  "Email" | "Call" | "LinkedIn Message" | "Referral" | "Meeting" | "Interview";

export type StandardTag =
  "Dream Company" | "Referral" | "Startup" | "MNC" | "Remote" | "Priority";

export type TagType = StandardTag | string;

export type PipelineStage =
  "Applied" | "Screening" | "Interview" | "Offer" | "Rejected" | "Accepted";

export interface Recruiter {
  id: string;
  companyId: string;
  name: string;
  role: string;
  email?: string;
  linkedIn?: string;
  phone?: string;
  relationshipStatus: RelationshipStatus;
  notes?: string;
  lastContactDate?: string;
}

export interface CommunicationLog {
  id: string;
  companyId: string;
  recruiterName?: string;
  type: InteractionType;
  date: string;
  notes: string;
}

export interface CompanyNote {
  id: string;
  companyId: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  author: string;
}

export interface CompanyAttachment {
  id: string;
  companyId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  url?: string;
}

export interface CompanyApplication {
  id: string;
  companyId: string;
  roleTitle: string;
  stage: PipelineStage;
  appliedDate: string;
  location: string;
  salaryRange?: string;
}

export interface Company {
  _id: string;
  name: string;
  industry: string;
  website?: string;
  size: string; // e.g. "1,000 - 5,000 employees"
  headquarters: string;
  workplaceType: WorkplaceType;
  tags: TagType[];
  logoUrl?: string;
  totalApplications: number;
  activeJobsCount: number;
  lastActivity: string;
  description?: string;
  recruiters?: Recruiter[];
  logs?: CommunicationLog[];
  companyNotes?: CompanyNote[];
  attachments?: CompanyAttachment[];
  applications?: CompanyApplication[];
}

export interface CompanyFilterOptions {
  searchQuery: string;
  industry: string;
  size: string;
  workplaceType: string;
  relationshipStatus: string;
  selectedTag: string;
}
