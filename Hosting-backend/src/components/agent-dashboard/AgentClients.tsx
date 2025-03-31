import React, { useState, useEffect } from "react";
import { useStore, Client } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Phone, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import ViewDetailsModal from "../modals/ViewDetailsModal";

const AgentClients = () => {
  const { clients, currentUser, products } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [showViewDetails, setShowViewDetails] = useState(false);

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "agent") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Filter clients for this agent
  const agentClients = clients.filter(
    (client) => currentUser && client.referredBy === currentUser.name,
  );

  // Apply filters
  const filteredClients = agentClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesProduct =
      productFilter === "all" || client.product === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  // Get unique product names for filters
  const productNames = ["all", ...new Set(agentClients.map((c) => c.product))];

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewClient = (client: Client) => {
    setViewingClient(client);
    setShowViewDetails(true);
  };

  const handleContactClient = (type: "email" | "phone", client: Client) => {
    if (type === "email") {
      window.location.href = `mailto:${client.email}`;
    } else {
      window.location.href = `tel:${client.phone.replace(/[^0-9]/g, "")}`;
    }
  };

  const exportClientsToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Product",
      "Status",
      "Join Date",
    ];

    const csvData = [
      headers.join(","),
      ...filteredClients.map((client) =>
        [
          `"${client.name}"`,
          `"${client.email}"`,
          `"${client.phone}"`,
          `"${client.product}"`,
          `"${client.status}"`,
          `"${client.joinDate}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "my-clients.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Your clients have been exported to CSV",
    });
  };

  // Calculate statistics
  const activeClientsCount = agentClients.filter(
    (c) => c.status === "active",
  ).length;
  const pendingClientsCount = agentClients.filter(
    (c) => c.status === "pending",
  ).length;
  const inactiveClientsCount = agentClients.filter(
    (c) => c.status === "inactive",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Clients</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportClientsToCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => navigate("/agent/register-client")}>
            <UserPlus className="mr-2 h-4 w-4" /> Register New Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Clients</p>
              <p className="text-2xl font-bold">{activeClientsCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending Clients</p>
              <p className="text-2xl font-bold">{pendingClientsCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <UserPlus className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Inactive Clients</p>
              <p className="text-2xl font-bold">{inactiveClientsCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <UserPlus className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="w-full bg-white p-6">
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Client List</h2>
            <p className="text-sm text-gray-500">
              View and manage your clients
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-64"
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  <p className="text-sm font-medium mb-2">Product</p>
                  <Select
                    value={productFilter}
                    onValueChange={setProductFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {productNames
                        .filter((name) => name !== "all")
                        .map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setStatusFilter("all");
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
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    {agentClients.length === 0 ? (
                      <>
                        <p>You haven't registered any clients yet</p>
                        <Button
                          variant="link"
                          onClick={() => navigate("/agent/register-client")}
                          className="mt-2"
                        >
                          Register your first client
                        </Button>
                      </>
                    ) : (
                      "No clients found matching your criteria"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {client.email}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-6 w-6"
                          onClick={() => handleContactClient("email", client)}
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
                          onClick={() => handleContactClient("phone", client)}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.product}</Badge>
                    </TableCell>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewClient(client)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* View Details Modal */}
      <ViewDetailsModal
        open={showViewDetails}
        onClose={() => setShowViewDetails(false)}
        title="Client Details"
        data={viewingClient || {}}
      />
    </div>
  );
};

export default AgentClients;
