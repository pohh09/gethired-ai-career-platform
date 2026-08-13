import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/jobServices";
import type { JobQueryParams } from "../types/job";

export function useJobs(params?: JobQueryParams) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => getJobs(params),
    staleTime: 1000 * 60 * 2, // 2 minutes staletime
  });
}
