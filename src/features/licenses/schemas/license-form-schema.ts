import { z } from "zod"

export const generateLicenseSchema = z.object({
  plugin_id: z.string().min(1, "Plugin is required"),
  customer_name: z.string().min(2, "Customer name is required"),
  customer_email: z.string().email("Invalid email address"),
  license_type: z.enum(["lifetime", "subscription", "trial"]),
  expiration_date: z.string().optional(),
  max_validations: z.number().min(-1),
  allowed_deployments: z.number().min(1, "Must allow at least 1 deployment"),
  notes: z.string().optional(),
})

export type GenerateLicenseFormValues = z.infer<typeof generateLicenseSchema>
