import { useState, useMemo, useCallback } from "react"
import { useReactTable, getCoreRowModel, type ColumnDef, type PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/shared/components/data-table/data-table"
import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination"
import { StatusBadge, formatRelativeTime } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDeployments } from "../hooks/use-deployments"
import { DeploymentDetailDrawer } from "./deployment-detail-drawer"
import type { DeploymentWithRelations, DeploymentFilters } from "../api/deployments"
import { MoreHorizontal, Eye } from "lucide-react"

export default function DeploymentsPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [filters, setFilters] = useState<DeploymentFilters>({})
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const apiPagination = useMemo(() => ({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: "last_seen_at",
    sortOrder: "desc" as const,
  }), [pagination])

  const { data, isLoading } = useDeployments(apiPagination, filters)

  const handleView = useCallback((dep: DeploymentWithRelations) => {
    setDetailId(dep.id)
    setDetailOpen(true)
  }, [])

  const columns: ColumnDef<DeploymentWithRelations, unknown>[] = useMemo(() => [
    {
      accessorKey: "display_id", header: "ID",
      cell: ({ row }) => <span className="font-mono text-sm">#{row.original.display_id}</span>,
    },
    {
      accessorKey: "deployment_type", header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.deployment_type === "proxy" ? "info" : "secondary"}>
          {row.original.deployment_type === "proxy" ? "Proxy Network" : "Standalone"}
        </Badge>
      ),
    },
    {
      accessorFn: (row) => row.licenses?.plugins?.name ?? "Unknown",
      id: "plugin", header: "Plugin",
      cell: ({ row }) => <span>{row.original.licenses?.plugins?.name ?? "Unknown"}</span>,
    },
    {
      accessorFn: (row) => row.licenses?.license_key ?? "",
      id: "license_key", header: "License",
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.licenses?.license_key?.slice(0, 20)}...</span>,
    },
    {
      accessorKey: "status", header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "last_seen_at", header: "Last Seen",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatRelativeTime(row.original.last_seen_at)}</span>,
    },
    {
      accessorKey: "public_ip", header: "IP Address",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.public_ip ?? "N/A"}</span>,
    },
    {
      accessorKey: "software", header: "Software",
      cell: ({ row }) => <span className="text-sm">{row.original.software ?? "N/A"}</span>,
    },
    {
      accessorKey: "minecraft_version", header: "MC Version",
      cell: ({ row }) => <span className="text-sm">{row.original.minecraft_version ?? "N/A"}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row.original)}>
              <Eye className="mr-2 h-4 w-4" />View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [handleView])

  const table = useReactTable({
    data: data?.data ?? [], columns, pageCount: data?.totalPages ?? -1,
    state: { pagination }, onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(), manualPagination: true,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
          <p className="text-muted-foreground">Monitor server and proxy deployments</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.status ?? "all"} onValueChange={(v) => { if (v) setFilters((prev) => ({ ...prev, status: v === "all" ? undefined : v })) }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue>
                {(value) => {
                  const labels: Record<string, string> = { all: "All Statuses", online: "Online", offline: "Offline", suspended: "Suspended", blacklisted: "Blacklisted" }
                  return labels[String(value)] ?? "All Statuses"
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.deployment_type ?? "all"} onValueChange={(v) => { if (v) setFilters((prev) => ({ ...prev, deployment_type: v === "all" ? undefined : v })) }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue>
                {(value) => {
                  const labels: Record<string, string> = { all: "All Types", standalone: "Standalone", proxy: "Proxy" }
                  return labels[String(value)] ?? "All Types"
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standalone">Standalone</SelectItem>
              <SelectItem value="proxy">Proxy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable table={table} columns={columns} isLoading={isLoading} emptyTitle="No deployments" emptyDescription="Deployments will appear here once servers register." />
      <DataTablePagination table={table} />
      <DeploymentDetailDrawer deploymentId={detailId} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  )
}
