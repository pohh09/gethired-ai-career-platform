import { JOB_PRIORITY, JOB_STATUS } from "../constants/status";

export type JobStatus = (typeof JOB_STATUS)[number];
export type JobPriority = (typeof JOB_PRIORITY)[number];
export type JobSortOption =
  "newest" | "oldest" | "company-asc" | "company-desc";

export interface Job {
  _id: string;
  company: string;
  role: string;
  location: string;
  salary?: number | null;
  status: JobStatus;
  priority: JobPriority;
  jobLink?: string;
  notes?: string;
  appliedDate: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface DiscoverJob {
  id: string;
  provider?: "JSearch" | "Adzuna" | string;
  company: string;
  companyLogo?: string;
  role: string;
  location: string;
  workplaceType: "Remote" | "Hybrid" | "Onsite" | string;
  employmentType:
    "Full-time" | "Part-time" | "Contract" | "Internship" | string;
  experienceLevel:
    "Entry Level" | "Mid Level" | "Senior Level" | "Lead" | string;
  salary?: number | null;
  salaryText?: string;
  postedDate: string;
  description: string;
  jobLink: string;
  skills: string[];
  requirements?: string[];
  benefits?: string[];
}

export interface CreateJobRequest {
  company: string;
  role: string;
  location?: string;
  salary?: number | null;
  status: JobStatus | string;
  priority: JobPriority | string;
  jobLink?: string;
  notes?: string;
  appliedDate?: string;
}

export type UpdateJobRequest = Partial<CreateJobRequest>;

export interface JobQueryParams {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: JobSortOption | string;
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  success: boolean;
  totalJobs: number;
  currentPage: number;
  totalPages: number;
  data: Job[];
}

export interface SingleJobResponse {
  success: boolean;
  message?: string;
  data: Job;
}

export interface ExtractedJobData {
  company: string;
  role: string;
  location: string;
  workplaceType: string;
  employmentType: string;
  salary: number | null;
  salaryText: string;
  description: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  jobLink: string;
}
