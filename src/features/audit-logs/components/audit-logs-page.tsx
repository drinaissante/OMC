import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useReactTable, getCoreRowModel, type ColumnDef } from "@tanstack/react-table"
import { supabase } from "@/integrations/supabase/client"
import { DataTable } from "@/shared/components/data-table/data-table"
import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination"
import { Badge } from "@/components/ui/badge"

interface AuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string
  resource_id: string | null
  ip_address: string | null
  created_at: string
  users: { name: string; email: string } | null
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(0)
  const [pageSize] = useState(20)

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", page, pageSize],
    queryFn: async () => {
      const from = page * pageSize
      const to = from + pageSize - 1
      const { data, count } = await supabase
        .from("audit_logs")
        .select("*, users(name, email)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to)
      return { data: (data ?? []) as AuditLog[], count: count ?? 0 }
    },
  })

  const columns: ColumnDef<AuditLog, unknown>[] = useMemo(() => [
    {
      accessorKey: "created_at", header: "Timestamp",
      cell: ({ row }) => <span className="text-sm">{new Date(row.original.created_at).toLocaleString()}</span>,
    },
    {
      accessorFn: (row) => row.users?.name ?? "System", id: "user", header: "User",
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">{row.original.users?.name ?? "System"}</div>
          <div className="text-xs text-muted-foreground">{row.original.users?.email ?? ""}</div>
        </div>
      ),
    },
    {
      accessorKey: "action", header: "Action",
      cell: ({ row }) => {
        const action = row.original.action
        const variant = action.includes("failed") ? "destructive" : action.includes("deleted") ? "destructive" : action.includes("created") || action.includes("added") || action.includes("login") ? "success" : "secondary"
        return <Badge variant={variant}>{action}</Badge>
      },
    },
    {
      accessorKey: "resource_type", header: "Resource",
      cell: ({ row }) => <span className="text-sm capitalize">{row.original.resource_type}</span>,
    },
    {
      accessorKey: "ip_address", header: "IP Address",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.ip_address ?? "N/A"}</span>,
    },
  ], [])

  const table = useReactTable({
    data: data?.data ?? [], columns,
    pageCount: Math.ceil((data?.count ?? 0) / pageSize),
    state: { pagination: { pageIndex: page, pageSize } },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex: page, pageSize }) : updater
      setPage(next.pageIndex)
    },
    getCoreRowModel: getCoreRowModel(), manualPagination: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Track all administrative actions</p>
      </div>
      <DataTable table={table} columns={columns} isLoading={isLoading} emptyTitle="No audit logs" emptyDescription="Actions will appear here as they occur." />
      <DataTablePagination table={table} />
    </div>
  )
}
