import {
  LayoutDashboard,
  Key,
  Package,
  Server,
  BarChart3,
  ScrollText,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  roles?: ("developer" | "administrator")[]
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Licenses",
    href: "/licenses",
    icon: Key,
  },
  {
    title: "Plugins",
    href: "/plugins",
    icon: Package,
  },
  {
    title: "Deployments",
    href: "/deployments",
    icon: Server,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Audit Logs",
    href: "/audit-logs",
    icon: ScrollText,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: ["developer"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]
