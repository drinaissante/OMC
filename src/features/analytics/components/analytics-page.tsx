import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const COLORS = ["hsl(163,55%,45%)", "hsl(0,72%,51%)", "hsl(262,83%,58%)", "hsl(155,65%,50%)", "hsl(200,75%,50%)", "hsl(45,93%,47%)"]

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function TooltipStyle() {
  return { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)

  const { data: validations, isLoading: vLoading } = useQuery({
    queryKey: ["analytics", "validations", days],
    queryFn: async () => {
      const start = new Date(Date.now() - days * 86400000).toISOString()
      const { data } = await supabase.from("validations").select("created_at, status").gte("created_at", start).order("created_at")
      const grouped: Record<string, { success: number; failure: number }> = {}
      for (const v of data ?? []) {
        const day = v.created_at.split("T")[0]
        if (!grouped[day]) grouped[day] = { success: 0, failure: 0 }
        if (v.status === "success") grouped[day].success++
        else grouped[day].failure++
      }
      return Object.entries(grouped).map(([date, v]) => ({ date, ...v }))
    },
  })

  const { data: geo, isLoading: gLoading } = useQuery({
    queryKey: ["analytics", "geo"],
    queryFn: async () => {
      const { data } = await supabase.from("deployments").select("country").not("country", "is", null)
      const counts: Record<string, number> = {}
      for (const d of data ?? []) counts[d.country!] = (counts[d.country!] ?? 0) + 1
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }))
    },
  })

  const { data: plugins, isLoading: pLoading } = useQuery({
    queryKey: ["analytics", "plugins"],
    queryFn: async () => {
      const { data } = await supabase.from("licenses").select("plugin_id, plugins(name)")
      const counts: Record<string, number> = {}
      for (const l of data ?? []) {
        const name = (l.plugins as { name: string } | null)?.name ?? "Unknown"
        counts[name] = (counts[name] ?? 0) + 1
      }
      return Object.entries(counts).map(([name, value]) => ({ name, value }))
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Platform usage and distribution insights</p>
        </div>
        <Select value={String(days)} onValueChange={(v) => { if (v) setDays(Number(v)) }}>
          <SelectTrigger className="w-35"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Daily Validations">
          {vLoading ? <Skeleton className="h-75" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={validations}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={TooltipStyle()} />
                <Area type="monotone" dataKey="success" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3} name="Success" />
                <Area type="monotone" dataKey="failure" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.3} name="Failure" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Plugin Popularity">
          {pLoading ? <Skeleton className="h-75" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={plugins} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={100} />
                <Tooltip contentStyle={TooltipStyle()} />
                <Bar dataKey="value" fill={COLORS[2]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Geographic Distribution">
          {gLoading ? <Skeleton className="h-75" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={geo} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {(geo ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TooltipStyle()} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Active Installations">
          {vLoading ? <Skeleton className="h-75" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={validations?.map((d) => ({ date: d.date.slice(5), count: d.success })) ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={TooltipStyle()} />
                <Bar dataKey="count" fill={COLORS[4]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
