import { createBrowserRouter } from "react-router"
import { AppLayout } from "@/shared/components/layout/app-layout"
import { ProtectedRoute } from "@/features/auth/components/protected-route"
import { RouteError } from "@/shared/components/route-error"
import { NotFoundPage } from "@/shared/components/not-found-page"
import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-30 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-100 rounded-lg" />
    </div>
  )
}

const SignInPage = lazy(() => import("@/features/auth/components/sign-in-form"))
const RegisterPage = lazy(() => import("@/features/auth/components/register-form"))
const DashboardPage = lazy(() => import("@/features/dashboard/components/dashboard-page"))
const LicensesPage = lazy(() => import("@/features/licenses/components/licenses-page"))
const PluginsPage = lazy(() => import("@/features/plugins/components/plugins-page"))
const DeploymentsPage = lazy(() => import("@/features/deployments/components/deployments-page"))
const AnalyticsPage = lazy(() => import("@/features/analytics/components/analytics-page"))
const AuditLogsPage = lazy(() => import("@/features/audit-logs/components/audit-logs-page"))
const UsersPage = lazy(() => import("@/features/users/components/users-page"))
const SettingsPage = lazy(() => import("@/features/settings/components/settings-page"))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: (
      <SuspenseWrapper>
        <SignInPage />
      </SuspenseWrapper>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/register",
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
    errorElement: <RouteError />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <RouteError />,
        children: [
          {
            path: "/dashboard",
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/licenses",
            element: (
              <SuspenseWrapper>
                <LicensesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/plugins",
            element: (
              <SuspenseWrapper>
                <PluginsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/deployments",
            element: (
              <SuspenseWrapper>
                <DeploymentsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/analytics",
            element: (
              <SuspenseWrapper>
                <AnalyticsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/audit-logs",
            element: (
              <SuspenseWrapper>
                <AuditLogsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/users",
            element: (
              <SuspenseWrapper>
                <UsersPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/settings",
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <RouteError />,
        children: [
          {
            index: true,
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
])
