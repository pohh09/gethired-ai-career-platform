import api from "./api";
import type {
  JobAnalyzerRequest,
  JobAnalyzerResponse,
} from "../types/jobAnalyzer";

export async function analyzeJobDescription(
  payload: JobAnalyzerRequest,
): Promise<JobAnalyzerResponse> {
  const response = await api.post<JobAnalyzerResponse>(
    "/ai/analyze-job",
    payload,
  );
  return response.data;
}
