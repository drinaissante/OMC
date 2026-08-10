import { useQuery } from "@tanstack/react-query"
import { fetchDeployments, fetchDeployment, type DeploymentFilters, type DeploymentPagination } from "../api/deployments"

export function useDeployments(pagination: DeploymentPagination, filters: DeploymentFilters) {
  return useQuery({
    queryKey: ["deployments", pagination, filters],
    queryFn: () => fetchDeployments(pagination, filters),
    staleTime: 15_000,
    refetchInterval: 30_000,
  })
}

export function useDeployment(id: string | null) {
  return useQuery({
    queryKey: ["deployment", id],
    queryFn: () => fetchDeployment(id!),
    enabled: !!id,
  })
}
