import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useReactTable, getCoreRowModel, type ColumnDef } from "@tanstack/react-table"
import { supabase } from "@/integrations/supabase/client"
import { DataTable } from "@/shared/components/data-table/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Plus, MoreHorizontal, Shield, UserX, UserCheck } from "lucide-react"
import type { Role } from "@/shared/types/roles"

interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  status: "active" | "disabled"
  last_login_at: string | null
  created_at: string
}

export default function UsersPage() {
  const qc = useQueryClient()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("administrator")
  const [inviting, setInviting] = useState(false)

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      return (data ?? []) as AdminUser[]
    },
  })

  const toggleStatus = useMutation({
    mutationFn: async (user: AdminUser) => {
      const newStatus = user.status === "active" ? "disabled" : "active"
      const { error } = await supabase.from("users").update({ status: newStatus }).eq("id", user.id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); toast.success("User updated") },
    onError: () => toast.error("Failed to update user"),
  })

  const changeRole = useMutation({
    mutationFn: async ({ user, newRole }: { user: AdminUser; newRole: Role }) => {
      const { error } = await supabase.from("users").update({ role: newRole }).eq("id", user.id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); toast.success("Role changed") },
    onError: () => toast.error("Failed to change role"),
  })

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    try {
      const tempPassword = crypto.randomUUID().slice(0, 12)
      const { error } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: { name, role },
        },
      })
      if (error) throw error
      toast.success("User created — they will receive a confirmation email")
      setInviteOpen(false)
      setName("")
      setEmail("")
      setRole("administrator")
      qc.invalidateQueries({ queryKey: ["users"] })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user")
    } finally {
      setInviting(false)
    }
  }

  const columns: ColumnDef<AdminUser, unknown>[] = useMemo(() => [
    {
      accessorKey: "name", header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    { accessorKey: "email", header: "Email", cell: ({ row }) => <span className="text-sm">{row.original.email}</span> },
    {
      accessorKey: "role", header: "Role",
      cell: ({ row }) => <Badge variant={row.original.role === "developer" ? "default" : "info"}>{row.original.role}</Badge>,
    },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      accessorKey: "last_login_at", header: "Last Login",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.last_login_at ? new Date(row.original.last_login_at).toLocaleDateString() : "Never"}</span>,
    },
    {
      accessorKey: "created_at", header: "Created",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{new Date(row.original.created_at).toLocaleDateString()}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
              <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleStatus.mutate(row.original)}>
              {row.original.status === "active" ? <><UserX className="mr-2 h-4 w-4" />Disable</> : <><UserCheck className="mr-2 h-4 w-4" />Enable</>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeRole.mutate({ user: row.original, newRole: row.original.role === "developer" ? "administrator" : "developer" })}>
              <Shield className="mr-2 h-4 w-4" />Toggle Role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [toggleStatus, changeRole])

  const table = useReactTable({ data: users ?? [], columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage administrator accounts</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}><Plus className="mr-2 h-4 w-4" />Invite User</Button>
      </div>
      <DataTable table={table} columns={columns} isLoading={isLoading} emptyTitle="No users" emptyDescription="Invite administrators to get started." />

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleInvite}>
            <DialogHeader>
              <DialogTitle>Invite User</DialogTitle>
              <DialogDescription>Send an invitation to join the admin panel.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => { if (v) setRole(v as Role) }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={inviting}>Send Invitation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
