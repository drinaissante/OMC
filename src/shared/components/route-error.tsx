import { useRouteError, isRouteErrorResponse } from "react-router"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function RouteError() {
  const error = useRouteError()

  const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : "Something went wrong"
  const message = isRouteErrorResponse(error)
    ? error.data?.message ?? "An unexpected error occurred while loading this page."
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred while loading this page."

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => window.location.reload()}>Reload page</Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    </div>
  )
}
