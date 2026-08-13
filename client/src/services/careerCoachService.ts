import api from "./api";
import type { CareerCoachResponse } from "../types/careerCoach";

export async function fetchCareerCoachAnalysis(): Promise<CareerCoachResponse> {
  const response = await api.post<CareerCoachResponse>("/ai/career-coach", {});
  return response.data;
}
