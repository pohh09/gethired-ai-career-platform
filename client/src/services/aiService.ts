import api from "./api";
import type {
  ResumeMatchRequest,
  ResumeMatchResponse,
  ResumeOptimizationRequest,
  ResumeOptimizationResponse,
} from "../types/ai";

export async function matchResumeWithJob(
  payload: ResumeMatchRequest,
): Promise<ResumeMatchResponse> {
  const response = await api.post<ResumeMatchResponse>(
    "/ai/match-resume",
    payload,
  );
  return response.data;
}

export async function optimizeResume(
  payload: ResumeOptimizationRequest,
): Promise<ResumeOptimizationResponse> {
  const response = await api.post<ResumeOptimizationResponse>(
    "/ai/optimize-resume",
    payload,
  );
  return response.data;
}
