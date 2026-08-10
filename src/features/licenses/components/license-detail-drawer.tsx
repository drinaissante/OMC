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
import { Button } from "@/components/ui/button"
import { useLicense, useRevokeLicense } from "../hooks/use-licenses"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Ban } from "lucide-react"
import { toast } from "sonner"

interface LicenseDetailDrawerProps {
  licenseId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LicenseDetailDrawer({ licenseId, open, onOpenChange }: LicenseDetailDrawerProps) {
  const { data: license, isLoading } = useLicense(licenseId)
  const revokeLicense = useRevokeLicense()

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key)
    toast.success("License key copied")
  }

  function handleRevoke() {
    if (!license) return
    revokeLicense.mutate(license.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>License Details</SheetTitle>
          <SheetDescription>
            {isLoading ? <Skeleton className="h-4 w-48" /> : license?.license_key}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : license ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2">
              <StatusBadge status={license.status} />
              <Badge variant={license.license_type === "lifetime" ? "success" : "info"}>
                {license.license_type}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(license.license_key)}
              >
                <Copy className="mr-2 h-3 w-3" />
                Copy Key
              </Button>
              {license.status === "active" && (
                <Button variant="destructive" size="sm" onClick={handleRevoke} disabled={revokeLicense.isPending}>
                  <Ban className="mr-2 h-3 w-3" />
                  Revoke
                </Button>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-semibold">License Information</h4>
              <div className="space-y-2">
                <InfoRow label="License ID" value={`#${license.display_id}`} />
                <InfoRow label="License Key" value={license.license_key} mono />
                <InfoRow label="Plugin" value={license.plugins?.name ?? "Unknown"} />
                <InfoRow label="Customer" value={license.customer_name} />
                <InfoRow label="Email" value={license.customer_email} />
                <InfoRow label="Status" value={license.status} />
                <InfoRow label="Created" value={new Date(license.created_at).toLocaleString()} />
                <InfoRow label="Expiration" value={license.license_type === "lifetime" ? "Never" : license.expiration_date ? new Date(license.expiration_date).toLocaleDateString() : "N/A"} />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-semibold">Validation Info</h4>
              <div className="space-y-2">
                <InfoRow label="Max Validations" value={license.max_validations === -1 ? "Unlimited" : String(license.max_validations)} />
                <InfoRow label="Current Validations" value={String(license.current_validations)} />
                <InfoRow label="Allowed Deployments" value={String(license.allowed_deployments)} />
              </div>
            </div>

            {license.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-3 text-sm font-semibold">Notes</h4>
                  <p className="text-sm text-muted-foreground">{license.notes}</p>
                </div>
              </>
            )}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}
