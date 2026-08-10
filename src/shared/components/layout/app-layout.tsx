import { Outlet } from "react-router"
import { AppSidebar } from "./app-sidebar"
import { AppTopbar } from "./app-topbar"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "[" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCollapsed((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          !isMobile && (collapsed ? "pl-17" : "pl-65")
        )}
      >
        <AppTopbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
