import { useNavigate } from "react-router"
import { useTheme } from "@/shared/hooks/use-theme"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserNav } from "./user-nav"
import { formatRelativeTime } from "@/components/status-badge"
import { Sun, Moon, Bell, Check, Info, AlertTriangle, XCircle, CheckCheck } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/use-auth"
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useNotificationsRealtime,
} from "@/features/notifications/hooks/use-notifications"
import type { Notification } from "@/features/notifications/api/notifications"

const notificationMeta: Record<Notification["type"], { icon: typeof Info; iconColor: string }> = {
  success: { icon: Check, iconColor: "text-emerald-500" },
  warning: { icon: AlertTriangle, iconColor: "text-amber-500" },
  error: { icon: XCircle, iconColor: "text-red-500" },
  info: { icon: Info, iconColor: "text-muted-foreground" },
}

export function AppTopbar() {
  const { theme, toggleTheme } = useTheme()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { data: notifications = [] } = useNotifications()
  const { data: unreadCount = 0 } = useUnreadCount()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()
  useNotificationsRealtime(profile?.id)

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <DropdownMenuItem className="cursor-default justify-center py-6 text-sm text-muted-foreground">
                  No notifications
                </DropdownMenuItem>
              ) : (
                notifications.map((n) => {
                  const meta = notificationMeta[n.type]
                  return (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex items-start gap-3 py-3"
                      onSelect={() => {
                        if (!n.read) markAsRead.mutate(n.id)
                      }}
                    >
                      <meta.icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.iconColor}`} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(n.created_at)}</p>
                      </div>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </DropdownMenuItem>
                  )
                })
              )}
            </DropdownMenuGroup>
            {unreadCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-xs text-primary"
                  onSelect={() => markAllAsRead.mutate()}
                >
                  <CheckCheck className="mr-2 h-3 w-3" />
                  Mark all as read
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-xs text-primary"
              onSelect={() => navigate("/audit-logs")}
            >
              View all activity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserNav />
      </div>
    </header>
  )
}
