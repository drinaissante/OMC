import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Key,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  Package,
  FileText,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { DashboardStats } from "../types/types"

interface KpiCardsProps {
  stats: DashboardStats | undefined
  isLoading: boolean
}

export function KpiCards({ stats, isLoading }: KpiCardsProps) {
  const cards = [
    { title: "Total Licenses", value: stats?.totalLicenses ?? 0, icon: Key, trend: "+12%", trendUp: true },
    { title: "Active Licenses", value: stats?.activeLicenses ?? 0, icon: CheckCircle2, trend: "+8%", trendUp: true },
    { title: "Revoked Licenses", value: stats?.revokedLicenses ?? 0, icon: XCircle, trend: "-3%", trendUp: false },
    { title: "Expired Licenses", value: stats?.expiredLicenses ?? 0, icon: Clock, trend: "+2%", trendUp: true },
    { title: "Total Deployments", value: stats?.totalDeployments ?? 0, icon: Server, trend: "+15%", trendUp: true },
    { title: "Total Plugins", value: stats?.totalPlugins ?? 0, icon: Package, trend: "0%", trendUp: true },
    { title: "Requests Today", value: stats?.licenseRequestsToday ?? 0, icon: FileText, trend: "+5%", trendUp: true },
    { title: "Failed Auth (24h)", value: stats?.failedAuthAttempts ?? 0, icon: ShieldAlert, trend: "-10%", trendUp: false },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-1 h-3 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <p className="flex items-center text-xs text-muted-foreground">
                {card.trendUp ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={card.trendUp ? "text-emerald-500" : "text-red-500"}>
                  {card.trend}
                </span>
                <span className="ml-1">vs last month</span>
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
