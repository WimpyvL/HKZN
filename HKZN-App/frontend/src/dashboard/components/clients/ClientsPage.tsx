import React, { useState, useEffect, useCallback } from "react"; // Ensure useEffect and useCallback are imported
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
import Sidebar from "../dashboard/Sidebar";
// import { useStore, Client } from "@/lib/store"; // Remove useStore
import ClientFormModal from "../modals/ClientFormModal";
import ViewDetailsModal from "../modals/ViewDetailsModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons
import ConfirmDialog from "../modals/ConfirmDialog";
import { toast } from "@/components/ui/use-toast";
import { Download, Filter, Mail, Phone, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define Client type locally (adjust based on actual DB structure/API response)
interface Client {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  referred_by_agent_id?: string | number | null; // From API
  product_id?: string | number | null; // From API (Note: Not in schema, but kept for ModalClient mapping)
  referredBy?: string; // Potentially fetched/mapped later
  product?: string; // Potentially fetched/mapped later
  status: "active" | "inactive" | "pending";
  joinDate?: string;
  created_at?: string; // From API
  address?: string;
  notes?: string; // Added from schema
  updated_at?: string; // Added from schema
}

// Define ApiClient type for raw data mapping
interface ApiClient {
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

// Type expected by ClientFormModal (from lib/store.ts)
interface ModalClient {
    id: string;
    name: string;
    email: string;
    phone: string;
    referredBy: string; // Modal expects name or ID string
    product: string; // Modal expects name or ID string
    status: "active" | "inactive" | "pending";
    joinDate: string;
    address?: string;
}


// Removed unused ClientsPageProps interface

const ClientsPage = () => { // Removed unused props parameter

  // Add state for clients, loading, error
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Fetch agents and products to map IDs to names for filtering/display

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch clients function
  const fetchClients = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/get_clients.php`);
        if (!response.ok) {
          // Attempt to get error message from response body if available
          let errorBody = `HTTP error! status: ${response.status}`;
          try {
              const errorJson = await response.json();
              if (errorJson && errorJson.message) {
                  errorBody += ` - ${errorJson.message}`;
              }
          } catch (e) { /* Ignore if response body is not JSON */ }
          throw new Error(errorBody);
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch clients.');
        }
        const fetchedClients = Array.isArray(result.data) ? result.data.map((c: ApiClient) => ({ // Use ApiClient type
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          address: c.address,
          referred_by_agent_id: c.referred_by_agent_id,
          product_id: c.product_id,
          status: c.status ?? 'pending',
          joinDate: c.join_date ?? (c.created_at ? c.created_at.split(' ')[0] : new Date().toISOString().split('T')[0]),
          created_at: c.created_at,
          // Map other fields if needed for Client type
        })) : [];
        setClients(fetchedClients);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while fetching clients.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error fetching clients:", errorMessage);
        setError(errorMessage);
        setClients([]);
      } finally {
        setLoading(false);
      }
    }, [apiBaseUrl]); // Dependency: apiBaseUrl

  // Initial fetch on component mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]); // Dependency: fetchClients function

  // Function to refetch clients
  const refetchClients = useCallback(() => {
      fetchClients(); // Call the memoized fetch function
  }, [fetchClients]);


  // Keep state for modals, selection etc.
  const [selectedClientId, setSelectedClientId] = useState<string | number | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ModalClient | null>(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [viewingClient, setViewingClient] = useState<ModalClient | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white";
      case "inactive":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Helper to convert API Client to ModalClient
  const convertToModalClient = (client: Client): ModalClient => ({
      id: String(client.id),
      name: client.name,
      email: client.email,
      phone: client.phone ?? '',
      referredBy: String(client.referred_by_agent_id ?? 'N/A'), // Placeholder ID
      product: String(client.product_id ?? 'N/A'), // Placeholder ID (not in table)
      status: client.status ?? 'pending',
      joinDate: client.joinDate ?? (client.created_at ? client.created_at.split(' ')[0] : new Date().toISOString().split('T')[0]),
      address: client.address,
  });

  // --- Enable Add Client, keep others disabled ---
  const handleAddClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: Client) => {
    toast({ title: "Info", description: "Edit client functionality needs backend integration." });
    setEditingClient(convertToModalClient(client));
    // setShowClientForm(true); // Keep modal disabled for now
  };

  const handleViewClient = (client: Client) => {
    setViewingClient(convertToModalClient(client));
    setShowViewDetails(true);
  };

  const handleDeleteClient = (id: string | number) => {
    toast({ title: "Info", description: "Delete client functionality needs backend integration." });
    // setClientToDelete(id);
    // setShowDeleteConfirm(true);
  };

  const confirmDeleteClient = () => {
    toast({ title: "Info", description: "Confirm delete client functionality needs backend integration." });
    setShowDeleteConfirm(false);
  };
  // --- End CRUD Handlers ---

  const exportClientsToCSV = () => {
    // Calculate filtered clients inside this function to ensure it uses the latest state
     const filteredClientsForExport = clients.filter((client) => {
        const matchesSearch =
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (client.phone && client.phone.includes(searchQuery));
        const matchesStatus = statusFilter === "all" || client.status === statusFilter;
        const matchesAgent = agentFilter === "all" || String(client.referred_by_agent_id) === agentFilter;
        const matchesProduct = productFilter === "all" || String(client.product_id) === productFilter; // product_id not in table
        return matchesSearch && matchesStatus && matchesAgent; // Removed product match
     });

    const headers = ["Name", "Email", "Phone", "Referred By ID", "Status", "Join Date", "Address", "Notes"];

    const csvData = [
      headers.join(","),
      ...filteredClientsForExport.map((client) =>
        [
          `"${client.name}"`,
          `"${client.email}"`,
          `"${client.phone ?? ''}"`,
          `"${client.referred_by_agent_id ?? ''}"`,
          `"${client.status}"`,
          `"${client.joinDate ?? ''}"`,
          `"${client.address ?? ''}"`,
          `"${client.notes ?? ''}"`, // Added notes
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "clients.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Clients have been exported to CSV",
    });
  };

  const handleContactClient = (type: "email" | "phone", client: Client) => {
    if (type === "email") {
      window.location.href = `mailto:${client.email}`;
    } else if (client.phone) {
      window.location.href = `tel:${client.phone.replace(/[^0-9]/g, "")}`;
    }
  };

  // Calculate statistics (using fetched clients) - Moved inside render logic

  // TODO: Get unique agent/product IDs/names from fetched data for filters
  const agentNames = ["all"]; // Placeholder
  const productNames = ["all"]; // Placeholder

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Clients</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportClientsToCSV}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button onClick={handleAddClient}>
                <UserPlus className="mr-2 h-4 w-4" /> Add New Client
              </Button>
            </div>
          </div>

          {/* Stats Cards - Calculate inside render */}
          {!loading && !error && (() => {
              const filteredClientsForStats = clients.filter((client) => { // Use original clients list for stats
                  const matchesStatus = statusFilter === "all" || client.status === statusFilter;
                  const matchesAgent = agentFilter === "all" || String(client.referred_by_agent_id) === agentFilter;
                  // const matchesProduct = productFilter === "all" || String(client.product_id) === productFilter; // product_id not in table
                  return matchesStatus && matchesAgent; // Removed product match
              });
              const activeClientsCount = filteredClientsForStats.filter(c => c.status === "active").length;
              const pendingClientsCount = filteredClientsForStats.filter(c => c.status === "pending").length;
              const inactiveClientsCount = filteredClientsForStats.filter(c => c.status === "inactive").length;
              return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-white p-4">
                          <div className="flex justify-between items-center">
                              <div><p className="text-sm text-gray-500">Active Clients</p><p className="text-2xl font-bold">{activeClientsCount}</p></div>
                              <div className="p-3 bg-green-100 rounded-full"><UserPlus className="h-6 w-6 text-green-600" /></div>
                          </div>
                      </Card>
                      <Card className="bg-white p-4">
                          <div className="flex justify-between items-center">
                              <div><p className="text-sm text-gray-500">Pending Clients</p><p className="text-2xl font-bold">{pendingClientsCount}</p></div>
                              <div className="p-3 bg-yellow-100 rounded-full"><UserPlus className="h-6 w-6 text-yellow-600" /></div>
                          </div>
                      </Card>
                      <Card className="bg-white p-4">
                          <div className="flex justify-between items-center">
                              <div><p className="text-sm text-gray-500">Inactive Clients</p><p className="text-2xl font-bold">{inactiveClientsCount}</p></div>
                              <div className="p-3 bg-red-100 rounded-full"><UserPlus className="h-6 w-6 text-red-600" /></div>
                          </div>
                      </Card>
                  </div>
              );
          })()}


          <Card className="w-full bg-white p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Client List</h2>
                <p className="text-sm text-gray-500">
                  Manage and view all client information
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <SearchBar
                  onSearch={setSearchQuery}
                  placeholder="Search clients..."
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter Clients</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Status</p>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Agent</p>
                        <Select
                          value={agentFilter}
                          onValueChange={setAgentFilter}
                          disabled // Disable filter until agents are fetched for names
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by agent (WIP)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Agents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium mb-2">Product</p>
                        <Select
                          value={productFilter}
                          onValueChange={setProductFilter}
                          disabled // Disable filter as product_id not available
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by product (N/A)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter("all");
                        setAgentFilter("all");
                        setProductFilter("all");
                        setSearchQuery("");
                      }}
                    >
                      Reset Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Add Loading and Error states */}
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

            {!loading && !error && (() => {
                // Calculate filtered clients inside the render logic
                const filteredClients = clients.filter((client) => {
                    const matchesSearch =
                      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (client.phone && client.phone.includes(searchQuery));
                    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
                    const matchesAgent = agentFilter === "all" || String(client.referred_by_agent_id) === agentFilter;
                    // const matchesProduct = productFilter === "all" || String(client.product_id) === productFilter; // product_id not available
                    return matchesSearch && matchesStatus && matchesAgent; // Removed product match
                });

                return (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Referred By (ID)</TableHead>
                          {/* <TableHead>Product (ID)</TableHead> */}
                          <TableHead>Status</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClients.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7} // Adjusted colspan
                              className="text-center py-8 text-gray-500"
                            >
                              No clients found matching your criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredClients.map((client) => (
                            <TableRow
                              key={client.id}
                              className={
                                selectedClientId === client.id ? "bg-gray-50" : ""
                              }
                              onClick={() => setSelectedClientId(client.id)}
                            >
                              <TableCell className="font-medium">
                                {client.name}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {client.email}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleContactClient("email", client);
                                    }}
                                  >
                                    <Mail className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {client.phone}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleContactClient("phone", client);
                                    }}
                                  >
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>{client.referred_by_agent_id ?? 'N/A'}</TableCell>
                              {/* <TableCell><Badge variant="outline">{client.product_id ?? 'N/A'}</Badge></TableCell> */}
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={getStatusColor(client.status)}
                                >
                                  {client.status.charAt(0).toUpperCase() +
                                    client.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{client.joinDate}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewClient(client);
                                    }}
                                  >
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClient(client);
                                    }}
                                    disabled // Disable button
                                  >
                                    Edit (WIP)
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClient(client.id);
                                    }}
                                    disabled // Disable button
                                  >
                                    Delete (WIP)
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                );
            })()} {/* End loading/error check and IIFE */}
          </Card>
        </div>
      </main>

      {/* Modals */}
      <ClientFormModal
        open={showClientForm}
        onClose={() => setShowClientForm(false)}
        client={editingClient}
        onClientAdded={refetchClients} // Pass refetch function
      />

      <ViewDetailsModal
        open={showViewDetails}
        onClose={() => setShowViewDetails(false)}
        title="Client Details"
        data={viewingClient || {}}
        onEdit={() => {
          setShowViewDetails(false);
          if (viewingClient) {
            // Find original client data to pass to handleEditClient
             const originalClient = clients.find(c => String(c.id) === viewingClient.id);
             if (originalClient) {
                handleEditClient(originalClient);
             }
          }
        }}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteClient}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ClientsPage;
