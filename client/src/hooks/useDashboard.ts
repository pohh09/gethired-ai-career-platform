import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboardServices";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
}
