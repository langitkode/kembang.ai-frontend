"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import {
  HelpCircle,
  TrendingUp,
  Users,
  Tag,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
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

interface FaqStats {
  total_faqs: number;
  by_category: { category: string; count: number }[];
  by_tenant: { tenant_id: string; tenant_name: string; count: number }[];
  top_faqs: { id: string; category: string; usage_count: number }[];
}

interface FaqItem {
  id: string;
  tenant_id: string;
  tenant_name: string;
  category: string;
  question_patterns: string[];
  answer: string;
  is_active: boolean;
  created_at: string;
}

export default function SuperadminFaqPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>("all");
  const [stats, setStats] = useState<FaqStats | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  useEffect(() => {
    fetchTenants();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchData(pagination.page);
  }, [selectedTenant, pagination.page]);

  async function fetchTenants() {
    try {
      const data = await api.listAllTenants();
      setTenants(data.tenants || []);
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
    }
  }

  async function fetchStats() {
    try {
      const data = await api.getFaqStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch FAQ stats:", error);
    }
  }

  async function fetchData(page = 1) {
    try {
      setLoading(true);
      const params: any = {
        page,
        page_size: pagination.page_size,
      };
      if (selectedTenant !== "all") {
        params.tenant_id = selectedTenant;
      }
      if (filterCategory !== "all") {
        params.category = filterCategory;
      }
      if (filterStatus !== "all") {
        params.is_active = filterStatus === "active";
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const data = await api.getFaqs(params);
      setFaqs(data.faqs || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error("Failed to fetch FAQ data:", error);
      toast.error("Failed to load FAQ data");
    } finally {
      setLoading(false);
    }
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.question_patterns.some((p) =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      filterCategory === "all" || faq.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && faq.is_active) ||
      (filterStatus === "inactive" && !faq.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <TooltipProvider>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-start border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold tracking-tight">FAQ Overview</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              {selectedTenant === "all"
                ? "Select a tenant to view their FAQs."
                : "Monitor FAQ usage and management for selected tenant."}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Total FAQs
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? "—" : stats?.total_faqs || faqs.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Categories
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? "—" : categories.length}
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
                  <p className="text-2xl font-bold">
                    {loading
                      ? "—"
                      : faqs.filter((f) => f.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Tenants
                  </p>
                  <p className="text-2xl font-bold">
                    {loading
                      ? "—"
                      : new Set(faqs.map((f) => f.tenant_id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        {stats?.by_category && stats.by_category.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Top Categories
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Most used FAQ categories across all tenants
                  </CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-md bg-black text-white border-white/10">
                    <p className="text-xs text-white/80">
                      Categories with the most FAQ entries. Higher numbers indicate more comprehensive coverage.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.by_category.slice(0, 8).map((cat, i) => (
                  <div
                    key={cat.category}
                    className="p-3 bg-muted/20 rounded-lg border"
                  >
                    <p className="text-xs font-mono text-muted-foreground capitalize mb-1">
                      {cat.category}
                    </p>
                    <p className="text-lg font-bold">{cat.count}</p>
                    <p className="text-[9px] text-muted-foreground">
                      {((cat.count / stats.total_faqs) * 100).toFixed(0)}% of total
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                  {selectedTenant === "all"
                    ? "Please select a tenant from the dropdown to view their FAQs."
                    : faqs.length === 0
                    ? "This tenant has not created any FAQs yet."
                    : "Try adjusting your filters or search query."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[500px] border rounded-lg">
            <div className="p-4 space-y-3">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} className="hover:border-accent/30 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
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
                              {faq.tenant_name || faq.tenant_id.substring(0, 8)}...
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                                Question Patterns
                              </p>
                              <div className="flex flex-wrap gap-1">
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

                            <Separator />

                            <div>
                              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                                Answer
                              </p>
                              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
                                {faq.answer}
                              </p>
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

        {!loading && faqs.length > 0 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.total_pages}
            hasPrev={pagination.has_prev}
            hasNext={pagination.has_next}
            onPageChange={(newPage) => {
              setPagination({ ...pagination, page: newPage });
            }}
          />
        )}

        {/* Info Card */}
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Superadmin View
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are viewing FAQs from all tenants. Use filters to narrow down by category or status.
                FAQs help reduce RAG queries by providing instant answers to common questions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
