import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchLicenses,
  fetchLicense,
  createLicense,
  revokeLicense,
  deleteLicense,
  type LicenseFilters,
  type LicensePagination,
} from "../api/licenses"
import { toast } from "sonner"
import type { PaginationState } from "@tanstack/react-table"

export function useLicenses(pagination: LicensePagination, filters: LicenseFilters) {
  return useQuery({
    queryKey: ["licenses", pagination, filters],
    queryFn: () => fetchLicenses(pagination, filters),
    staleTime: 15_000,
  })
}

export function useLicense(id: string | null) {
  return useQuery({
    queryKey: ["license", id],
    queryFn: () => fetchLicense(id!),
    enabled: !!id,
  })
}

export function useCreateLicense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLicense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("License generated successfully")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create license")
    },
  })
}

export function useRevokeLicense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeLicense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("License revoked")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to revoke license")
    },
  })
}

export function useDeleteLicense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteLicense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("License deleted")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete license")
    },
  })
}

export function useLicenseFilters() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [filters, setFilters] = useState<LicenseFilters>({})

  const updateFilter = useCallback((key: keyof LicenseFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({})
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  return { pagination, setPagination, filters, updateFilter, resetFilters }
}
