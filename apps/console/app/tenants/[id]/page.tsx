"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";
import {
  ArrowLeft,
  Bot,
  Users,
  BookOpen,
  Key,
  Calendar,
  Activity,
  Loader2,
  Trash2,
  Edit,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { toast } from "sonner";

interface Tenant {
  id: string;
  name: string;
  plan: string;
  api_key_masked: string | null;
  api_key_full?: string;
  user_count: number;
  doc_count: number;
  created_at: string | null;
  updated_at: string | null;
  status: "active" | "suspended" | "pending";
}

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchTenant();
  }, [token, tenantId]);

  async function fetchTenant() {
    try {
      setLoading(true);
      const data = await api.listAllTenants();
      const found = data.tenants?.find((t: any) => t.id === tenantId);
      if (found) {
        setTenant(found);
      } else {
        toast.error("Tenant not found");
        router.push("/tenants");
      }
    } catch (error: any) {
      console.error("Failed to fetch tenant:", error);
      toast.error("Failed to load tenant details");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await api.deleteTenant(tenantId);
      toast.success("Tenant deleted successfully");
      router.push("/tenants");
    } catch (error: any) {
      console.error("Failed to delete tenant:", error);
      toast.error("Failed to delete tenant");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  const copyApiKey = () => {
    if (tenant?.api_key_full) {
      navigator.clipboard.writeText(tenant.api_key_full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("API key copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!tenant) {
    return null;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/tenants")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
            <p className="text-xs font-mono text-muted-foreground">
              {tenant.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/kb?tenant=${tenantId}`)}
          >
            <BookOpen className="w-3.5 h-3.5 mr-2" />
            KB
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/chat?tenant=${tenantId}`)}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-2" />
            Chat
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="w-3.5 h-3.5 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Tenant</DialogTitle>
                <DialogDescription>
                  Update tenant information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-id" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Tenant ID
                  </Label>
                  <Input 
                    id="tenant-id" 
                    defaultValue={tenant.id}
                    disabled
                    className="bg-muted/20 border-border font-mono text-xs"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="name">Tenant Name</Label>
                  <Input 
                    id="name" 
                    defaultValue={tenant.name}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Subscription Plan</Label>
                  <select
                    id="plan"
                    defaultValue={tenant.plan}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Tenant</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{tenant.name}"? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting && (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  )}
                  Delete Tenant
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className={`
                    ${tenant.status === "active" ? "text-green-500 border-green-500/50" : ""}
                    ${tenant.status === "suspended" ? "text-red-500 border-red-500/50" : ""}
                    ${tenant.status === "pending" ? "text-yellow-500 border-yellow-500/50" : ""}
                  `}
                >
                  {tenant.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Plan</p>
                <p className="text-lg font-semibold capitalize">{tenant.plan}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Users</p>
                <p className="text-lg font-semibold">{tenant.user_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Documents</p>
                <p className="text-lg font-semibold">{tenant.doc_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                Users
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tenant.user_count}</p>
            <p className="text-xs text-muted-foreground mt-1">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                Documents
              </CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tenant.doc_count}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Knowledge base items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                API Access
              </CardTitle>
              <Key className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {tenant.api_key_masked ? "✓" : "✗"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {tenant.api_key_masked ? "Configured" : "Not configured"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Key Section */}
      {tenant.api_key_masked && (
        <Card className="bg-muted/20 border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">API Key</CardTitle>
                <CardDescription>
                  Use this key to authenticate API requests for this tenant
                </CardDescription>
              </div>
              <Key className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-background/50 border border-border/60 rounded-lg font-mono text-xs">
              <Key className="w-4 h-4 text-accent" />
              <span className="flex-1 truncate text-muted-foreground">
                {showApiKey && tenant.api_key_full
                  ? tenant.api_key_full
                  : tenant.api_key_masked}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-7 text-xs"
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyApiKey}
                  disabled={!tenant.api_key_full}
                  className="h-7 text-xs"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
            <Alert className="bg-yellow-500/5 border-yellow-500/20">
              <AlertTitle className="text-xs">Security Notice</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Keep your API key secure. Do not share it or expose it in
                client-side code.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-accent/30 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <Link
              href={`/kb?tenant=${tenantId}`}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">Manage Knowledge Base</p>
                <p className="text-xs text-muted-foreground">
                  Upload and manage documents
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-accent/30 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <Link
              href={`/chat?tenant=${tenantId}`}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">View Conversations</p>
                <p className="text-xs text-muted-foreground">
                  Monitor chat activity
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
            </Link>
          </CardContent>
        </Card>

        <Card
          className="hover:border-red-500/30 transition-colors cursor-pointer"
          onClick={() => setShowDeleteDialog(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-500">
                  Delete Tenant
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently remove
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
