import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, formatRelativeTime } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Trash2, Ban } from "lucide-react"
import type { LicenseWithPlugin } from "../api/licenses"

interface LicenseColumnsProps {
  onView: (license: LicenseWithPlugin) => void
  onRevoke: (license: LicenseWithPlugin) => void
  onDelete: (license: LicenseWithPlugin) => void
}

export function getLicenseColumns({ onView, onRevoke, onDelete }: LicenseColumnsProps): ColumnDef<LicenseWithPlugin, unknown>[] {
  return [
    {
      accessorKey: "display_id",
      header: "ID",
      cell: ({ row }) => <span className="font-mono text-sm">#{row.original.display_id}</span>,
    },
    {
      accessorKey: "license_key",
      header: "License Key",
      cell: ({ row }) => (
        <button
          onClick={() => navigator.clipboard.writeText(row.original.license_key)}
          className="font-mono text-sm text-primary hover:underline"
          title="Click to copy"
        >
          {row.original.license_key}
        </button>
      ),
    },
    {
      accessorFn: (row) => row.plugins?.name ?? "Unknown",
      id: "plugin",
      header: "Plugin",
      cell: ({ row }) => <span className="text-sm">{row.original.plugins?.name ?? "Unknown"}</span>,
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">{row.original.customer_name}</div>
          <div className="text-xs text-muted-foreground">{row.original.customer_email ?? "—"}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "license_type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.license_type === "lifetime" ? "success" : row.original.license_type === "trial" ? "warning" : "info"}>
          {row.original.license_type}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatRelativeTime(row.original.created_at)}</span>,
    },
    {
      accessorKey: "expiration_date",
      header: "Expiration",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.license_type === "lifetime" ? "Never" : row.original.expiration_date ? new Date(row.original.expiration_date).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "allowed_deployments",
      header: "Deployments",
      cell: ({ row }) => <span className="text-sm">{row.original.allowed_deployments}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {row.original.status === "active" && (
              <DropdownMenuItem onClick={() => onRevoke(row.original)} className="text-destructive">
                <Ban className="mr-2 h-4 w-4" />
                Revoke
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
