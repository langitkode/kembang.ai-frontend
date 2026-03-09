"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import {
  Bot,
  Plus,
  BookOpen,
  Key,
  MessageSquare,
  CheckCircle2,
  Clock,
  MoreVertical,
  Loader2,
  ExternalLink,
  Zap,
  Users,
  X,
  Trash2,
  Edit,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TenantInfo {
  id: string;
  name: string;
  plan: string;
  api_key_masked: string | null;
  user_count: number;
  doc_count: number;
  created_at: string | null;
}

export default function ChatbotsPage() {
  const { token } = useAuth();
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    admin_email: "",
    admin_password: "",
  });

  const [selectedTenant, setSelectedTenant] = useState<TenantInfo | null>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    plan: "",
  });

  async function fetchData() {
    try {
      setLoading(true);
      const data = await api.listAllTenants();
      setTenants(data.tenants || []);
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  async function handleCreate() {
    if (!form.name || !form.admin_email || !form.admin_password) return;
    setCreating(true);
    try {
      await api.createTenant(form);
      setShowCreate(false);
      setForm({ name: "", admin_email: "", admin_password: "" });
      await fetchData(); // refresh list
      toast.success("Tenant created successfully");
    } catch (error) {
      console.error("Failed to create tenant:", error);
      toast.error("Failed to create tenant");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate() {
    if (!selectedTenant) return;
    setUpdating(true);
    try {
      await api.updateTenant(selectedTenant.id, editForm);
      setShowEdit(false);
      await fetchData();
      toast.success("Tenant updated successfully");
    } catch (error) {
      console.error("Failed to update tenant:", error);
      toast.error("Failed to update tenant");
    } finally {
      setUpdating(false);
    }
  }

  function openEdit(t: TenantInfo) {
    setSelectedTenant(t);
    setEditForm({ name: t.name, plan: t.plan });
    setShowEdit(true);
  }

  function getStatus(t: TenantInfo) {
    if (!t.api_key_masked)
      return {
        label: "No API Key",
        color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      };
    if (t.doc_count === 0)
      return {
        label: "No KB Docs",
        color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
      };
    return {
      label: "Live",
      color: "text-green-500 bg-green-500/10 border-green-500/20",
    };
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-start border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Chatbots</h2>
          <p className="text-muted-foreground text-sm">
            Manage all chatbot instances across the platform.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-3.5 h-3.5" />
          New Chatbot
        </Button>
      </header>

      {loading ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground font-mono">
              Loading chatbot instances...
            </p>
          </CardContent>
        </Card>
      ) : tenants.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted/30 border flex items-center justify-center">
              <Bot className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-muted-foreground/70">
                No chatbots yet
              </p>
              <p className="text-xs text-muted-foreground/40 max-w-sm">
                Create your first tenant to get started.
              </p>
            </div>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-3.5 h-3.5" />
              Create First Chatbot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="w-[250px]">Tenant</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-center">Docs</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-center">API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t) => {
                  const status = getStatus(t);
                  return (
                    <TableRow key={t.id} className="border-border/60 hover:bg-muted/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{t.name}</p>
                            <p className="text-[9px] font-mono text-muted-foreground">
                              {t.id.substring(0, 12)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-mono uppercase">
                          {t.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-mono">{t.doc_count}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-mono">{t.user_count}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {t.api_key_masked ? (
                          <Badge variant="outline" className="text-green-500 border-green-500/50">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                            <Clock className="w-3 h-3 mr-1" />
                            No Key
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${status.color} border-current`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link
                                href={`/tenants/${t.id}`}
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/kb?tenant=${t.id}`}
                                className="flex items-center gap-2"
                              >
                                <BookOpen className="w-3 h-3" />
                                Manage KB
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEdit(t)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="w-3 h-3" />
                              Edit Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Architecture Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Bot,
            title: "Multi-Tenant",
            desc: "Each chatbot runs in its own isolated tenant — separate KB, conversations, and API keys.",
            color: "text-accent",
          },
          {
            icon: Zap,
            title: "RAG Pipeline",
            desc: "Free local embeddings with all-MiniLM-L6-v2. No external API cost for document indexing.",
            color: "text-blue-400",
          },
          {
            icon: Clock,
            title: "5-Min Deploy",
            desc: "Tenant → KB → API Key → Widget embed. Live chatbot in under 5 minutes per client.",
            color: "text-green-400",
          },
        ].map((item) => (
          <Card key={item.title} className="border-border/40 bg-muted/10">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <p className="text-[11px] font-bold uppercase tracking-widest">
                  {item.title}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Chatbot Instance</DialogTitle>
            <DialogDescription>
              Creates a new tenant with an admin user. They can log into their
              own dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
              >
                Business Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Coffee Shop Bali"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
              >
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.admin_email}
                onChange={(e) =>
                  setForm({ ...form, admin_email: e.target.value })
                }
                placeholder="admin@coffeeshopbali.com"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={form.admin_password}
                onChange={(e) =>
                  setForm({ ...form, admin_password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                creating ||
                !form.name ||
                !form.admin_email ||
                !form.admin_password
              }
              className="gap-2"
            >
              {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Create Chatbot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update tenant name or subscription plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                Tenant ID
              </Label>
              <Input
                value={selectedTenant?.id || ""}
                disabled
                className="bg-muted opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-name"
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
              >
                Business Name
              </Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-plan"
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
              >
                Subscription Plan
              </Label>
              <select
                id="edit-plan"
                value={editForm.plan}
                onChange={(e) =>
                  setEditForm({ ...editForm, plan: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updating || !editForm.name}
              className="gap-2"
            >
              {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
