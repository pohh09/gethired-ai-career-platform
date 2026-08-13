import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJob } from "../services/jobServices";

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
