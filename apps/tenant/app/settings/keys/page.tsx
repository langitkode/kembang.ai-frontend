"use client";

import { useEffect, useState } from "react";
import {
  Key,
  Plus,
  Copy,
  RotateCw,
  Trash2,
  ShieldCheck,
  Eye,
  Lock,
  Info,
  Loader2,
  Check,
} from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKey();
  }, []);

  async function fetchKey() {
    try {
      setLoading(true);
      const data = await api.getApiKey();
      setApiKey(data.api_key);
    } catch (error) {
      console.error("Failed to fetch API key:", error);
    } finally {
      setLoading(false);
    }
  }

  async function generateKey() {
    if (
      !confirm(
        "Are you sure you want to generate a new API key? The old key will immediately stop working."
      )
    )
      return;

    try {
      setGenerating(true);
      const data = await api.generateApiKey();
      setApiKey(data.api_key);
    } catch (error) {
      console.error("Failed to generate API key:", error);
    } finally {
      setGenerating(false);
    }
  }

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            API Key Management
          </h2>
          <p className="text-muted-foreground text-sm">
            Global access keys for the Kembang AI Engine.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-3.5 h-3.5" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
              <DialogDescription>
                Are you sure you want to generate a new API key? The old key will immediately stop working. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button 
                onClick={generateKey} 
                disabled={generating}
                className="gap-2"
              >
                {generating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Generate Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm uppercase tracking-widest">
                    Active Auth Keys
                  </CardTitle>
                  <CardDescription>
                    Manage your tenant API keys
                  </CardDescription>
                </div>
                <Badge variant={loading ? "secondary" : apiKey ? "default" : "outline"}>
                  {loading ? "Checking..." : apiKey ? "1 Key Active" : "0 Keys"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="p-12 text-center text-muted-foreground font-mono text-xs flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  Fetching secure credentials...
                </div>
              ) : !apiKey ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-card/50 border mx-auto flex items-center justify-center">
                    <Key className="w-7 h-7 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-muted-foreground/70">
                      No API keys found
                    </p>
                    <p className="text-xs text-muted-foreground/40 max-w-sm">
                      Generate an API key to enable secure access to the Kembang AI API.
                    </p>
                  </div>
                  <Button onClick={generateKey} disabled={generating} className="gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    Generate First Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-accent/10 border-accent/20">
                        <Key className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Tenant API Key</p>
                        <Badge variant="outline" className="mt-1 font-mono text-xs">
                          LIVE_ENV_DEPLOYMENT
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={generateKey} title="Rotate Key">
                        <RotateCw className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" disabled title="Delete (not available)">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-card border rounded-lg font-mono text-xs">
                    <Lock className="w-3.5 h-3.5 text-accent" />
                    <span className="flex-1 truncate select-all">
                      {showKey ? apiKey : "sk_live_" + "•".repeat(Math.max(0, apiKey.length - 8))}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setShowKey(!showKey)}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                      Full Access Permissions
                    </span>
                    <span className="text-muted-foreground/60">Always Active</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Alert className="bg-yellow-500/5 border-yellow-500/20">
            <Info className="w-4 h-4 text-yellow-500" />
            <AlertTitle className="text-yellow-600 dark:text-yellow-400">Security Warning</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Global Keys have unrestricted access to all endpoints. Do not share these keys or expose them in client-side code. For widget integrations, provide this key securely to the SDK initialization.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest">
                Key Rotation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground font-mono">
                Keys should be rotated every 90 days. Next scheduled maintenance:{" "}
                <span className="text-accent font-bold">
                  {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                </span>
              </p>
              <Button variant="outline" className="w-full" disabled>
                Configure Policy (Enterprise)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest">
                Permission Scopes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "RAG_READ", access: true },
                { label: "RAG_WRITE", access: true },
                { label: "TENANT_ADMIN", access: true },
                { label: "LOG_VIEWER", access: true },
              ].map((scope) => (
                <div
                  key={scope.label}
                  className={`flex justify-between items-center font-mono text-xs ${scope.access ? "" : "text-muted-foreground opacity-40"}`}
                >
                  <span>{scope.label}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${scope.access ? "bg-accent shadow-[0_0_4px_rgba(100,100,255,0.5)]" : "bg-card"}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
