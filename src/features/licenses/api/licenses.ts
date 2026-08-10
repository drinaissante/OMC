import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import type { PaginatedResponse } from "@/shared/types/common"

export type License = Database["public"]["Tables"]["licenses"]["Row"]
export type LicenseInsert = Database["public"]["Tables"]["licenses"]["Insert"]
export type LicenseUpdate = Database["public"]["Tables"]["licenses"]["Update"]

export interface LicenseWithPlugin extends License {
  plugins: { name: string; version: string } | null
}

export interface LicenseFilters {
  search?: string
  status?: string
  plugin_id?: string
  license_type?: string
  dateFrom?: string
  dateTo?: string
}

export interface LicensePagination {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export async function fetchLicenses(
  pagination: LicensePagination,
  filters: LicenseFilters = {}
): Promise<PaginatedResponse<LicenseWithPlugin>> {
  const { page, pageSize, sortBy = "created_at", sortOrder = "desc" } = pagination
  const from = page * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("licenses")
    .select("*, plugins(name, version)", { count: "exact" })

  if (filters.search) {
    query = query.or(`license_key.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq("status", filters.status as License["status"])
  }
  if (filters.plugin_id) {
    query = query.eq("plugin_id", filters.plugin_id)
  }
  if (filters.license_type) {
    query = query.eq("license_type", filters.license_type as License["license_type"])
  }
  if (filters.dateFrom) {
    query = query.gte("created_at", filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte("created_at", filters.dateTo)
  }

  query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(from, to)

  const { data, count, error } = await query

  if (error) throw error

  return {
    data: (data ?? []) as LicenseWithPlugin[],
    count: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}

export async function fetchLicense(id: string): Promise<LicenseWithPlugin | null> {
  const { data, error } = await supabase
    .from("licenses")
    .select("*, plugins(name, version)")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as LicenseWithPlugin
}

export async function createLicense(license: LicenseInsert): Promise<License> {
  const { data, error } = await supabase
    .from("licenses")
    .insert(license)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateLicense(id: string, updates: LicenseUpdate): Promise<License> {
  const { data, error } = await supabase
    .from("licenses")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  if (!data) throw new Error("Update failed — you may not have permission")
  return data
}

export async function deleteLicense(id: string): Promise<void> {
  const { data, error } = await supabase.from("licenses").delete().eq("id", id).select("id")
  if (error) throw error
  if (!data || data.length === 0) throw new Error("Delete failed — you may not have permission")
}

export async function revokeLicense(id: string): Promise<License> {
  return updateLicense(id, { status: "revoked" })
}

export async function fetchLicensesForExport(filters: LicenseFilters = {}): Promise<LicenseWithPlugin[]> {
  let query = supabase.from("licenses").select("*, plugins(name, version)")

  if (filters.search) {
    query = query.or(`license_key.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq("status", filters.status as License["status"])
  }
  if (filters.plugin_id) {
    query = query.eq("plugin_id", filters.plugin_id)
  }

  const { data, error } = await query.order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as LicenseWithPlugin[]
}
