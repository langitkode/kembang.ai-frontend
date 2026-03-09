"use client";

import {
  Settings,
  Globe,
  ShieldAlert,
  Bell,
  BrainCircuit,
  Database,
  ArrowRight,
  Save,
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

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground text-sm">
            Global configuration for the Kembang AI ecosystem.
          </p>
        </div>
        <Button className="gap-2">
          <Save className="w-3.5 h-3.5" />
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Configuration */}
        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Core Engine
              </h3>
              <Badge variant="outline">Production</Badge>
            </div>
            <Card>
              <CardContent className="p-0 divide-y">
                {[
                  {
                    icon: BrainCircuit,
                    title: "Default LLM Provider",
                    desc: "Active: groq/llama-3.1-8b-instant",
                    action: (
                      <Select defaultValue="groq">
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="groq">Groq</SelectItem>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                        </SelectContent>
                      </Select>
                    ),
                  },
                  {
                    icon: Database,
                    title: "Embedding Vector Cache",
                    desc: "TTL: 3600s, Max Size: 10k vectors",
                    action: <Badge variant="secondary">Enabled</Badge>,
                  },
                  {
                    icon: ShieldAlert,
                    title: "RAG Security Level",
                    desc: "Strict Tenant Isolation",
                    action: <Badge variant="outline">Strict</Badge>,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border rounded-lg flex items-center justify-center bg-muted/20">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    {item.action}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Infrastructure Deployment
            </h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted-foreground">Environment Mode</span>
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    PRODUCTION
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted-foreground">Instance Serial</span>
                  <span className="font-semibold">kw_node_bali_primary_01</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted-foreground">Release Version</span>
                  <span className="text-muted-foreground">
                    0.2.0-stable
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Global Notifications & Integration */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Integration & Alerts
            </h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-url" className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    Base URL Override
                  </Label>
                  <Input
                    id="base-url"
                    placeholder="https://api.kembang.ai/v1"
                    defaultValue="https://api.kembang.ai/v1"
                    className="font-mono"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">Health Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Alert when latency exceeds 2.5s
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">Cleanup Routines</p>
                      <p className="text-xs text-muted-foreground">
                        Purge temp KB files weekly
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
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
                Resetting the system will wipe all global settings and invalidate all API keys. This action is irreversible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full">
                Master Reset (Invalidate All)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
