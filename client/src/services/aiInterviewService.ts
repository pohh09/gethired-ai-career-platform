import api from "./api";
import type {
  InterviewPrepRequest,
  InterviewPrepResponse,
} from "../types/interview";

export async function fetchInterviewPrep(
  payload: InterviewPrepRequest,
): Promise<InterviewPrepResponse> {
  const response = await api.post<InterviewPrepResponse>(
    "/ai/interview-prep",
    payload,
  );
  return response.data;
}
