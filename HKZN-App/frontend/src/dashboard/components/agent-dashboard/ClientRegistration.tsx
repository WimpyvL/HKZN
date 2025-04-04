import React, { useState, useEffect, useCallback } from "react"; // Import hooks
import { useAppStore } from "@/dashboard/lib/store"; // Corrected import path
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Check, ArrowRight, Loader2, AlertCircle } from "lucide-react"; // Import Loader/Icons
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define Product type locally
interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  commissionRate: number; // Use camelCase consistent with form/modal state
  features: string[];
  category: string;
  isActive?: boolean;
  created_at?: string;
}

// Define ApiProduct type for raw data mapping
interface ApiProduct {
  id: string | number;
  name: string;
  description: string;
  price: string | number;
  commission_rate: string | number; // Use snake_case from API
  features: string[] | string;
  category: string;
  is_active?: boolean | number | string; // Use snake_case from API
  created_at?: string;
}

const ClientRegistration = () => {
  const { currentUser } = useAppStore(); // Corrected hook name
  // const { products, addClient } = useAppStore(); // Remove store usage for products/addClient
  const navigate = useNavigate();

  // State for products, form, steps, loading, error
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | number | null>(null); // Allow number ID
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/get_products.php`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Failed to fetch products.');
      const fetchedProducts = Array.isArray(result.data) ? result.data.map((p: ApiProduct) => ({ // Use ApiProduct type
           id: p.id,
           name: p.name,
           description: p.description,
           price: Number(p.price) || 0,
           commissionRate: Number(p.commission_rate) || 0, // Map snake_case
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
      setProductError(errorMessage);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "agent") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Filter active products only
  const activeProducts = products.filter((p) => p.isActive);

  const handleProductSelect = (productId: string | number) => {
    setSelectedProduct(productId);
  };

  const handleContinue = () => {
    if (!selectedProduct) {
      toast({ title: "Product Required", description: "Please select a product", variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => { // Make async
    e.preventDefault();
    if (!selectedProduct || !currentUser) return; // Guard against missing data

    setIsSubmitting(true);

    const clientDataForApi = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      referredByAgentId: currentUser.id, // Use current agent's ID
      productId: selectedProduct, // Send selected product ID (Note: not in DB schema)
      status: "pending", // Default status
    };

    console.log("Submitting client registration:", clientDataForApi);

    try {
      const response = await fetch(`${apiBaseUrl}/add_client.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(clientDataForApi),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to register client (HTTP ${response.status})`);
      }

      toast({
        title: "Client Registered",
        description: `${formData.name} has been successfully registered.`,
      });

      // Reset form and navigate
      setFormData({ name: "", email: "", phone: "", address: "" });
      setSelectedProduct(null);
      setStep(1);
      navigate("/agent/clients"); // Navigate to agent's client list

    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred during registration.';
      if (err instanceof Error) errorMessage = err.message;
      console.error("Error registering client:", errorMessage);
      toast({ title: "Registration Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Register New Client</h1>
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? "bg-primary text-white" : "bg-gray-200"}`}>1</div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? "bg-primary text-white" : "bg-gray-200"}`}>2</div>
        </div>
      </div>

      {step === 1 ? (
        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Select a Product</h2>
          <p className="text-gray-500 mb-6">Choose a product to offer to your client</p>

          {loadingProducts && (
            <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /><span className="ml-2">Loading products...</span></div>
          )}
          {productError && (
            <Alert variant="destructive" className="my-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Products</AlertTitle><AlertDescription>{productError}</AlertDescription></Alert>
          )}

          {!loadingProducts && !productError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {activeProducts.length === 0 ? (
                   <p className="col-span-full text-center text-gray-500">No active products available.</p>
                ) : (
                  activeProducts.map((product) => (
                    <div key={product.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedProduct === product.id ? "border-primary ring-2 ring-primary/20" : "hover:border-gray-300"}`}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.description}</p>
                        </div>
                        {selectedProduct === product.id && (<div className="bg-primary text-white p-1 rounded-full"><Check className="h-4 w-4" /></div>)}
                      </div>
                      <div className="mt-4">
                        <p className="font-bold">R {product.price.toLocaleString()}</p>
                        <p className="text-sm text-green-600">{(product.commissionRate * 100).toFixed(1)}% commission (R {(product.price * product.commissionRate).toLocaleString()})</p>
                      </div>
                      <div className="mt-3 space-y-1">
                        {product.features.slice(0, 3).map((feature, idx) => (<div key={idx} className="flex items-center text-sm"><Check className="h-3 w-3 text-green-500 mr-2" /><span>{feature}</span></div>))}
                        {product.features.length > 3 && (<p className="text-xs text-gray-500 pl-5">+{product.features.length - 3} more features</p>)}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button className="w-full" onClick={handleContinue} disabled={!selectedProduct}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </Card>
      ) : (
        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Client Information</h2>
          <p className="text-gray-500 mb-6">
            Enter the client's details for {products.find(p => p.id === selectedProduct)?.name || 'Selected Product'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City" disabled={isSubmitting} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>Back to Products</Button>
              <Button type="submit" disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Register Client
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ClientRegistration;
