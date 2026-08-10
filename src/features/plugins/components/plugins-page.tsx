import { useState, useMemo } from "react"
import { useReactTable, getCoreRowModel, type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/shared/components/data-table/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePlugins, useCreatePlugin, useUpdatePlugin, useDeletePlugin, useSetPluginStatus } from "../hooks/use-plugin-mutations"
import { PluginDetailDrawer } from "./plugin-detail-drawer"
import type { PluginWithStats } from "../api/plugins"
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, Loader2, Ban, PlayCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { pluginFormSchema, type PluginFormValues } from "../schemas/plugin-form-schema"

export default function PluginsPage() {
  const { data: plugins, isLoading } = usePlugins()
  const createPlugin = useCreatePlugin()
  const updatePlugin = useUpdatePlugin()
  const deletePlugin = useDeletePlugin()
  const setPluginStatus = useSetPluginStatus()

  const [formOpen, setFormOpen] = useState(false)
  const [editingPlugin, setEditingPlugin] = useState<PluginWithStats | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PluginWithStats | null>(null)
  const [detailPluginId, setDetailPluginId] = useState<string | null>(null)

  const form = useForm<PluginFormValues>({
    resolver: zodResolver(pluginFormSchema),
    defaultValues: { name: "", description: "", version: "1.0.0", documentation_url: "", licensing_enabled: true },
  })

  function openCreate() {
    setEditingPlugin(null)
    form.reset({ name: "", description: "", version: "1.0.0", documentation_url: "", licensing_enabled: true })
    setFormOpen(true)
  }

  function openEdit(plugin: PluginWithStats) {
    setEditingPlugin(plugin)
    form.reset({
      name: plugin.name,
      description: plugin.description ?? "",
      version: plugin.version,
      documentation_url: plugin.documentation_url ?? "",
      licensing_enabled: plugin.licensing_enabled,
    })
    setFormOpen(true)
  }

  function onSubmit(values: PluginFormValues) {
    const data = {
      name: values.name,
      description: values.description || null,
      version: values.version,
      documentation_url: values.documentation_url || null,
      licensing_enabled: values.licensing_enabled,
    }
    if (editingPlugin) {
      updatePlugin.mutate({ id: editingPlugin.id, updates: data }, { onSuccess: () => setFormOpen(false) })
    } else {
      createPlugin.mutate(data, { onSuccess: () => setFormOpen(false) })
    }
  }

  const columns: ColumnDef<PluginWithStats, unknown>[] = useMemo(() => [
    { accessorKey: "display_id", header: "ID", cell: ({ row }) => <span className="font-mono text-sm">#{row.original.display_id}</span> },
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "version", header: "Version", cell: ({ row }) => <Badge variant="outline">{row.original.version}</Badge> },
    { accessorKey: "license_count", header: "Licenses", cell: ({ row }) => <span>{row.original.license_count ?? 0}</span> },
    { accessorKey: "active_deployments", header: "Active Deployments", cell: ({ row }) => <span>{row.original.active_deployments ?? 0}</span> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: "actions", cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDetailPluginId(row.original.id)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEdit(row.original)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            {row.original.status === "active" ? (
              <DropdownMenuItem onClick={() => setPluginStatus.mutate({ id: row.original.id, status: "inactive" })}>
                <Ban className="mr-2 h-4 w-4" />Disable
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setPluginStatus.mutate({ id: row.original.id, status: "active" })}>
                <PlayCircle className="mr-2 h-4 w-4" />Enable
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setDeleteTarget(row.original)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  const table = useReactTable({ data: plugins ?? [], columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plugins</h1>
          <p className="text-muted-foreground">Manage your Minecraft plugins</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Plugin</Button>
      </div>

      <DataTable table={table} columns={columns} isLoading={isLoading} emptyTitle="No plugins" emptyDescription="Add your first plugin to get started." />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{editingPlugin ? "Edit Plugin" : "Add Plugin"}</DialogTitle>
              <DialogDescription>{editingPlugin ? "Update plugin details." : "Add a new Minecraft plugin."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plugin Name</Label>
                <Input id="name" {...form.register("name")} placeholder="OMC AntiCheat" />
                {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} placeholder="A brief description..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Current Version</Label>
                <Input id="version" {...form.register("version")} placeholder="1.0.0" />
                {form.formState.errors.version && <p className="text-xs text-destructive">{form.formState.errors.version.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentation_url">Documentation URL</Label>
                <Input id="documentation_url" {...form.register("documentation_url")} placeholder="https://docs.example.com" />
                {form.formState.errors.documentation_url && <p className="text-xs text-destructive">{form.formState.errors.documentation_url.message}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Switch id="licensing_enabled" checked={form.watch("licensing_enabled")} onCheckedChange={(v) => form.setValue("licensing_enabled", v)} />
                <Label htmlFor="licensing_enabled">Enable Licensing</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createPlugin.isPending || updatePlugin.isPending}>
                {(createPlugin.isPending || updatePlugin.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingPlugin ? "Save Changes" : "Add Plugin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plugin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{deleteTarget?.name}</strong>?
              This will also delete all of its licenses, deployments, and validation history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteTarget) deletePlugin.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) }) }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PluginDetailDrawer
        pluginId={detailPluginId}
        open={!!detailPluginId}
        onOpenChange={(open) => {
          if (!open) setDetailPluginId(null)
        }}
      />
    </div>
  )
}
