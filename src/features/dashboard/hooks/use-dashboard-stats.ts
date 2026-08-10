import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats, fetchDailyValidations, fetchPluginInstallations } from "../api/dashboard"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useDailyValidations(days?: number) {
  return useQuery({
    queryKey: ["dashboard", "validations", days],
    queryFn: () => fetchDailyValidations(days),
    staleTime: 60_000,
  })
}

export function usePluginInstallations() {
  return useQuery({
    queryKey: ["dashboard", "plugin-installations"],
    queryFn: fetchPluginInstallations,
    staleTime: 60_000,
  })
}
