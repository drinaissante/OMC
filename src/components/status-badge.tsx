import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"

const statusConfig = {
  active: { label: "Active", variant: "success" as const, icon: CheckCircle2 },
  online: { label: "Online", variant: "success" as const, icon: CheckCircle2 },
  revoked: { label: "Revoked", variant: "destructive" as const, icon: AlertCircle },
  blacklisted: { label: "Blacklisted", variant: "destructive" as const, icon: AlertCircle },
  expired: { label: "Expired", variant: "warning" as const, icon: AlertTriangle },
  suspended: { label: "Suspended", variant: "warning" as const, icon: AlertTriangle },
  pending: { label: "Pending", variant: "info" as const, icon: Info },
  offline: { label: "Offline", variant: "secondary" as const, icon: AlertCircle },
  inactive: { label: "Inactive", variant: "secondary" as const, icon: AlertCircle },
  disabled: { label: "Disabled", variant: "secondary" as const, icon: AlertCircle },
  standalone: { label: "Standalone", variant: "info" as const, icon: Info },
  proxy: { label: "Proxy", variant: "info" as const, icon: Info },
  success: { label: "Success", variant: "success" as const, icon: CheckCircle2 },
  failure: { label: "Failure", variant: "destructive" as const, icon: AlertCircle },
  developer: { label: "Developer", variant: "default" as const, icon: Info },
  administrator: { label: "Administrator", variant: "info" as const, icon: Info },
  lifetime: { label: "Lifetime", variant: "success" as const, icon: CheckCircle2 },
  subscription: { label: "Subscription", variant: "info" as const, icon: Info },
  trial: { label: "Trial", variant: "warning" as const, icon: AlertTriangle },
} as const

type StatusKey = keyof typeof statusConfig

const variantBadge: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  destructive: "bg-red-500/10 text-red-600 dark:text-red-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  secondary: "bg-muted text-muted-foreground",
  default: "bg-primary/10 text-primary",
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as StatusKey] ?? {
    label: status,
    variant: "secondary" as const,
    icon: Info,
  }
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variantBadge[config.variant],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

export function formatRelativeTime(date: string | null): string {
  if (!date) return "Never"
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 30) return `${diffDay}d ago`
  return d.toLocaleDateString()
}
