"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import {
  Users,
  UserPlus,
  Trash2,
  Edit,
  Loader2,
  Shield,
  Bot,
  Mail,
  Search,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UserInfo {
  id: string;
  email: string;
  role: string;
  tenant_id: string | null;
}

export default function GlobalUsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    role: "",
    tenant_id: "",
  });

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await api.listAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load user list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleUpdate = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      await api.updateUser(selectedUser.id, editForm);
      setShowEdit(false);
      await fetchUsers();
      toast.success("User updated");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    try {
      await api.deleteUser(selectedUser.id);
      setShowDelete(false);
      await fetchUsers();
      toast.success("User deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.tenant_id?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Global User Registry
          </h2>
          <p className="text-muted-foreground text-sm">
            Monitor and manage every user account registered on the platform.
          </p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, role, or tenant..."
            className="pl-9 bg-[#11111a] border-white/5"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <Card className="bg-[#0c0c12] border-white/5 shadow-2xl shadow-accent/5">
        <CardHeader>
          <CardTitle className="text-[12px] font-mono font-bold uppercase tracking-[0.2em] text-accent">
            System Identity Registry
          </CardTitle>
          <CardDescription className="text-muted-foreground/50 text-xs">
            {filteredUsers.length} total identities indexed in the vector space.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="font-mono text-[10px] uppercase tracking-widest animate-pulse">
                Decrypting User Encryptions...
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
                    User Identity
                  </TableHead>
                  <TableHead className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
                    Access Pattern
                  </TableHead>
                  <TableHead className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
                    Tenant Assignment
                  </TableHead>
                  <TableHead className="text-white/40 font-mono text-[10px] uppercase tracking-widest text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    className="border-white/5 hover:bg-white/[0.01] group transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50" />
                          <span className="text-xs font-bold text-accent relative z-10">
                            {u.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                            {u.email}
                          </span>
                          <span className="text-[9px] font-mono text-white/30 truncate max-w-[150px]">
                            ID: {u.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border-current transition-all",
                          u.role === "superadmin"
                            ? "text-red-400 bg-red-400/10"
                            : "text-blue-400 bg-blue-400/10",
                        )}
                      >
                        {u.role === "superadmin" && (
                          <Shield className="w-2.5 h-2.5 mr-1" />
                        )}
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.tenant_id ? (
                        <div className="flex items-center gap-2">
                          <Bot className="w-3 h-3 text-white/20" />
                          <span className="text-[10px] font-mono text-white/40 truncate max-w-[120px]">
                            {u.tenant_id}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest">
                          Global Access
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-white/40 hover:text-accent hover:bg-accent/10"
                          onClick={() => {
                            setSelectedUser(u);
                            setEditForm({
                              role: u.role,
                              tenant_id: u.tenant_id || "",
                            });
                            setShowEdit(true);
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-white/40 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => {
                            if (u.id === currentUser?.id) {
                              toast.error(
                                "Cannot delete your own master identity.",
                              );
                              return;
                            }
                            setSelectedUser(u);
                            setShowDelete(true);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-[#0c0c12] border-white/5 text-white">
          <DialogHeader>
            <DialogTitle>Modify User Access</DialogTitle>
            <DialogDescription className="text-white/40">
              Update roles and tenant permissions for {selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/40">
                Access Role
              </Label>
              <select
                className="flex h-10 w-full rounded-md border border-white/5 bg-[#11111a] px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-accent"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
              >
                <option value="admin">Tenant Admin</option>
                <option value="superadmin">Super Admin (Platform Wide)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/40">
                Tenant Lock
              </Label>
              <Input
                className="bg-[#11111a] border-white/5 font-mono text-xs"
                placeholder="UUID of the parent tenant..."
                value={editForm.tenant_id}
                onChange={(e) =>
                  setEditForm({ ...editForm, tenant_id: e.target.value })
                }
                disabled={editForm.role === "superadmin"}
              />
              {editForm.role === "superadmin" && (
                <p className="text-[9px] text-accent/50 italic">
                  Superadmins possess global recursive access.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              className="text-white/40 hover:text-white"
              onClick={() => setShowEdit(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-accent hover:bg-accent/80 text-black font-bold uppercase tracking-widest text-[11px]"
            >
              {updating ? (
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
              ) : (
                "Overwrite Data"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="bg-[#0c0c12] border-white/5 text-white">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-center font-bold">
              Terminate User Access?
            </DialogTitle>
            <DialogDescription className="text-center text-white/40">
              You are about to permanently purge the identity index for **
              {selectedUser?.email}**. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-center gap-2 pt-6">
            <Button
              variant="ghost"
              className="text-white/40 hover:text-white"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="font-bold uppercase tracking-widest text-[11px]"
            >
              {deleting ? (
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
              ) : (
                "Purge Identity"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Utility to merge classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
