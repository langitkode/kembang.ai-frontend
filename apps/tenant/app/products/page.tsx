"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
  Tag,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  TrendingUp,
  DollarSign,
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Product {
  id: string;
  tenant_id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  discount_price: number | null;
  final_price: number;
  stock_quantity: number;
  is_active: boolean;
  is_in_stock: boolean;
  attributes: Record<string, any> | null;
  images: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterInStock, setFilterInStock] = useState<boolean>(false);

  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    subcategory: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    is_active: true,
    attributes: "",
  });

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchCategories();
    }
  }, [token]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const params: any = {};
      if (filterCategory !== "all") params.category = filterCategory;
      
      const data = await api.getProducts(params);
      setProducts(data.products || []);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const data = await api.getProductCatalogMetadata();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function handleCreate() {
    if (!form.sku || !form.name || !form.category || !form.price) {
      toast.error("Please fill in required fields (SKU, Name, Category, Price)");
      return;
    }

    try {
      const attributes: any = {};
      if (form.attributes) {
        try {
          const parsed = JSON.parse(form.attributes);
          Object.assign(attributes, parsed);
        } catch {
          const lines = form.attributes.split("\n");
          lines.forEach((line) => {
            const [key, value] = line.split("=").map((s) => s.trim());
            if (key && value) {
              attributes[key.toLowerCase()] = value;
            }
          });
        }
      }

      await api.createProduct({
        sku: form.sku,
        name: form.name,
        category: form.category,
        subcategory: form.subcategory || undefined,
        description: form.description || undefined,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : undefined,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        is_active: form.is_active,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      });

      setShowCreate(false);
      setForm({ 
        sku: "", 
        name: "", 
        category: "", 
        subcategory: "",
        description: "", 
        price: "", 
        discount_price: "",
        stock_quantity: "",
        is_active: true,
        attributes: "" 
      });
      await fetchProducts();
      toast.success("Product created successfully");
    } catch (error: any) {
      console.error("Failed to create product:", error);
      const errors = error.response?.data?.detail;
      if (Array.isArray(errors)) {
        toast.error(errors.map((e: any) => e.msg).join(", "));
      } else {
        toast.error(error.response?.data?.detail || "Failed to create product");
      }
    }
  }

  async function handleUpdate() {
    if (!selectedProduct || !form.name || !form.category) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const attributes: any = {};
      if (form.attributes) {
        try {
          const parsed = JSON.parse(form.attributes);
          Object.assign(attributes, parsed);
        } catch {
          const lines = form.attributes.split("\n");
          lines.forEach((line) => {
            const [key, value] = line.split("=").map((s) => s.trim());
            if (key && value) {
              attributes[key.toLowerCase()] = value;
            }
          });
        }
      }

      await api.updateProduct(selectedProduct.id, {
        sku: form.sku || undefined,
        name: form.name,
        category: form.category,
        subcategory: form.subcategory || undefined,
        description: form.description || undefined,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : undefined,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        is_active: form.is_active,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      });

      setShowEdit(false);
      await fetchProducts();
      toast.success("Product updated successfully");
    } catch (error: any) {
      console.error("Failed to update product:", error);
      const errors = error.response?.data?.detail;
      if (Array.isArray(errors)) {
        toast.error(errors.map((e: any) => e.msg).join(", "));
      } else {
        toast.error(error.response?.data?.detail || "Failed to update product");
      }
    }
  }

  async function handleDelete() {
    if (!selectedProduct) return;

    try {
      await api.deleteProduct(selectedProduct.id);
      setShowDelete(false);
      await fetchProducts();
      toast.success("Product deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  }

  function openEdit(product: Product) {
    setSelectedProduct(product);
    setForm({
      sku: product.sku || "",
      name: product.name || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      description: product.description || "",
      price: product.price?.toString() || "0",
      discount_price: product.discount_price?.toString() || "",
      stock_quantity: product.stock_quantity?.toString() || "0",
      is_active: product.is_active ?? true,
      attributes: product.attributes ? JSON.stringify(product.attributes, null, 2) : "",
    });
    setShowEdit(true);
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesStock = !filterInStock || product.stock_quantity > 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stock_quantity > 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock_quantity, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-start border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold tracking-tight">Product Catalog</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage your product catalog for AI-powered recommendations and responses.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
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
                <p className="text-xs font-medium text-muted-foreground">In Stock</p>
                <p className="text-2xl font-bold">{inStockProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">Rp {totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              variant={filterInStock ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterInStock(!filterInStock)}
              className="gap-2"
            >
              {filterInStock ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Package className="w-3.5 h-3.5" />
              )}
              In Stock
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
                {products.length === 0
                  ? "Create your first product to enable AI-powered product recommendations."
                  : "Try adjusting your filters or search query."}
              </p>
            </div>
            {products.length === 0 && (
              <Button onClick={() => setShowCreate(true)} className="gap-2">
                <Plus className="w-3.5 h-3.5" />
                Create First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:border-accent/30 transition-colors"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge
                          variant="outline"
                          className="text-[9px] font-mono uppercase"
                        >
                          <Tag className="w-2.5 h-2.5 mr-1" />
                          {product.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            product.stock_quantity > 0
                              ? "text-green-500 border-green-500/50"
                              : "text-red-500 border-red-500/50"
                          }
                        >
                          {product.stock_quantity > 0 ? (
                            <>
                              <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-2.5 h-2.5 mr-1" />
                              Out of Stock
                            </>
                          )}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-accent">
                      Rp {product.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Stock: {product.stock_quantity} units
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(product)}
                      className="text-muted-foreground hover:text-accent"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
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
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your catalog for AI recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-[10px] font-mono uppercase tracking-widest">
                SKU *
              </Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="e.g., PROD-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest">
                Product Name *
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Whitening Serum"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[10px] font-mono uppercase tracking-widest">
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skincare">Skincare</SelectItem>
                  <SelectItem value="makeup">Makeup</SelectItem>
                  <SelectItem value="bodycare">Bodycare</SelectItem>
                  <SelectItem value="haircare">Haircare</SelectItem>
                  <SelectItem value="fragrance">Fragrance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-mono uppercase tracking-widest">
                Description
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[10px] font-mono uppercase tracking-widest">
                  Price (Rp) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_price" className="text-[10px] font-mono uppercase tracking-widest">
                  Discount (Rp)
                </Label>
                <Input
                  id="discount_price"
                  type="number"
                  value={form.discount_price}
                  onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_quantity" className="text-[10px] font-mono uppercase tracking-widest">
                  Stock
                </Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-[10px] font-mono uppercase tracking-widest">
                Subcategory
              </Label>
              <Input
                id="subcategory"
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                placeholder="e.g., serum, moisturizer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attributes" className="text-[10px] font-mono uppercase tracking-widest">
                Attributes (JSON or key=value)
              </Label>
              <Textarea
                id="attributes"
                value={form.attributes}
                onChange={(e) => setForm({ ...form, attributes: e.target.value })}
                placeholder={`{ "size": "M", "color": "Blue" }\nor\nsize=M\ncolor=Blue`}
                rows={4}
              />
              <p className="text-[9px] text-muted-foreground">
                Optional: Add custom attributes as JSON or key=value pairs (one per line)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-3.5 h-3.5" />
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-[10px] font-mono uppercase tracking-widest">
                Product Name *
              </Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-[10px] font-mono uppercase tracking-widest">
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skincare">Skincare</SelectItem>
                  <SelectItem value="makeup">Makeup</SelectItem>
                  <SelectItem value="bodycare">Bodycare</SelectItem>
                  <SelectItem value="haircare">Haircare</SelectItem>
                  <SelectItem value="fragrance">Fragrance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-[10px] font-mono uppercase tracking-widest">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-[10px] font-mono uppercase tracking-widest">
                  Price (Rp) *
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount_price" className="text-[10px] font-mono uppercase tracking-widest">
                  Discount (Rp)
                </Label>
                <Input
                  id="edit-discount_price"
                  type="number"
                  value={form.discount_price}
                  onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock_quantity" className="text-[10px] font-mono uppercase tracking-widest">
                  Stock
                </Label>
                <Input
                  id="edit-stock_quantity"
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subcategory" className="text-[10px] font-mono uppercase tracking-widest">
                Subcategory
              </Label>
              <Input
                id="edit-subcategory"
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-attributes" className="text-[10px] font-mono uppercase tracking-widest">
                Attributes (JSON or key=value)
              </Label>
              <Textarea
                id="edit-attributes"
                value={form.attributes}
                onChange={(e) => setForm({ ...form, attributes: e.target.value })}
                rows={4}
              />
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
            <DialogTitle className="text-center">Delete Product</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{selectedProduct?.name}"</span>?
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
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-4 h-4 text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              AI Integration
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Products in your catalog are used by the AI to provide accurate product recommendations
              and answer customer questions about your offerings. Keep your catalog up-to-date for
              the best AI responses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
