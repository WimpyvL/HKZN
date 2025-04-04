import React, { useState, useEffect, useCallback } from "react"; // Import useEffect, useCallback
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
// import { useStore, Agent } from "@/lib/store"; // Remove useStore
import AgentFormModal from "../modals/AgentFormModal";
import ViewDetailsModal from "../modals/ViewDetailsModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons
import ConfirmDialog from "../modals/ConfirmDialog";
import { toast } from "@/components/ui/use-toast"; // Import toast for temporary messages

// Define Agent type locally based on lib/store.ts and get_agents.php output
interface Agent {
  id: string | number;
  name: string;
  email: string; // Assuming email comes from users table join eventually
  phone?: string;
  referralCode: string; // Mapped from referral_code
  activeClients?: number;
  totalSales?: number;
  commission_rate: number; // From API
  status?: "active" | "inactive" | "pending";
  joinDate?: string; // Mapped from join_date
  created_at?: string;
}

// Type expected by AgentFormModal (from lib/store.ts) for editing/viewing
interface ModalAgent {
    id: string;
    name: string;
    email: string;
    phone: string;
    referralCode: string;
    activeClients: number;
    totalSales: number;
    commissionRate: number; // Modal expects camelCase
    status: "active" | "inactive" | "pending";
    joinDate: string;
}


interface AgentsPageProps {
  // Removed props
}

const AgentsPage = (/*{}: AgentsPageProps*/) => {

  // Add state for agents, loading, error
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Define fetchAgents using useCallback to avoid re-creating it on every render
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/get_agents.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch agents.');
      }
      // Map API data (snake_case) to local Agent type
      const fetchedAgents = Array.isArray(result.data) ? result.data.map((a: any) => ({
        id: a.id,
        name: a.name,
        email: a.email ?? 'N/A', // Add email if available, otherwise 'N/A'
        phone: a.phone ?? '',
        referralCode: a.referral_code,
        activeClients: a.active_clients ?? 0,
        totalSales: a.total_sales ?? 0,
        commission_rate: a.commission_rate,
        status: a.status ?? 'active',
        joinDate: a.join_date ?? (a.created_at ? a.created_at.split(' ')[0] : new Date().toISOString().split('T')[0]),
        created_at: a.created_at,
      })) : [];
      setAgents(fetchedAgents);
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred while fetching agents.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Error fetching agents:", errorMessage);
      setError(errorMessage);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]); // Dependency: apiBaseUrl

  // Initial fetch on component mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]); // Dependency: fetchAgents function

  // Keep state for modals, selection etc.
  const [selectedAgentId, setSelectedAgentId] = useState<string | number | null>(null);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<ModalAgent | null>(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [viewingAgent, setViewingAgent] = useState<ModalAgent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | number | null>(null);

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (agent.referralCode && agent.referralCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: Agent["status"]) => {
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

  // Helper to convert API Agent to ModalAgent
  const convertToModalAgent = (agent: Agent): ModalAgent => ({
      id: String(agent.id),
      name: agent.name,
      email: agent.email,
      phone: agent.phone ?? '',
      referralCode: agent.referralCode,
      activeClients: agent.activeClients ?? 0,
      totalSales: agent.totalSales ?? 0,
      commissionRate: agent.commission_rate, // Map snake_case to camelCase
      status: agent.status ?? 'active',
      joinDate: agent.joinDate ?? (agent.created_at ? agent.created_at.split(' ')[0] : new Date().toISOString().split('T')[0]),
  });


  // --- Enable Add Agent, keep others disabled ---
  const handleAddAgent = () => {
    setEditingAgent(null);
    setShowAgentForm(true);
  };

  const handleEditAgent = (agent: Agent) => {
    toast({ title: "Info", description: "Edit agent functionality needs backend integration." });
    setEditingAgent(convertToModalAgent(agent));
    // setShowAgentForm(true); // Keep modal disabled for now
  };

  const handleViewAgent = (agent: Agent) => {
    setViewingAgent(convertToModalAgent(agent));
    setShowViewDetails(true);
  };

  const handleDeleteAgent = (id: string | number) => {
    toast({ title: "Info", description: "Delete agent functionality needs backend integration." });
    // setAgentToDelete(id);
    // setShowDeleteConfirm(true);
  };

  const confirmDeleteAgent = () => {
    toast({ title: "Info", description: "Confirm delete agent functionality needs backend integration." });
     setShowDeleteConfirm(false);
  };
  // --- End CRUD Handlers ---

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Agents</h1>
            <Button onClick={handleAddAgent}>Add New Agent</Button> {/* Enable button */}
          </div>

          <Card className="w-full bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Agent List</h2>
                <p className="text-sm text-gray-500">
                  Manage and view all agent information
                </p>
              </div>
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search agents..."
              />
            </div>

            {/* Add Loading and Error states */}
            {loading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2">Loading agents...</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Fetching Agents</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Referral Code</TableHead>
                      <TableHead>Active Clients</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Commission Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgents.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={8} className="text-center text-gray-500">
                           No agents found.
                         </TableCell>
                       </TableRow>
                    ) : (
                      filteredAgents.map((agent) => (
                        <TableRow
                          key={agent.id}
                          className={selectedAgentId === agent.id ? "bg-gray-50" : ""}
                          onClick={() => setSelectedAgentId(agent.id)}
                        >
                          <TableCell className="font-medium">
                            {agent.name}
                          </TableCell>
                          <TableCell>{agent.email}</TableCell>
                          <TableCell>{agent.referralCode}</TableCell>
                          <TableCell>{agent.activeClients ?? 0}</TableCell>
                          <TableCell>
                            R {agent.totalSales?.toLocaleString() ?? 0}
                          </TableCell>
                          <TableCell>
                            {(agent.commission_rate * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getStatusColor(agent.status)}
                            >
                              {agent.status?.charAt(0).toUpperCase() +
                                (agent.status?.slice(1) ?? '')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewAgent(agent);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAgent(agent);
                                }}
                                disabled // Keep Edit disabled for now
                              >
                                Edit (WIP)
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAgent(agent.id);
                                }}
                                disabled // Keep Delete disabled for now
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
            )} {/* End loading/error check */}
          </Card>
        </div>
      </main>

      {/* Modals */}
      <AgentFormModal
        open={showAgentForm}
        onClose={() => setShowAgentForm(false)}
        agent={editingAgent}
        onAgentAdded={fetchAgents} // Use fetchAgents directly for refetch
      />

      <ViewDetailsModal
        open={showViewDetails}
        onClose={() => setShowViewDetails(false)}
        title="Agent Details"
        data={viewingAgent || {}}
        onEdit={() => {
          setShowViewDetails(false);
          if (viewingAgent) {
             // Need to find the original agent data to pass to handleEditAgent
             const originalAgent = agents.find(a => String(a.id) === viewingAgent.id);
             if (originalAgent) {
                handleEditAgent(originalAgent);
             }
          }
        }}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteAgent}
        title="Delete Agent"
        description="Are you sure you want to delete this agent? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AgentsPage;
