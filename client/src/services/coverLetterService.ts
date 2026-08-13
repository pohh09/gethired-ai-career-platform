import api from "./api";
import type {
  CoverLetterRequest,
  CoverLetterResponse,
} from "../types/coverLetter";

export async function fetchCoverLetter(
  payload: CoverLetterRequest,
): Promise<CoverLetterResponse> {
  const response = await api.post<CoverLetterResponse>(
    "/ai/generate-cover-letter",
    payload,
  );
  return response.data;
}
