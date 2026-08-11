import { useState, useMemo, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table"
import { DataTable } from "@/shared/components/data-table/data-table"
import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination"
import { getLicenseColumns } from "./license-columns"
import { GenerateLicenseModal } from "./generate-license-modal"
import { LicenseDetailDrawer } from "./license-detail-drawer"
import { useLicenses, useRevokeLicense, useDeleteLicense, useLicenseFilters } from "../hooks/use-licenses"
import type { LicenseWithPlugin } from "../api/licenses"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchLicensesForExport } from "../api/licenses"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function LicensesPage() {
  const { pagination, setPagination, filters, updateFilter, resetFilters: _resetFilters } = useLicenseFilters()

  const apiPagination = useMemo(() => ({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: "created_at",
    sortOrder: "desc" as const,
  }), [pagination])

  const { data, isLoading } = useLicenses(apiPagination, filters)
  const revokeLicense = useRevokeLicense()
  const deleteLicense = useDeleteLicense()

  const [generateOpen, setGenerateOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<LicenseWithPlugin | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LicenseWithPlugin | null>(null)

  const { data: plugins } = useQuery({
    queryKey: ["plugins", "list"],
    queryFn: async () => {
      const { data } = await supabase.from("plugins").select("id, name").order("name")
      return data ?? []
    },
  })

  const { data: deploymentCount } = useQuery({
    queryKey: ["deployments", "count", deleteTarget?.id],
    queryFn: async () => {
      if (!deleteTarget) return 0
      const { count, error } = await supabase
        .from("deployments")
        .select("id", { count: "exact", head: true })
        .eq("license_id", deleteTarget.id)
      if (error) throw error
      return count ?? 0
    },
    enabled: !!deleteTarget,
  })

  const handleView = useCallback((license: LicenseWithPlugin) => {
    setDetailId(license.id)
    setDetailOpen(true)
  }, [])

  const handleRevoke = useCallback((license: LicenseWithPlugin) => {
    setRevokeTarget(license)
  }, [])

  const handleDelete = useCallback((license: LicenseWithPlugin) => {
    setDeleteTarget(license)
  }, [])

  const columns = useMemo(() => getLicenseColumns({ onView: handleView, onRevoke: handleRevoke, onDelete: handleDelete }), [handleView, handleRevoke, handleDelete])

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  async function handleExport(format: "csv" | "json") {
    try {
      const exportData = await fetchLicensesForExport(filters)
      let content: string
      let mimeType: string
      let ext: string

      if (format === "csv") {
        const headers = ["ID", "Key", "Plugin", "Customer", "Email", "Status", "Type", "Created", "Expiration"]
        const rows = exportData.map((l) => [
          l.display_id,
          l.license_key,
          l.plugins?.name ?? "",
          l.customer_name,
          l.customer_email,
          l.status,
          l.license_type,
          l.created_at,
          l.expiration_date ?? "",
        ])
        content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
        mimeType = "text/csv"
        ext = "csv"
      } else {
        content = JSON.stringify(exportData, null, 2)
        mimeType = "application/json"
        ext = "json"
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `licenses.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exported ${exportData.length} licenses as ${ext.toUpperCase()}`)
    } catch {
      toast.error("Failed to export licenses")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Licenses</h1>
          <p className="text-muted-foreground">Manage your plugin licenses</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.status ?? "all"} onValueChange={(v) => { if (v) updateFilter("status", v === "all" ? undefined : v) }}>
            <SelectTrigger className="w-35">
              <SelectValue>
                {(value) => {
                  const labels: Record<string, string> = { all: "All Statuses", active: "Active", revoked: "Revoked", expired: "Expired", pending: "Pending" }
                  return labels[String(value)] ?? "All Statuses"
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.plugin_id ?? "all"} onValueChange={(v) => { if (v) updateFilter("plugin_id", v === "all" ? undefined : v) }}>
            <SelectTrigger className="w-40">
              <SelectValue>
                {(value) => (value === "all" ? "All Plugins" : plugins?.find((p) => p.id === value)?.name ?? "All Plugins")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plugins</SelectItem>
              {plugins?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">CSV</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("json")}>
            <Download className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">JSON</span>
          </Button>
          <Button onClick={() => setGenerateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Generate License
          </Button>
        </div>
      </div>

      <div>
        <DataTable table={table} columns={columns} isLoading={isLoading} emptyTitle="No licenses found" emptyDescription="Generate your first license to get started." />
        <DataTablePagination table={table} />
      </div>

      <GenerateLicenseModal open={generateOpen} onOpenChange={setGenerateOpen} />
      <LicenseDetailDrawer licenseId={detailId} open={detailOpen} onOpenChange={setDetailOpen} />

      <AlertDialog open={!!revokeTarget} onOpenChange={() => setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke License</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the license for {revokeTarget?.customer_name}? This action can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (revokeTarget) revokeLicense.mutate(revokeTarget.id, { onSettled: () => setRevokeTarget(null) })
            }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete License</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the license for {deleteTarget?.customer_name}? This cannot be undone.
              {deploymentCount !== undefined && deploymentCount > 0 && (
                <span className="mt-2 block text-sm">
                  {deploymentCount} linked deployment(s) will be kept, but their license link will be cleared.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleteTarget) deleteLicense.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) })
            }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
