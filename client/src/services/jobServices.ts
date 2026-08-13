import api from "./api";
import type {
  CreateJobRequest,
  UpdateJobRequest,
  JobQueryParams,
  JobsResponse,
  SingleJobResponse,
} from "../types/job";

export const getJobs = async (
  params?: JobQueryParams,
): Promise<JobsResponse> => {
  const response = await api.get("/jobs", { params });
  return response.data;
};

export const createJob = async (
  data: CreateJobRequest,
): Promise<SingleJobResponse> => {
  const response = await api.post("/jobs", data);
  return response.data;
};

export const updateJob = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobRequest;
}): Promise<SingleJobResponse> => {
  const response = await api.put(`/jobs/${id}`, data);
  return response.data;
};

export const deleteJob = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};
