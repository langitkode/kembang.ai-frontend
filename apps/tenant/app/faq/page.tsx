"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Tag,
  Import,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface FaqItem {
  id: string;
  tenant_id: string;
  category: string;
  question_patterns: string[];
  answer: string;
  confidence: number;
  is_active: boolean;
  created_at: string;
}

export default function FaqPage() {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    category: "",
    question_patterns: "",
    answer: "",
    confidence: 0.8,
  });

  useEffect(() => {
    if (token) {
      fetchFaqs();
      fetchCategories();
    }
  }, [token]);

  async function fetchFaqs() {
    try {
      setLoading(true);
      const params: any = {};
      if (filterCategory !== "all") params.category = filterCategory;
      if (filterStatus !== "all") params.is_active = filterStatus === "active";

      const data = await api.getFaqs(params);
      setFaqs(data.faqs || []);
    } catch (error: any) {
      console.error("Failed to fetch FAQs:", error);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const data = await api.getFaqCategories();
      // Extract category names from response (could be array of strings or objects)
      if (data.categories && Array.isArray(data.categories)) {
        const catNames = data.categories.map((c: any) => 
          typeof c === 'string' ? c : c.name || c.category || c.id
        ).filter(Boolean);
        setCategories(catNames);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function handleCreate() {
    if (!form.category || !form.question_patterns || !form.answer) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const patterns = form.question_patterns
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      await api.createFaq({
        ...form,
        question_patterns: patterns,
      });

      setShowCreate(false);
      setForm({ category: "", question_patterns: "", answer: "", confidence: 0.8 });
      await fetchFaqs();
      toast.success("FAQ created successfully");
    } catch (error: any) {
      console.error("Failed to create FAQ:", error);
      toast.error(error.response?.data?.detail || "Failed to create FAQ");
    }
  }

  async function handleUpdate() {
    if (!selectedFaq || !form.category || !form.answer) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const patterns = form.question_patterns
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      await api.updateFaq(selectedFaq.id, {
        ...form,
        question_patterns: patterns,
      });

      setShowEdit(false);
      await fetchFaqs();
      toast.success("FAQ updated successfully");
    } catch (error: any) {
      console.error("Failed to update FAQ:", error);
      toast.error(error.response?.data?.detail || "Failed to update FAQ");
    }
  }

  async function handleDelete() {
    if (!selectedFaq) return;

    try {
      await api.deleteFaq(selectedFaq.id);
      setShowDelete(false);
      await fetchFaqs();
      toast.success("FAQ deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete FAQ:", error);
      toast.error("Failed to delete FAQ");
    }
  }

  async function handleToggle() {
    if (!selectedFaq) return;

    try {
      await api.toggleFaq(selectedFaq.id);
      await fetchFaqs();
      toast.success(selectedFaq.is_active ? "FAQ deactivated" : "FAQ activated");
    } catch (error: any) {
      console.error("Failed to toggle FAQ:", error);
      toast.error("Failed to update FAQ status");
    }
  }

  async function handleImport(category: string) {
    try {
      await api.importFaqTemplate(category);
      setShowImport(false);
      await fetchFaqs();
      toast.success(`Imported FAQ templates for ${category}`);
    } catch (error: any) {
      console.error("Failed to import templates:", error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Failed to import templates";
      toast.error(errorMsg);
    }
  }

  function openEdit(faq: FaqItem) {
    setSelectedFaq(faq);
    setForm({
      category: faq.category,
      question_patterns: faq.question_patterns.join(", "),
      answer: faq.answer,
      confidence: faq.confidence,
    });
    setShowEdit(true);
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.question_patterns.some((p) =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory = filterCategory === "all" || faq.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && faq.is_active) ||
      (filterStatus === "inactive" && !faq.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-start border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold tracking-tight">FAQ Management</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage frequently asked questions and intent patterns for better chatbot responses.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImport(true)}
            className="gap-2"
          >
            <Import className="w-3.5 h-3.5" />
            Import Templates
          </Button>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="w-3.5 h-3.5" />
            Add FAQ
          </Button>
        </div>
      </header>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* FAQ List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground font-mono">
              Loading FAQs...
            </p>
          </CardContent>
        </Card>
      ) : filteredFaqs.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted/30 border flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-muted-foreground/70">
                No FAQs found
              </p>
              <p className="text-xs text-muted-foreground/40 max-w-sm">
                {faqs.length === 0
                  ? "Create your first FAQ to improve chatbot intent matching."
                  : "Try adjusting your filters or search query."}
              </p>
            </div>
            {faqs.length === 0 && (
              <Button onClick={() => setShowCreate(true)} className="gap-2">
                <Plus className="w-3.5 h-3.5" />
                Create First FAQ
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFaqs.map((faq) => (
            <Card
              key={faq.id}
              className="group hover:border-accent/30 transition-colors"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className="text-[9px] font-mono uppercase"
                        >
                          <Tag className="w-2.5 h-2.5 mr-1" />
                          {faq.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            faq.is_active
                              ? "text-green-500 border-green-500/50"
                              : "text-muted-foreground border-muted-foreground/50"
                          }
                        >
                          {faq.is_active ? (
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
                        <span className="text-[9px] font-mono text-muted-foreground">
                          Confidence: {(faq.confidence * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                              Question Patterns
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {faq.question_patterns.slice(0, 5).map((pattern, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-[9px] font-mono"
                                >
                                  "{pattern}"
                                </Badge>
                              ))}
                              {faq.question_patterns.length > 5 && (
                                <Badge variant="outline" className="text-[9px]">
                                  +{faq.question_patterns.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <Separator className="my-2" />

                        <div>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                            Answer
                          </p>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(faq)}
                      className="text-muted-foreground hover:text-accent"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFaq(faq);
                        handleToggle();
                      }}
                      className={
                        faq.is_active
                          ? "text-muted-foreground hover:text-yellow-500"
                          : "text-muted-foreground hover:text-green-500"
                      }
                    >
                      {faq.is_active ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFaq(faq);
                        setShowDelete(true);
                      }}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New FAQ</DialogTitle>
            <DialogDescription>
              Add a new FAQ with question patterns and answer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[10px] font-mono uppercase tracking-widest">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="hours">Business Hours</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patterns" className="text-[10px] font-mono uppercase tracking-widest">
                Question Patterns
              </Label>
              <Textarea
                id="patterns"
                value={form.question_patterns}
                onChange={(e) => setForm({ ...form, question_patterns: e.target.value })}
                placeholder="Enter patterns separated by commas (e.g., &quot;price, cost, how much&quot;)"
                rows={3}
              />
              <p className="text-[9px] text-muted-foreground">
                Comma-separated variations of how users might ask this question
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer" className="text-[10px] font-mono uppercase tracking-widest">
                Answer
              </Label>
              <Textarea
                id="answer"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                placeholder="Enter the answer..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence" className="text-[10px] font-mono uppercase tracking-widest">
                Confidence Threshold
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={form.confidence}
                  onChange={(e) => setForm({ ...form, confidence: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-12 text-right">
                  {(form.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground">
                Minimum confidence score for this FAQ to match
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-3.5 h-3.5" />
              Create FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update FAQ details and patterns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-[10px] font-mono uppercase tracking-widest">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="hours">Business Hours</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-patterns" className="text-[10px] font-mono uppercase tracking-widest">
                Question Patterns
              </Label>
              <Textarea
                id="edit-patterns"
                value={form.question_patterns}
                onChange={(e) => setForm({ ...form, question_patterns: e.target.value })}
                placeholder="Enter patterns separated by commas"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-answer" className="text-[10px] font-mono uppercase tracking-widest">
                Answer
              </Label>
              <Textarea
                id="edit-answer"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-confidence" className="text-[10px] font-mono uppercase tracking-widest">
                Confidence Threshold
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={form.confidence}
                  onChange={(e) => setForm({ ...form, confidence: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-12 text-right">
                  {(form.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="gap-2">
              <Edit2 className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-center">Delete FAQ</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete this FAQ for{" "}
              <span className="font-semibold">"{selectedFaq?.category}"</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-center gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import FAQ Templates</DialogTitle>
            <DialogDescription>
              Quick setup with pre-built FAQ templates for common categories.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Label className="text-[10px] font-mono uppercase tracking-widest">
              Select Category
            </Label>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {[
                  { cat: "pricing", desc: "Common pricing and billing questions" },
                  { cat: "hours", desc: "Business hours and availability" },
                  { cat: "location", desc: "Address, directions, and locations" },
                  { cat: "products", desc: "Product information and features" },
                  { cat: "services", desc: "Services offered and details" },
                  { cat: "contact", desc: "Contact information and support" },
                  { cat: "returns", desc: "Return and refund policies" },
                  { cat: "shipping", desc: "Shipping and delivery information" },
                ].map((item, index) => (
                  <Card
                    key={`${item.cat}-${index}`}
                    className="cursor-pointer hover:border-accent/50 transition-colors"
                    onClick={() => handleImport(item.cat)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold capitalize">{item.cat}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <Import className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImport(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              How FAQ Matching Works
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              FAQs use pattern matching to identify user intents. When a user asks a question,
              the system checks against your FAQ patterns first (faster) before falling back
              to RAG search (slower but more flexible). Add multiple pattern variations for
              better coverage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
