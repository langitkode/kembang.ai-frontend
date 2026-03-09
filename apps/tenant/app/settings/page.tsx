"use client";

import {
  Settings,
  Building2,
  Bell,
  Palette,
  Save,
  Mail,
  Clock,
  Languages,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Tenant Settings</h2>
          <p className="text-muted-foreground text-sm">
            Manage your tenant profile and preferences.
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-3.5 h-3.5" />
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tenant Profile */}
        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Tenant Profile
              </h3>
              <Badge variant="outline" className="text-accent border-accent/30">
                Active
              </Badge>
            </div>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-name" className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    Business Name
                  </Label>
                  <Input
                    id="tenant-name"
                    defaultValue={user?.tenant_id ? `Tenant ${user.tenant_id.substring(0, 8)}` : "My Business"}
                    placeholder="e.g., Coffee Shop Bali"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="tenant-email" className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    Contact Email
                  </Label>
                  <Input
                    id="tenant-email"
                    type="email"
                    defaultValue={user?.email}
                    placeholder="contact@business.com"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="tenant-desc" className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5" />
                    Business Description
                  </Label>
                  <Textarea
                    id="tenant-desc"
                    placeholder="Describe your business..."
                    rows={3}
                    defaultValue="We provide quality products and services for our customers."
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Notifications
            </h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive updates about your chatbot
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">Weekly Reports</p>
                      <p className="text-xs text-muted-foreground">
                        Get weekly usage summaries
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Preferences
            </h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <Languages className="w-3.5 h-3.5" />
                    Language
                  </Label>
                  <Select defaultValue="id">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Timezone
                  </Label>
                  <Select defaultValue="asia/jakarta">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/jakarta">WIB (UTC+7)</SelectItem>
                      <SelectItem value="asia/makassar">WITA (UTC+8)</SelectItem>
                      <SelectItem value="asia/jayapura">WIT (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Appearance
            </h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">
                        Use dark theme for dashboard
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Brand Color</Label>
                  <div className="flex gap-2">
                    {["#7c3aed", "#2563eb", "#059669", "#dc2626"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-md border-2 border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-red-500 uppercase tracking-widest">
                Danger Zone
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Deactivating your tenant will disable all services and API access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full" disabled>
                Deactivate Tenant (Contact Support)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
