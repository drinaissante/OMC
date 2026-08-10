import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "../hooks/use-auth"
import type { Role } from "@/shared/types/roles"
import { Skeleton } from "@/components/ui/skeleton"
import { STORAGE_KEYS } from "@/lib/constants"

interface ProtectedRouteProps {
  requiredRole?: Role
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    try {
      sessionStorage.setItem(STORAGE_KEYS.RETURN_TO, location.pathname + location.search)
    } catch (e) {
      // ignore storage access errors
    }
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
