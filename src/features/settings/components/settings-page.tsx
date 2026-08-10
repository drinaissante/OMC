import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Save, Key, Shield, Palette, Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your licensing platform</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general"><Settings className="mr-2 h-4 w-4" />General</TabsTrigger>
          <TabsTrigger value="license"><Key className="mr-2 h-4 w-4" />License</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4" />Security</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" />Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="OMC License Manager" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input type="email" defaultValue="support@example.com" />
                </div>
              </div>
              <Button onClick={() => toast.success("Settings saved")}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="license">
          <Card>
            <CardHeader>
              <CardTitle>License Defaults</CardTitle>
              <CardDescription>Default values for new licenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label>Default License Type</Label>
                  <Input defaultValue="subscription" />
                </div>
                <div className="space-y-2">
                  <Label>Default Max Validations</Label>
                  <Input type="number" defaultValue={-1} />
                </div>
                <div className="space-y-2">
                  <Label>Default Allowed Deployments</Label>
                  <Input type="number" defaultValue={1} />
                </div>
                <div className="space-y-2">
                  <Label>License Key Prefix</Label>
                  <Input defaultValue="OMS" />
                </div>
              </div>
              <Button onClick={() => toast.success("License defaults saved")}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Authentication and security configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input type="number" defaultValue={5} />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (seconds)</Label>
                  <Input type="number" defaultValue={3600} />
                </div>
              </div>
              <Separator />
              <Button onClick={() => toast.success("Security settings saved")}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Theme and appearance settings are managed via the theme toggle in the top navigation bar.
                The dashboard supports dark mode by default with an emerald green accent color scheme.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
