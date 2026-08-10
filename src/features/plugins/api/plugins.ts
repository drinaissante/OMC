import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

export type Plugin = Database["public"]["Tables"]["plugins"]["Row"]
export type PluginInsert = Database["public"]["Tables"]["plugins"]["Insert"]
export type PluginUpdate = Database["public"]["Tables"]["plugins"]["Update"]

export interface PluginWithStats extends Plugin {
  license_count?: number
  active_deployments?: number
}

export interface PluginDetail extends Plugin {
  license_count: number
  active_deployments: number
  licenses: Database["public"]["Tables"]["licenses"]["Row"][]
  recent_deployments: Database["public"]["Tables"]["deployments"]["Row"][]
}

export async function fetchPlugins(): Promise<PluginWithStats[]> {
  const { data: plugins, error } = await supabase
    .from("plugins")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error

  const pluginsWithStats = await Promise.all(
    (plugins ?? []).map(async (plugin) => {
      const { data: licenseIds } = await supabase
        .from("licenses")
        .select("id")
        .eq("plugin_id", plugin.id)
      const ids = (licenseIds ?? []).map((l) => l.id)

      let deployCount = 0
      if (ids.length > 0) {
        const { count } = await supabase
          .from("deployments")
          .select("id", { count: "exact", head: true })
          .in("license_id", ids)
          .eq("status", "online")
        deployCount = count ?? 0
      }

      return {
        ...plugin,
        license_count: ids.length,
        active_deployments: deployCount,
      }
    })
  )

  return pluginsWithStats
}

export async function fetchPlugin(id: string): Promise<PluginDetail> {
  const { data: plugin, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error

  const { data: licenses, error: licensesError } = await supabase
    .from("licenses")
    .select("*")
    .eq("plugin_id", id)
    .order("created_at", { ascending: false })
  if (licensesError) throw licensesError

  const licenseIds = (licenses ?? []).map((l) => l.id)
  let active_deployments = 0
  let recent_deployments: PluginDetail["recent_deployments"] = []

  if (licenseIds.length > 0) {
    const { count, error: deployError } = await supabase
      .from("deployments")
      .select("id", { count: "exact", head: true })
      .in("license_id", licenseIds)
      .eq("status", "online")
    if (deployError) throw deployError
    active_deployments = count ?? 0

    const { data: deployments, error: listError } = await supabase
      .from("deployments")
      .select("*")
      .in("license_id", licenseIds)
      .order("last_seen_at", { ascending: false })
      .limit(10)
    if (listError) throw listError
    recent_deployments = deployments ?? []
  }

  return {
    ...plugin,
    license_count: (licenses ?? []).length,
    active_deployments,
    licenses: licenses ?? [],
    recent_deployments,
  }
}

export async function createPlugin(plugin: PluginInsert): Promise<Plugin> {
  const { data, error } = await supabase.from("plugins").insert(plugin).select().single()
  if (error) throw error
  return data
}

export async function updatePlugin(id: string, updates: PluginUpdate): Promise<Plugin> {
  const { data, error } = await supabase.from("plugins").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deletePlugin(id: string): Promise<void> {
  const { error } = await supabase.rpc("delete_plugin", { p_plugin_id: id })
  if (error) throw error
}

export async function setPluginStatus(id: string, status: "active" | "inactive"): Promise<Plugin> {
  const { data, error } = await supabase
    .from("plugins")
    .update({ status })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}
