import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateLicenseSchema, type GenerateLicenseFormValues } from "../schemas/license-form-schema"
import { useCreateLicense } from "../hooks/use-licenses"
import { generateLicenseKey } from "@/lib/license-key"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface GenerateLicenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GenerateLicenseModal({ open, onOpenChange }: GenerateLicenseModalProps) {
  const createLicense = useCreateLicense()
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { data: plugins } = useQuery({
    queryKey: ["plugins", "list"],
    queryFn: async () => {
      const { data } = await supabase.from("plugins").select("id, name").eq("status", "active").order("name")
      return data ?? []
    },
    enabled: open,
  })

  const form = useForm<GenerateLicenseFormValues>({
    resolver: zodResolver(generateLicenseSchema),
    defaultValues: {
      plugin_id: "",
      customer_name: "",
      customer_email: "",
      license_type: "subscription",
      max_validations: -1,
      allowed_deployments: 1,
      notes: "",
    },
  })

  function onSubmit(values: GenerateLicenseFormValues) {
    const key = generateLicenseKey()
    createLicense.mutate(
      {
        license_key: key,
        plugin_id: values.plugin_id,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        license_type: values.license_type,
        expiration_date: values.license_type === "lifetime" ? null : values.expiration_date || null,
        max_validations: values.max_validations,
        allowed_deployments: values.allowed_deployments,
        notes: values.notes || null,
      },
      {
        onSuccess: () => {
          setGeneratedKey(key)
          form.reset()
        },
      }
    )
  }

  function handleCopy() {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey)
      setCopied(true)
      toast.success("License key copied")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleClose() {
    onOpenChange(false)
    setGeneratedKey(null)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-130">
        {generatedKey ? (
          <>
            <DialogHeader>
              <DialogTitle>License Generated</DialogTitle>
              <DialogDescription>Copy this license key and share it with the customer.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-4">
              <code className="flex-1 font-mono text-sm">{generatedKey}</code>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Generate License</DialogTitle>
              <DialogDescription>Create a new license key for a customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plugin_id">Plugin</Label>
                <Select value={form.watch("plugin_id")} onValueChange={(v) => { if (v) form.setValue("plugin_id", v) }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plugin" />
                  </SelectTrigger>
                  <SelectContent>
                    {plugins?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.plugin_id && (
                  <p className="text-xs text-destructive">{form.formState.errors.plugin_id.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input id="customer_name" {...form.register("customer_name")} placeholder="John Doe" />
                  {form.formState.errors.customer_name && (
                    <p className="text-xs text-destructive">{form.formState.errors.customer_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_email">Customer Email</Label>
                  <Input id="customer_email" type="email" {...form.register("customer_email")} placeholder="john@example.com" />
                  {form.formState.errors.customer_email && (
                    <p className="text-xs text-destructive">{form.formState.errors.customer_email.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>License Type</Label>
                  <Select value={form.watch("license_type")} onValueChange={(v) => { if (v) form.setValue("license_type", v as "lifetime" | "subscription" | "trial") }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.watch("license_type") !== "lifetime" && (
                  <div className="space-y-2">
                    <Label htmlFor="expiration_date">Expiration Date</Label>
                    <Input id="expiration_date" type="date" {...form.register("expiration_date")} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allowed_deployments">Allowed Deployments</Label>
                  <Input id="allowed_deployments" type="number" min={1} {...form.register("allowed_deployments", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_validations">Max Validations</Label>
                  <Input id="max_validations" type="number" min={-1} {...form.register("max_validations", { valueAsNumber: true })} placeholder="-1 for unlimited" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...form.register("notes")} placeholder="Optional notes..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={createLicense.isPending}>
                {createLicense.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
