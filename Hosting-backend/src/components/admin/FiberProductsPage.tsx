import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/dashboard/Sidebar";
import { useStore } from "@/lib/store";
import { Wifi, Network, Router, Download, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FiberProductsPage = () => {
  const { products, toggleProductStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter only fiber products
  const fiberProducts = products.filter(
    (product) =>
      product.category === "fiber" &&
      (searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleToggleStatus = (id: string) => {
    toggleProductStatus(id);
    const product = products.find((p) => p.id === id);
    if (product) {
      toast({
        title: product.isActive ? "Product Deactivated" : "Product Activated",
        description: `${product.name} is now ${product.isActive ? "inactive" : "active"}`,
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Description",
      "Price (R)",
      "Commission Rate (%)",
      "Features",
      "Status",
    ];

    const csvData = [
      headers.join(","),
      ...fiberProducts.map((product) =>
        [
          `"${product.name}"`,
          `"${product.description}"`,
          product.price.toFixed(2),
          (product.commissionRate * 100).toFixed(1),
          `"${product.features.join("; ")}"`,
          product.isActive ? "Active" : "Inactive",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "fiber-products.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Fiber products have been exported to CSV",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-blue-500 mr-2" />
              <h1 className="text-3xl font-bold">Fiber Products</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button onClick={() => (window.location.href = "/products")}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Fiber Products</p>
                  <p className="text-2xl font-bold">{fiberProducts.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Wifi className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card className="bg-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Active Products</p>
                  <p className="text-2xl font-bold">
                    {fiberProducts.filter((p) => p.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Network className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="bg-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Avg. Commission</p>
                  <p className="text-2xl font-bold">
                    {fiberProducts.length > 0
                      ? (
                          (fiberProducts.reduce(
                            (sum, p) => sum + p.commissionRate,
                            0,
                          ) /
                            fiberProducts.length) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Router className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="w-full bg-white p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  Fiber Installation Products
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your fiber internet installation products and packages
                </p>
              </div>
              <div>
                <Input
                  placeholder="Search fiber products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price (R)</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiberProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No fiber products found. Add some fiber products to get
                        started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    fiberProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {product.features
                              .slice(0, 2)
                              .map((feature, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            {product.features.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          R {product.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {(product.commissionRate * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-green-600">
                            R{" "}
                            {(
                              product.price * product.commissionRate
                            ).toLocaleString()}{" "}
                            per sale
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                            className={
                              product.isActive ? "bg-green-500" : "bg-red-500"
                            }
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                (window.location.href = "/products")
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant={
                                product.isActive ? "destructive" : "outline"
                              }
                              size="sm"
                              onClick={() => handleToggleStatus(product.id)}
                            >
                              {product.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FiberProductsPage;
