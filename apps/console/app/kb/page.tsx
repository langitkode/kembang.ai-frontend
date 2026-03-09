"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import {
  FileText,
  Upload,
  Activity,
  Trash2,
  Database,
  ExternalLink,
  Info,
  Loader2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function KBOrchestratorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const tenantId = searchParams.get("tenant");

  async function fetchDocs() {
    if (!token) {
      console.log("KB: No token available");
      return;
    }

    // Ensure API has the latest token
    api.setToken(token);

    // Superadmin must specify tenant to view documents
    if (!tenantId) {
      console.log("KB: Superadmin view - showing all documents");
      // For superadmin without tenant filter, fetch all documents
      // Backend will return documents based on user's permissions
    } else {
      api.setTenantId(tenantId);
      console.log("KB: Viewing tenant-specific documents:", tenantId);
    }

    try {
      setLoading(true);
      const data = await api.getDocuments();
      console.log("KB: Documents fetched:", data.documents?.length || 0);
      setDocuments(data.documents || []);
    } catch (error: any) {
      console.error("Failed to fetch documents:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.status === 403
          ? "Access denied. Please select a tenant to view their documents."
          : "Failed to load documents. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      console.log("KB: Waiting for auth token...");
      return;
    }
    fetchDocs();
  }, [token, tenantId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await api.uploadDocument(file);
      await fetchDocs();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;
    try {
      setDeleting(true);
      await api.deleteDocument(selectedDoc.id);
      setShowDelete(false);
      await fetchDocs();
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete document");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {tenantId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push("/kb");
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            )}
            <h2 className="text-2xl font-bold tracking-tight">
              {tenantId
                ? "Tenant Knowledge Base"
                : "Knowledge Base Orchestrator"}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            {tenantId
              ? `Viewing documents for tenant: ${tenantId.substring(0, 8)}...`
              : "Centrally manage document ingestion for all tenants."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            className="gap-2 uppercase tracking-widest font-mono"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            {uploading ? "Uploading..." : "Global Upload"}
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>
      </header>

      {!tenantId && (
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Superadmin View
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are viewing all documents across all tenants. To manage documents for a specific tenant, 
                go to <a href="/tenants" className="text-accent hover:underline">Chatbots</a> and select "Manage KB" from a tenant's menu.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Documents",
            value: documents.length.toString(),
            icon: FileText,
            color: "text-blue-400",
          },
          {
            label: "Cloud Sync",
            value: "Active",
            icon: Database,
            color: "text-green-400",
          },
          {
            label: "Indexing",
            value: uploading ? "1" : "0",
            icon: Activity,
            active: uploading,
            color: uploading ? "text-accent" : "text-purple-400",
          },
          {
            label: "Engine",
            value: "384d",
            icon: Info,
            color: "text-orange-400",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="group hover:border-accent/40 transition-colors bg-muted/20 border-border/60"
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${stat.active ? "bg-accent/20" : "bg-accent/10"}`}
              >
                <stat.icon
                  className={`w-5 h-5 ${stat.active ? "text-accent" : stat.color}`}
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold uppercase tracking-widest">
            Document Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground font-mono text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <p>Syncing with backend...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted/30 border border-border/60 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-muted-foreground/70">
                  No documents found
                </p>
                <p className="text-xs text-muted-foreground/40 max-w-sm">
                  Upload your first document to start building the knowledge
                  base.
                </p>
              </div>
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Document
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">
                      Document
                    </TableHead>
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">
                      Source
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                          {doc.id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-orange-400 border-orange-400/30 bg-orange-500/10 text-[9px] uppercase"
                        >
                          {doc.source_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-green-400 border-green-400/30 bg-green-500/10"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5" />
                          Ready
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setShowDelete(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-tight text-blue-400">
              Embedding Model: all-MiniLM-L6-v2
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Knowledge Base uses local 384-dimensional embeddings for
              cost-free document ingestion. All documents are vectorized and
              stored in{" "}
              <code className="bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                pgvector
              </code>{" "}
              for efficient similarity search.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-center">Delete Document</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete **{selectedDoc?.name}**? This will
              remove it from the knowledge base and it will no longer be used
              for AI responses.
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
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
