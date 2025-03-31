import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Check, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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

const ProductSelection = () => {
  const { products, currentUser } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showProductDetails, setShowProductDetails] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [productsToCompare, setProductsToCompare] = useState<string[]>([]);

  // Filter active products only
  const activeProducts = products.filter((p) => p.isActive);

  // Apply search filter
  const filteredProducts = activeProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      toast({
        title: "Product Selected",
        description: `${product.name} has been selected for your next client`,
      });
    }
  };

  const handleShowDetails = (productId: string) => {
    setShowProductDetails(productId);
  };

  const handleToggleCompare = (productId: string) => {
    if (productsToCompare.includes(productId)) {
      setProductsToCompare(productsToCompare.filter((id) => id !== productId));
    } else {
      setProductsToCompare([...productsToCompare, productId]);
    }
  };

  const handleCompare = () => {
    if (productsToCompare.length < 2) {
      toast({
        title: "Comparison Error",
        description: "Please select at least 2 products to compare",
        variant: "destructive",
      });
      return;
    }
    setShowComparisonDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Available Products</h2>
          <p className="text-gray-500">
            Select a product to recommend to your clients. Your commission rate
            is shown for each product.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          {productsToCompare.length > 0 && (
            <Button variant="outline" onClick={handleCompare}>
              Compare ({productsToCompare.length})
            </Button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="bg-white p-6 text-center">
          <p className="text-gray-500">
            No products found matching your search criteria.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`bg-white relative ${selectedProduct === product.id ? "ring-2 ring-primary" : ""} ${productsToCompare.includes(product.id) ? "bg-blue-50" : ""}`}
            >
              {productsToCompare.includes(product.id) && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-gray-500">{product.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-3xl font-bold">
                    R {product.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500">/year</span>
                  <p className="text-sm text-green-600 mt-1">
                    {(product.commissionRate * 100).toFixed(1)}% commission rate
                  </p>
                  <p className="text-sm text-blue-600">
                    Earn R{" "}
                    {(product.price * product.commissionRate).toLocaleString()}{" "}
                    per sale
                  </p>
                </div>

                <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => handleSelectProduct(product.id)}
                    variant={
                      selectedProduct === product.id ? "default" : "outline"
                    }
                  >
                    {selectedProduct === product.id
                      ? "Selected"
                      : "Select Package"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleShowDetails(product.id)}
                    >
                      <Info className="h-4 w-4 mr-1" /> Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggleCompare(product.id)}
                    >
                      {productsToCompare.includes(product.id)
                        ? "Remove"
                        : "Compare"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Details Dialog */}
      <Dialog
        open={!!showProductDetails}
        onOpenChange={() => setShowProductDetails(null)}
      >
        <DialogContent>
          {showProductDetails && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {products.find((p) => p.id === showProductDetails)?.name}
                </DialogTitle>
                <DialogDescription>
                  {
                    products.find((p) => p.id === showProductDetails)
                      ?.description
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-xl font-bold">
                      R{" "}
                      {products
                        .find((p) => p.id === showProductDetails)
                        ?.price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Commission</p>
                    <p className="text-xl font-bold text-green-600">
                      R{" "}
                      {(products.find((p) => p.id === showProductDetails)
                        ?.price || 0) *
                        (
                          products.find((p) => p.id === showProductDetails)
                            ?.commissionRate || 0
                        ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {products
                      .find((p) => p.id === showProductDetails)
                      ?.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Selling Points</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        1
                      </span>
                      <span>
                        Highlight the{" "}
                        {products
                          .find((p) => p.id === showProductDetails)
                          ?.features[0]?.toLowerCase()}{" "}
                        feature
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        2
                      </span>
                      <span>Emphasize the value compared to competitors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        3
                      </span>
                      <span>Mention ongoing support and updates included</span>
                    </li>
                  </ul>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowProductDetails(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleSelectProduct(showProductDetails);
                    setShowProductDetails(null);
                  }}
                >
                  Select This Package
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Comparison Dialog */}
      <Dialog
        open={showComparisonDialog}
        onOpenChange={setShowComparisonDialog}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Product Comparison</DialogTitle>
            <DialogDescription>
              Compare features and pricing across selected products
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b">Feature</th>
                  {products
                    .filter((p) => productsToCompare.includes(p.id))
                    .map((product) => (
                      <th key={product.id} className="text-center p-2 border-b">
                        {product.name}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b font-medium">Price</td>
                  {products
                    .filter((p) => productsToCompare.includes(p.id))
                    .map((product) => (
                      <td key={product.id} className="text-center p-2 border-b">
                        R {product.price.toLocaleString()}
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="p-2 border-b font-medium">Commission Rate</td>
                  {products
                    .filter((p) => productsToCompare.includes(p.id))
                    .map((product) => (
                      <td key={product.id} className="text-center p-2 border-b">
                        {(product.commissionRate * 100).toFixed(1)}%
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="p-2 border-b font-medium">
                    Commission Amount
                  </td>
                  {products
                    .filter((p) => productsToCompare.includes(p.id))
                    .map((product) => (
                      <td key={product.id} className="text-center p-2 border-b">
                        R{" "}
                        {(
                          product.price * product.commissionRate
                        ).toLocaleString()}
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="p-2 border-b font-medium">Features</td>
                  {products
                    .filter((p) => productsToCompare.includes(p.id))
                    .map((product) => (
                      <td key={product.id} className="p-2 border-b">
                        <ul className="list-disc pl-5">
                          {product.features.map((feature, idx) => (
                            <li key={idx} className="text-sm">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowComparisonDialog(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                const bestProduct = products
                  .filter((p) => productsToCompare.includes(p.id))
                  .sort(
                    (a, b) =>
                      b.price * b.commissionRate - a.price * a.commissionRate,
                  )[0];

                if (bestProduct) {
                  handleSelectProduct(bestProduct.id);
                  setShowComparisonDialog(false);
                  toast({
                    title: "Highest Commission Selected",
                    description: `${bestProduct.name} offers the highest commission and has been selected`,
                  });
                }
              }}
            >
              Select Highest Commission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductSelection;
