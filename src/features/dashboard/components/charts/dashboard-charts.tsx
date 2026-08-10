import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["hsl(163, 55%, 45%)", "hsl(0, 72%, 51%)", "hsl(262, 83%, 58%)", "hsl(155, 65%, 50%)", "hsl(200, 75%, 50%)"]

interface ChartCardProps {
  title: string
  children: React.ReactNode
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

interface ValidationsChartProps {
  data: Array<{ date: string; success: number; failure: number }>
}

export function ValidationsChart({ data }: ValidationsChartProps) {
  return (
    <ChartCard title="Daily License Validations">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Area type="monotone" dataKey="success" stackId="1" stroke="hsl(163, 55%, 45%)" fill="hsl(163, 55%, 45%)" fillOpacity={0.3} name="Success" />
          <Area type="monotone" dataKey="failure" stackId="1" stroke="hsl(0, 72%, 51%)" fill="hsl(0, 72%, 51%)" fillOpacity={0.3} name="Failure" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface PluginChartProps {
  data: Array<{ name: string; count: number }>
}

export function PluginInstallationsChart({ data }: PluginChartProps) {
  return (
    <ChartCard title="Plugin Installations">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <YAxis type="category" dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} width={100} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="count" fill="hsl(163, 55%, 45%)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface ValidationRateProps {
  successRate: number
  failureRate: number
}

export function ValidationRateChart({ successRate, failureRate }: ValidationRateProps) {
  const data = [
    { name: "Success", value: successRate, fill: COLORS[0] },
    { name: "Failure", value: failureRate, fill: COLORS[1] },
  ]

  return (
    <ChartCard title="Validation Success Rate">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
          Success ({successRate}%)
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
          Failure ({failureRate}%)
        </div>
      </div>
    </ChartCard>
  )
}
