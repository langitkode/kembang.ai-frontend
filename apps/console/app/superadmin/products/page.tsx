"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Tag,
  Search,
  Filter,
  Loader2,
  DollarSign,
  ShoppingCart,
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

interface ProductStats {
  total_products: number;
  by_category: { category: string; count: number }[];
  by_tenant: { tenant_id: string; tenant_name: string; count: number }[];
  low_stock_count: number;
  avg_price: number;
}

interface ProductItem {
  id: string;
  tenant_id: string;
  tenant_name: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

export default function SuperadminProductsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>("all");
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [lowStock, setLowStock] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 50,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  useEffect(() => {
    fetchTenants();
    fetchStats();
    fetchLowStock();
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
      const data = await api.getProductStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch product stats:", error);
    }
  }

  async function fetchLowStock() {
    try {
      const data = await api.getLowStockProducts(10);
      setLowStock(data.products || []);
    } catch (error) {
      console.error("Failed to fetch low stock products:", error);
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
      if (filterLowStock) {
        params.low_stock_only = true;
        params.threshold = 10;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const data = await api.getProducts(params);
      setProducts(data.products || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      toast.error("Failed to load product data");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    const matchesLowStock =
      !filterLowStock || product.stock_quantity <= 10;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <TooltipProvider>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-start border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold tracking-tight">Product Catalog</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              {selectedTenant === "all"
                ? "Select a tenant to view their products."
                : "Monitor product inventory and pricing for selected tenant."}
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
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? "—" : products.length}
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
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Low Stock
                  </p>
                  <p className="text-2xl font-bold text-red-500">
                    {loading ? "—" : lowStock.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Avg Price
                  </p>
                  <p className="text-2xl font-bold">
                    {loading
                      ? "—"
                      : `Rp ${(products.reduce((sum, p) => sum + p.price, 0) / (products.length || 1)).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        {lowStock.length > 0 && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <div>
                    <CardTitle className="text-sm font-semibold text-red-500">
                      Low Stock Alerts
                    </CardTitle>
                    <CardDescription className="text-xs text-red-500/70">
                      {lowStock.length} products below 10 units
                    </CardDescription>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-md bg-black text-white border-white/10">
                    <p className="text-xs text-white/80">
                      Products with stock quantity ≤ 10 units. Consider notifying tenants to restock.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {lowStock.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 bg-red-500/10 rounded-md border border-red-500/20"
                    >
                      <div>
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className="text-[9px] text-muted-foreground">
                          {product.tenant_name || product.tenant_id.substring(0, 8)}...
                        </p>
                      </div>
                      <Badge variant="outline" className="text-red-500 border-red-500/50">
                        {product.stock_quantity} units
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Top Categories */}
        {products.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Category Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Products by category across all tenants
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
                      Distribution of products across categories. Helps identify popular product types.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.slice(0, 8).map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  return (
                    <div
                      key={cat}
                      className="p-3 bg-muted/20 rounded-lg border"
                    >
                      <p className="text-xs font-mono text-muted-foreground capitalize mb-1">
                        {cat}
                      </p>
                      <p className="text-lg font-bold">{count}</p>
                      <p className="text-[9px] text-muted-foreground">
                        {((count / products.length) * 100).toFixed(0)}% of total
                      </p>
                    </div>
                  );
                })}
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
                  placeholder="Search products..."
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
              <Button
                variant={filterLowStock ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterLowStock(!filterLowStock)}
                className="gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Low Stock Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Product List */}
        {loading ? (
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground font-mono">
                Loading products...
              </p>
            </CardContent>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted/30 border flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-muted-foreground/70">
                  No products found
                </p>
                <p className="text-xs text-muted-foreground/40 max-w-sm">
                  {selectedTenant === "all"
                    ? "Please select a tenant from the dropdown to view their products."
                    : products.length === 0
                    ? "This tenant has not added any products yet."
                    : "Try adjusting your filters or search query."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[500px] border rounded-lg">
            <div className="p-4 space-y-3">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:border-accent/30 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge
                              variant="outline"
                              className="text-[9px] font-mono uppercase"
                            >
                              <Tag className="w-2.5 h-2.5 mr-1" />
                              {product.category}
                            </Badge>
                            {product.stock_quantity <= 10 && (
                              <Badge variant="outline" className="text-red-500 border-red-500/50">
                                <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                                Low Stock
                              </Badge>
                            )}
                            <span className="text-[9px] font-mono text-muted-foreground">
                              {product.tenant_name || product.tenant_id.substring(0, 8)}...
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-semibold">{product.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {product.description}
                              </p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg font-bold text-accent">
                                  Rp {product.price.toLocaleString()}
                                </p>
                                <p className="text-[9px] text-muted-foreground">
                                  Stock: {product.stock_quantity} units
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  product.is_active
                                    ? "text-green-500 border-green-500/50"
                                    : "text-muted-foreground border-muted-foreground/50"
                                }
                              >
                                {product.is_active ? "Active" : "Inactive"}
                              </Badge>
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

        {!loading && products.length > 0 && (
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
                You are viewing products from all tenants. Low stock alerts help identify tenants who may need to restock.
                Products are used by AI for product recommendations and queries.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
