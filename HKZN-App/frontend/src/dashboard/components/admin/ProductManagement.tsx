import React, { useState, useEffect, useCallback } from "react"; // Ensure useCallback is imported
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  Edit,
  Copy,
  Tag,
  BarChart,
  Download,
  Globe,
  Sun,
  Wifi,
  Package,
  Server,
  Cloud,
  Database,
  Smartphone,
  Layers,
} from "lucide-react";
// import { useStore, Product } from "@/lib/store"; // Remove useStore
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons
import Sidebar from "@/dashboard/components/dashboard/Sidebar"; // Corrected path
import SearchBar from "@/dashboard/components/dashboard/SearchBar"; // Corrected path
import { productCategories, CategoryInfo } from "@/dashboard/lib/productCategories"; // Corrected path
import ProductFeatureManager from "./ProductFeatureManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductCategoryManagement from "./ProductCategoryManagement";

// Define Product type locally (adjust based on actual DB structure)
interface Product {
  id: string | number; // Use string or number depending on DB
  name: string;
  description: string;
  price: number;
  commissionRate: number; // Use camelCase consistent with form/modal state
  features: string[];
  category: string;
  isActive?: boolean; // Assuming this might not come from DB initially
  created_at?: string;
}


const ProductManagement = () => {

  // Add state for products, loading, error
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch products function
  const fetchProducts = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/get_products.php`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch products.');
        }
        // Map API data (snake_case) to local Product type (camelCase)
        const fetchedProducts = Array.isArray(result.data) ? result.data.map((p: any) => ({
             id: p.id,
             name: p.name,
             description: p.description,
             price: Number(p.price) || 0,
             commissionRate: Number(p.commission_rate) || 0, // Map snake_case
             features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features || '[]') : []), // Handle JSON string or array
             category: p.category,
             isActive: p.is_active ?? true, // Map snake_case
             created_at: p.created_at
         })) : [];
        setProducts(fetchedProducts);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while fetching products.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error fetching products:", errorMessage);
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, [apiBaseUrl]); // Dependency: apiBaseUrl

  // Initial fetch on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Dependency: fetchProducts function

  // Function to refetch products (using useCallback)
  const refetchProducts = useCallback(() => {
      fetchProducts();
  }, [fetchProducts]);


  // Keep state for form, search, etc.
  const [newProduct, setNewProduct] = useState<
    Omit<Product, "id" | "isActive" | "created_at">
  >({
    name: "",
    description: "",
    price: 0,
    commissionRate: 0.05, // Store as decimal
    features: [],
    category: "web",
  });
  const [newFeature, setNewFeature] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [productsToCompare, setProductsToCompare] = useState<(string | number)[]>([]); // Allow string or number IDs
  const [showBulkPriceDialog, setShowBulkPriceDialog] = useState(false);
  const [bulkPriceChange, setBulkPriceChange] = useState<{
    type: "percentage" | "fixed";
    value: number;
  }>({ type: "percentage", value: 0 });
  const [activeTab, setActiveTab] = useState("productList");


  // Categories for filtering - Keep this
  const categories = ["all", ...Object.keys(productCategories)];

  // Get category icon component
  const getCategoryIcon = (categoryId: string) => {
    const iconName = productCategories[categoryId]?.icon || "Package";
    switch (iconName) {
      case "Globe": return <Globe className="h-4 w-4 mr-1" />;
      case "Sun": return <Sun className="h-4 w-4 mr-1" />;
      case "Wifi": return <Wifi className="h-4 w-4 mr-1" />;
      case "Server": return <Server className="h-4 w-4 mr-1" />;
      case "Cloud": return <Cloud className="h-4 w-4 mr-1" />;
      case "Database": return <Database className="h-4 w-4 mr-1" />;
      case "Smartphone": return <Smartphone className="h-4 w-4 mr-1" />;
      case "Layers": return <Layers className="h-4 w-4 mr-1" />;
      default: return <Package className="h-4 w-4 mr-1" />;
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddFeature = () => {
    if (newFeature.trim() === "") return;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, features: [...editingProduct.features, newFeature] });
    } else {
      setNewProduct({ ...newProduct, features: [...newProduct.features, newFeature] });
    }
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    if (editingProduct) {
      const updatedFeatures = [...editingProduct.features];
      updatedFeatures.splice(index, 1);
      setEditingProduct({ ...editingProduct, features: updatedFeatures });
    } else {
      const updatedFeatures = [...newProduct.features];
      updatedFeatures.splice(index, 1);
      setNewProduct({ ...newProduct, features: updatedFeatures });
    }
  };

  // --- Enable Create Product, keep others disabled ---
  const handleCreateProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
       toast({ title: "Validation Error", description: "Please provide a product name and valid price", variant: "destructive" });
       return;
     }

    setIsSubmitting(true);
    // Prepare data matching add_product.php expectations
    const productDataForApi = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        commissionRate: newProduct.commissionRate, // Send decimal rate
        features: newProduct.features,
        category: newProduct.category,
    };

    console.log("Submitting product data:", productDataForApi);

    try {
        const response = await fetch(`${apiBaseUrl}/add_product.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(productDataForApi),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || `Failed to add product (HTTP ${response.status})`);
        }
        toast({ title: "Product Added", description: `${productDataForApi.name} added successfully.` });
        refetchProducts(); // Refetch the product list
        setNewProduct({ name: "", description: "", price: 0, commissionRate: 0.05, features: [], category: "web" });
        setActiveTab("productList");
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while adding product.';
        if (err instanceof Error) errorMessage = err.message;
        console.error("Error adding product:", errorMessage);
        toast({ title: "Add Failed", description: errorMessage, variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab("createProduct"); // Switch to the form tab
    toast({ title: "Info", description: "Editing product form populated. Update functionality needs backend integration." });
  };

  const handleUpdateProduct = () => {
     toast({ title: "Info", description: "Update product functionality needs backend integration." });
  };

  const handleToggleProductStatus = (id: string | number) => {
     toast({ title: "Info", description: "Toggle status functionality needs backend integration." });
  };

  const handleDuplicateProduct = (product: Product) => {
     toast({ title: "Info", description: "Duplicate product functionality needs backend integration." });
  };
  // --- End CRUD Handlers ---

  const handleCompareProducts = () => {
    if (productsToCompare.length < 2) {
      toast({ title: "Select Products", description: "Please select at least 2 products to compare", variant: "destructive" });
      return;
    }
    setShowCompareDialog(true);
  };

  const handleToggleCompareProduct = (productId: string | number) => { // Allow string or number ID
    setProductsToCompare((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const handleBulkPriceUpdate = () => {
    if (bulkPriceChange.value === 0) {
      toast({ title: "No Change", description: "Please enter a non-zero value for price change", variant: "destructive" });
      return;
    }
    toast({ title: "Info", description: "Bulk price update needs backend integration." });
    setShowBulkPriceDialog(false);
  };

  const exportProductsToCSV = () => {
    const headers = ["Name", "Description", "Price (R)", "Commission Rate (%)", "Features", "Status", "Category"];
    const csvData = [
      headers.join(","),
      ...filteredProducts.map((product) =>
        [
          `"${product.name}"`,
          `"${product.description}"`,
          product.price.toFixed(2),
          (product.commissionRate * 100).toFixed(1),
          `"${product.features.join("; ")}"`,
          product.isActive ? "Active" : "Inactive",
          `"${product.category}"`,
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export Complete", description: "Products have been exported to CSV" });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Product Management</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportProductsToCSV}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              {productsToCompare.length > 0 && (
                <Button variant="outline" onClick={handleCompareProducts}>
                  Compare ({productsToCompare.length})
                </Button>
              )}
              {productsToCompare.length > 0 && (
                <Button variant="outline" onClick={() => setShowBulkPriceDialog(true)}>
                  Bulk Update
                </Button>
              )}
            </div>
          </div>

          <Card className="w-full bg-white p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="productList">Product List</TabsTrigger>
                <TabsTrigger value="createProduct">
                  {editingProduct ? "Edit Product" : "Create Product"}
                </TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="productList" className="mt-6">
                <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <SearchBar onSearch={setSearchQuery} placeholder="Search products..." />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[180px]" aria-label="Filter by category">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : productCategories[category as keyof typeof productCategories]?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredProducts.length} products found
                  </div>
                </div>

                {loading && (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    <span className="ml-2">Loading products...</span>
                  </div>
                )}
                {error && (
                  <Alert variant="destructive" className="my-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Fetching Products</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!loading && !error && (
                  <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-8 px-4 py-3">
                            <input type="checkbox" aria-label="Select all products" className="rounded border-gray-300"
                              onChange={() => {
                                if (productsToCompare.length === filteredProducts.length) {
                                  setProductsToCompare([]);
                                } else {
                                  setProductsToCompare(filteredProducts.map((p) => p.id));
                                }
                              }}
                              checked={productsToCompare.length === filteredProducts.length && filteredProducts.length > 0}
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (R)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length === 0 ? (
                          <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">No products found.</td></tr>
                        ) : (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className={productsToCompare.includes(product.id) ? "bg-blue-50" : ""}>
                              <td className="px-4 py-4">
                                <input type="checkbox" aria-label={`Select product ${product.name}`} className="rounded border-gray-300"
                                  checked={productsToCompare.includes(product.id)}
                                  onChange={() => handleToggleCompareProduct(product.id)}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.description}</div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {product.features.slice(0, 2).map((feature, idx) => (<Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>))}
                                  {product.features.length > 2 && (<Badge variant="outline" className="text-xs">+{product.features.length - 2} more</Badge>)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {getCategoryIcon(product.category)}
                                  <span className="text-sm text-gray-900">{product.category && productCategories[product.category] ? productCategories[product.category].name : "Uncategorized"}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">R {product.price.toLocaleString()}</div></td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{(product.commissionRate * 100).toFixed(1)}%</div>
                                <div className="text-xs text-gray-500">R {(product.price * product.commissionRate).toLocaleString()} per sale</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-500" : "bg-red-500"}>
                                  {product.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Actions</Button></DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Manage Product</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleToggleProductStatus(product.id)}>
                                      <Tag className="h-4 w-4 mr-2" />{product.isActive ? "Deactivate" : "Activate"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="createProduct" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input id="productName" value={editingProduct ? editingProduct.name : newProduct.name}
                        onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. Premium Package"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Price (R)</Label>
                      <Input id="productPrice" type="number" value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, price: Number(e.target.value) }) : setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        placeholder="e.g. 4999"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Input id="productDescription" value={editingProduct ? editingProduct.description : newProduct.description}
                      onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Brief description of the product"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                      <Input id="commissionRate" type="number" step="0.1" min="0" max="100"
                        value={editingProduct ? (editingProduct.commissionRate * 100).toFixed(1) : (newProduct.commissionRate * 100).toFixed(1)}
                        onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, commissionRate: Number(e.target.value) / 100 }) : setNewProduct({ ...newProduct, commissionRate: Number(e.target.value) / 100 })}
                        placeholder="e.g. 5.0"
                      />
                      {(editingProduct || newProduct.price > 0) && (
                        <div className="text-sm text-gray-500 mt-1">
                          Commission per sale: R {( (editingProduct ? editingProduct.price : newProduct.price) * (editingProduct ? editingProduct.commissionRate : newProduct.commissionRate) ).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Product Category</Label>
                      <select id="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ..."
                        value={editingProduct ? editingProduct.category : newProduct.category}
                        onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, category: e.target.value as any }) : setNewProduct({ ...newProduct, category: e.target.value as any })}
                      >
                        {Object.entries(productCategories).map(([key, category]) => (<option key={key} value={key}>{category.name}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <ProductFeatureManager
                      features={editingProduct ? editingProduct.features : newProduct.features}
                      onChange={(features) => {
                        if (editingProduct) { setEditingProduct({ ...editingProduct, features }); }
                        else { setNewProduct({ ...newProduct, features }); }
                      }}
                    />
                  </div>
                  <Button className="w-full" onClick={editingProduct ? handleUpdateProduct : handleCreateProduct} disabled={isSubmitting || !!editingProduct}>
                    {isSubmitting && !editingProduct && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingProduct ? "Update Product (WIP)" : "Create Product"}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="categories" className="mt-6"><ProductCategoryManagement /></TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>

      {/* Product Comparison Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Product Comparison</DialogTitle><DialogDescription>Compare features and pricing</DialogDescription></DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b">Feature</th>
                  {products.filter((p) => productsToCompare.includes(p.id)).map((product) => (<th key={product.id} className="text-center p-2 border-b">{product.name}</th>))}
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border-b font-medium">Category</td>{products.filter((p) => productsToCompare.includes(p.id)).map((product) => (<td key={product.id} className="text-center p-2 border-b">{product.category ? productCategories[product.category]?.name : "Web Development"}</td>))}</tr>
                <tr><td className="p-2 border-b font-medium">Price</td>{products.filter((p) => productsToCompare.includes(p.id)).map((product) => (<td key={product.id} className="text-center p-2 border-b">R {product.price.toLocaleString()}</td>))}</tr>
                <tr><td className="p-2 border-b font-medium">Commission Rate</td>{products.filter((p) => productsToCompare.includes(p.id)).map((product) => (<td key={product.id} className="text-center p-2 border-b">{(product.commissionRate * 100).toFixed(1)}%</td>))}</tr>
                <tr><td className="p-2 border-b font-medium">Commission Amount</td>{products.filter((p) => productsToCompare.includes(p.id)).map((product) => (<td key={product.id} className="text-center p-2 border-b">R {(product.price * product.commissionRate).toLocaleString()}</td>))}</tr>
                <tr><td className="p-2 border-b font-medium">Status</td>{products.filter((p) => productsToCompare.includes(p.id)).map((product) => (<td key={product.id} className="text-center p-2 border-b"><Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-500" : "bg-red-500"}>{product.isActive ? "Active" : "Inactive"}</Badge></td>))}</tr>
                <tr><td className="p-2 border-b font-medium">Features</td>{products.filter((p) => productsToCompare.includes(p.id)).map((product) => (<td key={product.id} className="p-2 border-b"><ul className="list-disc pl-5">{product.features.map((feature, idx) => (<li key={idx} className="text-sm">{feature}</li>))}</ul></td>))}</tr>
              </tbody>
            </table>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCompareDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Price Update Dialog */}
      <Dialog open={showBulkPriceDialog} onOpenChange={setShowBulkPriceDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bulk Price Update</DialogTitle><DialogDescription>Update prices for {productsToCompare.length} selected products</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Update Type</Label><Select value={bulkPriceChange.type} onValueChange={(value: "percentage" | "fixed") => setBulkPriceChange({ ...bulkPriceChange, type: value })}><SelectTrigger aria-label="Select bulk price update type"><SelectValue placeholder="Select update type" /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage Change</SelectItem><SelectItem value="fixed">Fixed Amount Change</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>{bulkPriceChange.type === "percentage" ? "Percentage (%)" : "Amount (R)"}</Label><Input type="number" value={bulkPriceChange.value} onChange={(e) => setBulkPriceChange({ ...bulkPriceChange, value: parseFloat(e.target.value) || 0 })} placeholder={bulkPriceChange.type === "percentage" ? "e.g. 10" : "e.g. 500"} /><p className="text-sm text-gray-500">{bulkPriceChange.type === "percentage" ? `Enter a positive value to increase prices, negative to decrease` : `Enter a positive value to increase prices, negative to decrease`}</p></div>
            <div className="space-y-2"><Label>Preview</Label><div className="rounded-md border p-4 bg-gray-50"><p className="text-sm font-medium">Example changes:</p>{products.filter((p) => productsToCompare.includes(p.id)).slice(0, 3).map((product) => { let newPrice = product.price; if (bulkPriceChange.type === "percentage") { newPrice = product.price * (1 + bulkPriceChange.value / 100); } else { newPrice = product.price + bulkPriceChange.value; } newPrice = Math.max(0, newPrice); return (<div key={product.id} className="text-sm mt-2"><span className="font-medium">{product.name}:</span> R {product.price.toLocaleString()} → R {newPrice.toLocaleString()}</div>);})}{productsToCompare.length > 3 && (<p className="text-sm mt-2">...and {productsToCompare.length - 3} more products</p>)}</div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowBulkPriceDialog(false)}>Cancel</Button><Button onClick={handleBulkPriceUpdate}>Update Prices</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
