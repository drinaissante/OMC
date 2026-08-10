import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router"
import { navItems } from "@/shared/config/navigation"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Menu, ChevronLeft, ChevronRight } from "lucide-react"

export function AppSidebar() {
  const location = useLocation()
  const { profile } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true
    return profile?.role && item.roles.includes(profile.role)
  })

  function NavLink({ item, onClick }: { item: (typeof filteredItems)[number]; onClick?: () => void }) {
    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/")
    const Icon = item.icon

    const content = (
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{item.title}</span>}
      </Link>
    )

    if (collapsed && !isMobile) {
      return (
        <Tooltip>
          <TooltipTrigger render={content} />
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      )
    }

    return content
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">O</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold">OMC</span>
          )}
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <NavLink key={item.href} item={item} onClick={() => setMobileOpen(false)} />
          ))}
        </nav>
      </ScrollArea>
      {!isMobile && (
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3.5 z-40 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-70 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-sidebar transition-all duration-300",
          collapsed ? "w-17" : "w-65"
        )}
      >
        {sidebarContent}
      </aside>
    </TooltipProvider>
  )
}
