import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import type { PaginatedResponse } from "@/shared/types/common"

export type Deployment = Database["public"]["Tables"]["deployments"]["Row"]
export type BackendServer = Database["public"]["Tables"]["backend_servers"]["Row"]

export interface DeploymentWithRelations extends Deployment {
  licenses: { license_key: string; customer_name: string; plugin_id: string; plugins: { name: string } | null } | null
  backend_servers?: BackendServer[]
}

export interface DeploymentFilters {
  search?: string
  status?: string
  deployment_type?: string
  plugin_id?: string
}

export interface DeploymentPagination {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export async function fetchDeployments(
  pagination: DeploymentPagination,
  filters: DeploymentFilters = {}
): Promise<PaginatedResponse<DeploymentWithRelations>> {
  const { page, pageSize, sortBy = "last_seen_at", sortOrder = "desc" } = pagination
  const from = page * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("deployments")
    .select("*, licenses(license_key, customer_name, plugin_id, plugins(name))", { count: "exact" })

  if (filters.search) {
    query = query.or(`public_ip.ilike.%${filters.search}%,installation_uuid.ilike.%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq("status", filters.status as Deployment["status"])
  }
  if (filters.deployment_type) {
    query = query.eq("deployment_type", filters.deployment_type as Deployment["deployment_type"])
  }

  query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(from, to)
  const { data, count, error } = await query
  if (error) throw error

  return {
    data: (data ?? []) as DeploymentWithRelations[],
    count: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function fetchDeployment(id: string): Promise<DeploymentWithRelations | null> {
  const { data, error } = await supabase
    .from("deployments")
    .select("*, licenses(license_key, customer_name, plugin_id, plugins(name)), backend_servers(*)")
    .eq("id", id)
    .single()
  if (error) throw error
  return data as DeploymentWithRelations
}
