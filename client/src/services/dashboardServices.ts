import api from "./api";
import type { JobStatsResponse } from "../types/dashboard";

export const getDashboardStats = async (): Promise<JobStatsResponse> => {
  const response = await api.get("/jobs/stats");
  return response.data;
};
