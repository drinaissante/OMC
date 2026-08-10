import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { StatusBadge, formatRelativeTime } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useDeployment } from "../hooks/use-deployments"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  deploymentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeploymentDetailDrawer({ deploymentId, open, onOpenChange }: Props) {
  const { data: dep, isLoading } = useDeployment(deploymentId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[520px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Deployment Details</SheetTitle>
          <SheetDescription>{isLoading ? <Skeleton className="h-4 w-48" /> : `#${dep?.display_id} - ${dep?.software ?? "Unknown"}`}</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="mt-6 space-y-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : dep ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2">
              <StatusBadge status={dep.status} />
              <Badge variant={dep.deployment_type === "proxy" ? "info" : "secondary"}>
                {dep.deployment_type === "proxy" ? "Proxy Network" : "Standalone Server"}
              </Badge>
            </div>

            <Separator />
            <Section title="License Information">
              <InfoRow label="License Key" value={dep.licenses?.license_key ?? "N/A"} mono />
              <InfoRow label="Customer" value={dep.licenses?.customer_name ?? "N/A"} />
              <InfoRow label="Plugin" value={dep.licenses?.plugins?.name ?? "Unknown"} />
            </Section>

            <Separator />
            <Section title="Server Information">
              <InfoRow label="Software" value={dep.software ?? "N/A"} />
              <InfoRow label="Minecraft Version" value={dep.minecraft_version ?? "N/A"} />
              <InfoRow label="Java Version" value={dep.java_version ?? "N/A"} />
              <InfoRow label="OS" value={dep.os ?? "N/A"} />
            </Section>

            <Separator />
            <Section title="Network">
              <InfoRow label="Public IP" value={dep.public_ip ?? "N/A"} mono />
              <InfoRow label="Port" value={dep.port ? String(dep.port) : "N/A"} />
              <InfoRow label="Country" value={dep.country ?? "N/A"} />
              <InfoRow label="Installation UUID" value={dep.installation_uuid ?? "N/A"} mono />
            </Section>

            <Separator />
            <Section title="Activity">
              <InfoRow label="First Activated" value={dep.first_activated_at ? new Date(dep.first_activated_at).toLocaleString() : "N/A"} />
              <InfoRow label="Last Seen" value={formatRelativeTime(dep.last_seen_at)} />
              <InfoRow label="Total Validations" value={String(dep.validation_count)} />
            </Section>

            {dep.deployment_type === "proxy" && dep.backend_servers && dep.backend_servers.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-3 text-sm font-semibold">Backend Servers</h4>
                  <div className="space-y-2">
                    {dep.backend_servers.map((bs) => (
                      <div key={bs.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{bs.server_name}</span>
                          <StatusBadge status={bs.online_status} />
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {bs.software} | MC {bs.minecraft_version} | v{bs.plugin_version}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h4 className="mb-3 text-sm font-semibold">{title}</h4><div className="space-y-2">{children}</div></div>
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}
