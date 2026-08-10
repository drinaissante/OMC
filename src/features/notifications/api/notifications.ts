import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

export type Notification = Database["public"]["Tables"]["notifications"]["Row"]

export async function fetchNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)
  if (error) throw error
  return data ?? []
}

export async function fetchUnreadCount(): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("read", false)
  if (error) throw error
  return count ?? 0
}

export async function markAsRead(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)
  if (error) throw error
}

export async function markAllAsRead(): Promise<void> {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("read", false)
  if (error) throw error
}
