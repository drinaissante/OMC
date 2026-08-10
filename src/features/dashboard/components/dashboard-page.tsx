import { useDashboardStats, useDailyValidations, usePluginInstallations } from "../hooks/use-dashboard-stats"
import { KpiCards } from "./kpi-cards"
import { ValidationsChart, PluginInstallationsChart, ValidationRateChart } from "./charts/dashboard-charts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: validations, isLoading: validationsLoading } = useDailyValidations(30)
  const { data: plugins, isLoading: pluginsLoading } = usePluginInstallations()

  const totalValidations = (validations ?? []).reduce((sum, d) => sum + d.success + d.failure, 0)
  const totalSuccess = (validations ?? []).reduce((sum, d) => sum + d.success, 0)
  const successRate = totalValidations > 0 ? Math.round((totalSuccess / totalValidations) * 100) : 100
  const failureRate = 100 - successRate

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your licensing platform</p>
      </div>

      <KpiCards stats={stats} isLoading={statsLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        {validationsLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <ValidationsChart data={validations ?? []} />
        )}

        {pluginsLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <PluginInstallationsChart data={plugins ?? []} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDeployments ?? 0}</div>
            <p className="text-xs text-muted-foreground">Currently registered</p>
          </CardContent>
        </Card>

        <ValidationRateChart successRate={successRate} failureRate={failureRate} />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Validation Rate</span>
                <span className="text-sm font-medium text-emerald-500">{successRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Failed Auth (24h)</span>
                <span className="text-sm font-medium">{stats?.failedAuthAttempts ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Licenses</span>
                <span className="text-sm font-medium">{stats?.activeLicenses ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Plugins</span>
                <span className="text-sm font-medium">{stats?.totalPlugins ?? 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
