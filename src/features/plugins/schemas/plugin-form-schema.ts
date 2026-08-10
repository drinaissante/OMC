import { z } from "zod"

export const pluginFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  version: z.string().min(1, "Version is required"),
  documentation_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  licensing_enabled: z.boolean(),
})

export type PluginFormValues = z.infer<typeof pluginFormSchema>
