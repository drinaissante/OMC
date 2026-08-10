import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { Separator } from "@/components/ui/separator"
import { usePlugin } from "../hooks/use-plugin-mutations"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Server, KeyRound } from "lucide-react"

interface PluginDetailDrawerProps {
  pluginId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PluginDetailDrawer({ pluginId, open, onOpenChange }: PluginDetailDrawerProps) {
  const { data: plugin, isLoading } = usePlugin(pluginId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] overflow-y-auto sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{isLoading ? "Plugin Details" : plugin?.name}</SheetTitle>
          <SheetDescription>
            {isLoading ? <Skeleton className="h-4 w-48" /> : plugin?.description ?? "No description"}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : plugin ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2">
              <StatusBadge status={plugin.status} />
              <Badge variant="outline">{plugin.version}</Badge>
              {!plugin.licensing_enabled && <Badge variant="secondary">Licensing off</Badge>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <KeyRound className="h-4 w-4" />
                  Licenses
                </div>
                <p className="mt-1 text-2xl font-bold">{plugin.license_count}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Server className="h-4 w-4" />
                  Active Deployments
                </div>
                <p className="mt-1 text-2xl font-bold">{plugin.active_deployments}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-semibold">Plugin Information</h4>
              <div className="space-y-2">
                <InfoRow label="Plugin ID" value={`#${plugin.display_id}`} />
                <InfoRow label="Version" value={plugin.version} />
                <InfoRow label="Licensing" value={plugin.licensing_enabled ? "Enabled" : "Disabled"} />
                <InfoRow label="Created" value={new Date(plugin.created_at).toLocaleString()} />
                <InfoRow
                  label="Documentation"
                  value={plugin.documentation_url ? "Open" : "N/A"}
                  link={plugin.documentation_url ?? undefined}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-semibold">Licenses ({plugin.licenses.length})</h4>
              {plugin.licenses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No licenses for this plugin yet.</p>
              ) : (
                <div className="space-y-2">
                  {plugin.licenses.slice(0, 8).map((license) => (
                    <div key={license.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs">{license.license_key}</p>
                        <p className="truncate text-xs text-muted-foreground">{license.customer_name}</p>
                      </div>
                      <StatusBadge status={license.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-semibold">Recent Deployments ({plugin.recent_deployments.length})</h4>
              {plugin.recent_deployments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No deployments yet.</p>
              ) : (
                <div className="space-y-2">
                  {plugin.recent_deployments.map((deployment) => (
                    <div key={deployment.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {deployment.public_ip ?? "Unknown IP"}
                          {deployment.port ? `:${deployment.port}` : ""}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {deployment.software ?? "Unknown software"}
                          {deployment.minecraft_version ? ` • MC ${deployment.minecraft_version}` : ""}
                        </p>
                      </div>
                      <StatusBadge status={deployment.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({ label, value, mono, link }: { label: string; value: string; mono?: boolean; link?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {value}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className={`text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
      )}
    </div>
  )
}
