import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import SearchBar from "../dashboard/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { useStore, Client, Product } from "@/lib/store"; // Remove useStore
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Mail, Phone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define types locally
interface ApiClient { // Type for raw API data
  id: string | number;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  referred_by_agent_id?: string | number | null; // snake_case from API
  product_id?: string | number | null; // snake_case from API
  status: "active" | "inactive" | "pending";
  created_at: string;
  join_date?: string; // snake_case from API
}

interface Client { // Type for processed data
  id: string | number;
  name: string;
  email: string;
  phone: string;
  referredByAgentId?: string | number | null; // Use camelCase
  productId?: string | number | null; // Use camelCase
  product?: string; // Mapped later
  status: "active" | "inactive" | "pending";
  joinDate?: string; // Use camelCase
  createdAt?: string; // Use camelCase
  address?: string;
  notes?: string;
}

interface Product {
  id: string | number;
  name: string;
  // Add other fields if needed for display
}

const AgentClients = () => {
  // const { clients, currentUser, products } = useStore(); // Remove useStore

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // Add state for products
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  // TODO: Get current agent's ID (from currentUser in auth context/store if available)
  const currentAgentId = "AGENT_ID_PLACEHOLDER"; // Replace with actual agent ID logic

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch clients and products
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsRes, productsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/get_clients.php`), // Fetch all clients for now
        fetch(`${apiBaseUrl}/get_products.php`)
      ]);

      if (!clientsRes.ok) throw new Error(`Failed to fetch clients: ${clientsRes.status}`);
      if (!productsRes.ok) throw new Error(`Failed to fetch products: ${productsRes.status}`);

      const clientsResult = await clientsRes.json();
      const productsResult = await productsRes.json();

      if (!clientsResult.success) throw new Error(clientsResult.message || 'Failed to fetch clients.');
      if (!productsResult.success) throw new Error(productsResult.message || 'Failed to fetch products.');

      // Map product data for easier lookup
      const productMap = new Map<string | number, string>();
      if (Array.isArray(productsResult.data)) {
          productsResult.data.forEach((p: Product) => productMap.set(p.id, p.name));
      }
      setProducts(Array.isArray(productsResult.data) ? productsResult.data : []); // Store full product data if needed

      // Map and filter clients
      const fetchedClients = Array.isArray(clientsResult.data) ? clientsResult.data
        .filter((c: ApiClient) => String(c.referred_by_agent_id) === String(currentAgentId)) // Filter by agent ID, use ApiClient type
        .map((c: ApiClient) => ({ // Use ApiClient type
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          address: c.address,
          referredByAgentId: c.referred_by_agent_id,
          productId: c.product_id,
          status: c.status ?? 'pending',
          joinDate: c.join_date ?? (c.created_at ? c.created_at.split(' ')[0] : new Date().toISOString().split('T')[0]),
          createdAt: c.created_at,
          product: productMap.get(c.product_id ?? '') || `ID: ${c.product_id ?? 'N/A'}`, // Map product ID to name
        })) : [];
      setClients(fetchedClients);

    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) errorMessage = err.message;
      console.error("Error fetching agent clients/products:", errorMessage);
      setError(errorMessage);
      setClients([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, currentAgentId]); // Add currentAgentId dependency

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter clients based on search and filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone && client.phone.includes(searchQuery));
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesProduct = productFilter === "all" || String(client.productId) === productFilter; // Corrected property name
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active": return "bg-green-500 text-white";
      case "inactive": return "bg-red-500 text-white";
      case "pending": return "bg-yellow-500 text-black";
      default: return "bg-gray-500 text-white";
    }
  };

   const handleContactClient = (type: "email" | "phone", client: Client) => {
    if (type === "email") {
      window.location.href = `mailto:${client.email}`;
    } else if (client.phone) {
      window.location.href = `tel:${client.phone.replace(/[^0-9]/g, "")}`;
    }
  };

  // Get unique product options for filter (using fetched products)
  // Ensure 'all' is handled separately or consistently as an object if needed by SelectItem
  const productOptions: Array<{ id: string; name: string }> = products.map(p => ({ id: String(p.id), name: p.name }));


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Clients</h1>

      <Card className="w-full bg-white p-6">
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Client List</h2>
            <p className="text-sm text-gray-500">View your referred clients</p>
          </div>
           <div className="flex flex-col md:flex-row gap-2">
             <SearchBar onSearch={setSearchQuery} placeholder="Search clients..." />
             {/* Filters */}
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
             </Select>
             <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by product" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {/* Map over the productOptions array of objects */}
                    {productOptions.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                            {p.name}
                        </SelectItem>
                    ))}
                </SelectContent>
             </Select>
           </div>
        </div>

        {loading && (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2">Loading clients...</span>
            </div>
        )}
        {error && (
            <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Fetching Clients</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {!loading && !error && (
            <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredClients.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No clients found.
                    </TableCell>
                    </TableRow>
                ) : (
                    filteredClients.map((client) => (
                    <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                {client.email}
                                <Button variant="ghost" size="icon" className="ml-1 h-6 w-6" onClick={(e) => { e.stopPropagation(); handleContactClient("email", client); }}>
                                    <Mail className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableCell>
                        <TableCell>
                             <div className="flex items-center">
                                {client.phone}
                                <Button variant="ghost" size="icon" className="ml-1 h-6 w-6" onClick={(e) => { e.stopPropagation(); handleContactClient("phone", client); }}>
                                    <Phone className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{client.product}</Badge></TableCell>
                        <TableCell>
                        <Badge variant="secondary" className={getStatusColor(client.status)}>
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </Badge>
                        </TableCell>
                        <TableCell>{client.joinDate}</TableCell>
                        <TableCell>
                            {/* Add View button if needed */}
                            <Button variant="outline" size="sm" disabled>View (WIP)</Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            </div>
        )}
      </Card>
    </div>
  );
};

export default AgentClients;
