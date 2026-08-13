export interface JobStats {
  Applied: number;
  Screening: number;
  Interview: number;
  Assessment: number;
  "HR Round": number;
  Offer: number;
  Rejected: number;
}

export interface MonthlyApplicationData {
  month: string;
  count: number;
}

export interface JobStatsResponse {
  success: boolean;
  totalJobs?: number;
  stats: JobStats;
  monthlyApplications?: MonthlyApplicationData[];
}
