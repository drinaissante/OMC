import { supabase } from "@/integrations/supabase/client"
import type { DashboardStats } from "../types/types"

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [licenses, deployments, plugins, todayRequests, failedAuth] = await Promise.all([
    supabase.from("licenses").select("status", { count: "exact", head: true }),
    supabase.from("deployments").select("id", { count: "exact", head: true }),
    supabase.from("plugins").select("id", { count: "exact", head: true }),
    supabase.from("licenses").select("id", { count: "exact", head: true }).gte("created_at", new Date().toISOString().split("T")[0]),
    supabase.from("audit_logs").select("id", { count: "exact", head: true }).eq("action", "user.failed_login").gte("created_at", new Date(Date.now() - 86400000).toISOString()),
  ])

  const allLicenses = await supabase.from("licenses").select("status")
  const statuses = allLicenses.data ?? []

  return {
    totalLicenses: licenses.count ?? 0,
    activeLicenses: statuses.filter((l) => l.status === "active").length,
    revokedLicenses: statuses.filter((l) => l.status === "revoked").length,
    expiredLicenses: statuses.filter((l) => l.status === "expired").length,
    totalDeployments: deployments.count ?? 0,
    totalPlugins: plugins.count ?? 0,
    licenseRequestsToday: todayRequests.count ?? 0,
    failedAuthAttempts: failedAuth.count ?? 0,
  }
}

export async function fetchDailyValidations(days: number = 30) {
  const startDate = new Date(Date.now() - days * 86400000).toISOString()
  const { data } = await supabase
    .from("validations")
    .select("created_at, status")
    .gte("created_at", startDate)
    .order("created_at", { ascending: true })

  const grouped: Record<string, { success: number; failure: number }> = {}
  for (const v of data ?? []) {
    const day = v.created_at.split("T")[0]
    if (!grouped[day]) grouped[day] = { success: 0, failure: 0 }
    if (v.status === "success") grouped[day].success++
    else grouped[day].failure++
  }

  return Object.entries(grouped).map(([date, vals]) => ({
    date,
    success: vals.success,
    failure: vals.failure,
  }))
}

export async function fetchPluginInstallations() {
  const { data } = await supabase
    .from("licenses")
    .select("plugin_id, plugins(name)")
    .eq("status", "active")

  const counts: Record<string, number> = {}
  for (const l of data ?? []) {
    const name = (l.plugins as { name: string } | null)?.name ?? "Unknown"
    counts[name] = (counts[name] ?? 0) + 1
  }

  return Object.entries(counts).map(([name, count]) => ({ name, count }))
}
