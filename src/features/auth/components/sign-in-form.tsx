import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { signIn } from "@/features/auth/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { STORAGE_KEYS } from "@/lib/constants"

function getRedirectPath(from?: { pathname?: string; search?: string }) {
  const fromPath = from?.pathname ? from.pathname + (from.search ?? "") : null
  if (fromPath) return fromPath
  try {
    const saved = sessionStorage.getItem(STORAGE_KEYS.RETURN_TO)
    if (saved) return saved
  } catch (e) {
    // ignore storage access errors
  }
  return "/dashboard"
}

export default function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function redirectAfterAuth() {
    const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
    const path = getRedirectPath(from)
    try {
      sessionStorage.removeItem(STORAGE_KEYS.RETURN_TO)
    } catch (e) {
      // ignore storage access errors
    }
    navigate(path, { replace: true })
  }

  useEffect(() => {
    if (isAuthenticated) {
      redirectAfterAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success("Signed in successfully")
      redirectAfterAuth()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign in"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-xl font-bold text-primary">O</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your OMC admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-primary underline-offset-4 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
