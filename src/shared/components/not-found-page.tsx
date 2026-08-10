import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Compass } from "lucide-react"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold tracking-tight text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button className="mt-6">
          <Compass className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>
      </Link>
    </div>
  )
}
