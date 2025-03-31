import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Check, ArrowRight } from "lucide-react";

const ClientRegistration = () => {
  const { currentUser, products, addClient } = useStore();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Select product, 2: Client details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

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

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleContinue = () => {
    if (!selectedProduct) {
      toast({
        title: "Product Required",
        description: "Please select a product for this client",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !currentUser) {
      return;
    }

    const selectedProductDetails = products.find(
      (p) => p.id === selectedProduct,
    );
    if (!selectedProductDetails) return;

    const newClient = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      referredBy: currentUser.name,
      product: selectedProductDetails.name,
      status: "pending" as const,
      joinDate: new Date().toISOString().split("T")[0],
    };

    addClient(newClient);

    toast({
      title: "Client Registered",
      description: `${formData.name} has been successfully registered with ${selectedProductDetails.name}`,
    });

    // Reset form and navigate to clients page
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setSelectedProduct(null);
    setStep(1);
    navigate("/agent/clients");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Register New Client</h1>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? "bg-primary text-white" : "bg-gray-200"}`}
          >
            1
          </div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? "bg-primary text-white" : "bg-gray-200"}`}
          >
            2
          </div>
        </div>
      </div>

      {step === 1 ? (
        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Select a Product</h2>
          <p className="text-gray-500 mb-6">
            Choose a product to offer to your client
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {activeProducts.map((product) => (
              <div
                key={product.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedProduct === product.id ? "border-primary ring-2 ring-primary/20" : "hover:border-gray-300"}`}
                onClick={() => handleProductSelect(product.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {product.description}
                    </p>
                  </div>
                  {selectedProduct === product.id && (
                    <div className="bg-primary text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <p className="font-bold">
                    R {product.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    {(product.commissionRate * 100).toFixed(1)}% commission (R{" "}
                    {(product.price * product.commissionRate).toLocaleString()})
                  </p>
                </div>

                <div className="mt-3 space-y-1">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <Check className="h-3 w-3 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {product.features.length > 3 && (
                    <p className="text-xs text-gray-500 pl-5">
                      +{product.features.length - 3} more features
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedProduct}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Client Information</h2>
          <p className="text-gray-500 mb-6">
            Enter the client's details for{" "}
            {products.find((p) => p.id === selectedProduct)?.name}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back to Products
              </Button>
              <Button type="submit">Register Client</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ClientRegistration;
