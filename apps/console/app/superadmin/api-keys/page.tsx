"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Key,
  Shield,
  AlertTriangle,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Trash2,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface Tenant {
  id: string;
  name: string;
}

interface ApiKey {
  id: string;
  tenant_id: string;
  tenant_name: string;
  key_masked: string;
  created_at: string;
  is_active: boolean;
  last_used_at: string | null;
}

export default function SuperadminApiKeysPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>("all");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRevoke, setShowRevoke] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [selectedTenant]);

  async function fetchTenants() {
    try {
      const data = await api.listAllTenants();
      setTenants(data.tenants || []);
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
    }
  }

  async function fetchApiKeys() {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedTenant !== "all") {
        params.tenant_id = selectedTenant;
      }
      const data = await api.getApiKeys(params);
      setApiKeys(data.api_keys || []);
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke() {
    if (!selectedKey) return;

    try {
      setRevoking(true);
      await api.revokeApiKey(selectedKey.id);
      await fetchApiKeys();
      setShowRevoke(false);
      toast.success("API key revoked successfully");
    } catch (error) {
      console.error("Failed to revoke API key:", error);
      toast.error("Failed to revoke API key");
    } finally {
      setRevoking(false);
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  const filteredKeys = apiKeys.filter((key) => {
    const matchesSearch =
      key.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.key_masked.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && key.is_active) ||
      (filterStatus === "inactive" && !key.is_active);

    return matchesSearch && matchesStatus;
  });

  const activeKeys = apiKeys.filter((k) => k.is_active).length;
  const inactiveKeys = apiKeys.filter((k) => !k.is_active).length;

  return (
    <TooltipProvider>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-start border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Key className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              {selectedTenant === "all"
                ? "Select a tenant to view their API keys."
                : "Monitor and manage API keys for selected tenant."}
            </p>
          </div>
          <Select value={selectedTenant} onValueChange={setSelectedTenant}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Tenant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tenants</SelectItem>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Key className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Keys
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? "—" : apiKeys.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-green-500">
                    {loading ? "—" : activeKeys}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted/20 border flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Inactive
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? "—" : inactiveKeys}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Alert */}
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">
                Security Notice
              </p>
              <p className="text-xs text-yellow-500/80 leading-relaxed">
                API keys provide full access to tenant resources. Revoke compromised keys immediately.
                Keys are masked for security - only partial key is shown.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tenant or key..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* API Keys List */}
        {loading ? (
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground font-mono">
                Loading API keys...
              </p>
            </CardContent>
          </Card>
        ) : filteredKeys.length === 0 ? (
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted/30 border flex items-center justify-center">
                <Key className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-muted-foreground/70">
                  No API keys found
                </p>
                <p className="text-xs text-muted-foreground/40 max-w-sm">
                  {selectedTenant === "all"
                    ? "Please select a tenant from the dropdown to view their API keys."
                    : apiKeys.length === 0
                    ? "This tenant has not generated any API keys yet."
                    : "Try adjusting your filters or search query."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[500px] border rounded-lg">
            <div className="p-4 space-y-3">
              {filteredKeys.map((key) => (
                <Card key={key.id} className="hover:border-accent/30 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                          <Key className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge
                              variant="outline"
                              className={
                                key.is_active
                                  ? "text-green-500 border-green-500/50"
                                  : "text-muted-foreground border-muted-foreground/50"
                              }
                            >
                              {key.is_active ? (
                                <>
                                  <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-2.5 h-2.5 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                            <span className="text-sm font-semibold">
                              {key.tenant_name || key.tenant_id.substring(0, 12)}...
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-card border rounded-lg font-mono text-xs">
                              <Shield className="w-3.5 h-3.5 text-accent" />
                              <span className="flex-1 truncate">
                                {key.key_masked}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(key.key_masked, key.id)}
                                >
                                  {copiedId === key.id ? (
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Activity className="w-3 h-3" />
                                  Created: {new Date(key.created_at).toLocaleDateString()}
                                </span>
                                {key.last_used_at && (
                                  <span className="flex items-center gap-1">
                                    <Activity className="w-3 h-3" />
                                    Last used: {new Date(key.last_used_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {key.is_active && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedKey(key);
                                    setShowRevoke(true);
                                  }}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                                  Revoke
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Revoke Confirmation Dialog */}
        <Dialog open={showRevoke} onOpenChange={setShowRevoke}>
          <DialogContent>
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <DialogTitle className="text-center">Revoke API Key</DialogTitle>
              <DialogDescription className="text-center">
                Are you sure you want to revoke the API key for{" "}
                <span className="font-semibold">{selectedKey?.tenant_name}</span>?
                This action cannot be undone and the tenant will need to generate a new key.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex sm:justify-center gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowRevoke(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRevoke}
                disabled={revoking}
                className="gap-2"
              >
                {revoking ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Revoke Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Info Card */}
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Superadmin View
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are viewing API keys from all tenants. Revoke keys only when necessary (security breach, tenant request).
                Tenants can generate new keys from their dashboard if needed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
