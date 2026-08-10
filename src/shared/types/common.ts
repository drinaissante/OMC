export type { Database } from "@/integrations/supabase/types"

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  search?: string
}

export interface DateRangeFilter {
  from?: string
  to?: string
}
