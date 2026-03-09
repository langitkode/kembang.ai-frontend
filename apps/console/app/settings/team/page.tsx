"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import {
  Users,
  Plus,
  Mail,
  Shield,
  Trash2,
  Loader2,
  AlertTriangle,
  UserPlus,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface UserInfo {
  id: string;
  email: string;
  role: string;
  tenant_id: string;
}

export default function TeamSettingsPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    password: "",
    role: "admin",
  });

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await api.listTeamUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch team users:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.password) return;
    setInviting(true);
    try {
      await api.createUser(inviteForm);
      setShowInvite(false);
      setInviteForm({ email: "", password: "", role: "admin" });
      await fetchUsers();
      toast.success("Team member added successfully");
    } catch (error) {
      console.error("Failed to add team member:", error);
      toast.error("Failed to add team member. Email might be in use.");
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    try {
      await api.deleteUser(selectedUser.id);
      setShowDelete(false);
      await fetchUsers();
      toast.success("Team member removed");
    } catch (error) {
      console.error("Failed to remove user:", error);
      toast.error("Failed to remove team member");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage your team members and their roles within this chatbot
            instance.
          </p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="gap-2">
          <UserPlus className="w-3.5 h-3.5" />
          Add Member
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-6 space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Users className="w-4 h-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Team Size
              </p>
            </div>
            <p className="text-3xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest">
            Active Members
          </CardTitle>
          <CardDescription>
            All users with access to this tenant's dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-xs font-mono">Loading team members...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) =>
                  u.id === currentUser?.id ? (
                    <TableRow key={u.id} className="bg-accent/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs">
                            {u.email[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{u.email}</span>
                            <span className="text-[10px] text-accent font-bold uppercase">
                              You
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-accent border-accent/30 bg-accent/5"
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-[10px] text-muted-foreground italic">
                          Owner
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-xs">
                            {u.email[0].toUpperCase()}
                          </div>
                          <span className="font-medium">{u.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="uppercase text-[10px]"
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => {
                            setSelectedUser(u);
                            setShowDelete(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Create a new admin account for your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="pass"
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
              >
                Temporary Password
              </Label>
              <Input
                id="pass"
                type="password"
                value={inviteForm.password}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
              >
                Role
              </Label>
              <select
                id="role"
                value={inviteForm.role}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, role: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={inviting || !inviteForm.email || !inviteForm.password}
            >
              {inviting && (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
              )}
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-center">
              Remove Team Member
            </DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to remove **{selectedUser?.email}** from the
              team? They will lose all access to this chatbot instance.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-center gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-2"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
