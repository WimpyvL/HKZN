import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { useStore, Product } from "@/lib/store"; // Remove useStore
import { toast } from "@/components/ui/use-toast";
import { Edit, Tag } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';

// Define Product type locally
interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  commissionRate: number;
  features: string[];
  category: string;
  isActive?: boolean;
  created_at?: string;
}

const SolarProductsPage = () => {
  // const { products, toggleProductStatus } = useStore(); // Remove useStore

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/get_products.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Failed to fetch products.');
      const fetchedProducts = Array.isArray(result.data) ? result.data.map((p: any) => ({
           id: p.id,
           name: p.name,
           description: p.description,
           price: Number(p.price) || 0,
           commissionRate: Number(p.commission_rate) || 0,
           features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features || '[]') : []),
           category: p.category,
           isActive: p.is_active ?? true,
           created_at: p.created_at
       })) : [];
      setProducts(fetchedProducts);
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) errorMessage = err.message;
      console.error("Error fetching products:", errorMessage);
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter specifically for solar products
  const solarProducts = products.filter((product) => product.category === "solar");

  const handleToggleProductStatus = (id: string | number) => {
    toast({ title: "Info", description: "Toggle status functionality needs backend integration." });
    // TODO: Implement API call to toggle status
  };

  const handleEditProduct = (product: Product) => {
     toast({ title: "Info", description: "Edit product functionality needs backend integration." });
     // TODO: Implement logic to open an edit modal or navigate to edit page
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Solar Products</h1>

          <Card className="w-full bg-white p-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solarProducts.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">No solar products found.</p>
                ) : (
                    solarProducts.map((product) => (
                    <Card key={product.id} className="flex flex-col">
                        <div className="p-4 flex-grow">
                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        <p className="font-bold text-lg mb-3">R {product.price.toLocaleString()}</p>
                        <div className="space-y-1 mb-4">
                            <p className="text-xs font-medium text-gray-500">Features:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600">
                            {product.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                            </ul>
                        </div>
                        <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-500" : "bg-red-500"}>
                            {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} disabled>
                            <Edit className="h-4 w-4 mr-1" /> Edit (WIP)
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleProductStatus(product.id)} disabled>
                            <Tag className="h-4 w-4 mr-1" /> {product.isActive ? "Deactivate" : "Activate"} (WIP)
                        </Button>
                        </div>
                    </Card>
                    ))
                )}
                </div>
             )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SolarProductsPage;
