import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPlugins, fetchPlugin, createPlugin, updatePlugin, deletePlugin, setPluginStatus, type PluginUpdate } from "../api/plugins"
import { toast } from "sonner"

export function usePlugins() {
  return useQuery({
    queryKey: ["plugins"],
    queryFn: fetchPlugins,
    staleTime: 15_000,
  })
}

export function usePlugin(id: string | null) {
  return useQuery({
    queryKey: ["plugin", id],
    queryFn: () => fetchPlugin(id!),
    enabled: !!id,
  })
}

export function useCreatePlugin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createPlugin,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plugins"] })
      toast.success("Plugin added")
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to add plugin"),
  })
}

export function useUpdatePlugin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: PluginUpdate }) => updatePlugin(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plugins"] })
      toast.success("Plugin updated")
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update plugin"),
  })
}

export function useDeletePlugin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deletePlugin,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plugins"] })
      toast.success("Plugin deleted")
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete plugin"),
  })
}

export function useSetPluginStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "inactive" }) =>
      setPluginStatus(id, status),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["plugins"] })
      toast.success(variables.status === "inactive" ? "Plugin disabled" : "Plugin enabled")
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update plugin status"),
  })
}
