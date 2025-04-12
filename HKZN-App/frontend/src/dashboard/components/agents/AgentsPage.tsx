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
import Sidebar from "../dashboard/Sidebar";
import AgentFormModal from "../modals/AgentFormModal";
import ViewDetailsModal from "../modals/ViewDetailsModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';
import ConfirmDialog from "../modals/ConfirmDialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

// Define Agent type matching Supabase 'agents' table structure
interface Agent {
  id: string; // Supabase uses UUID (string)
  name: string;
  email: string;
  phone?: string | null;
  referral_code: string; // snake_case from Supabase
  active_clients?: number | null; // snake_case from Supabase
  total_sales?: number | null; // snake_case from Supabase
  commission_rate: number; // snake_case from Supabase
  status?: "active" | "inactive" | "pending";
  join_date?: string | null; // snake_case from Supabase
  created_at?: string;
  updated_at?: string;
}

// Type expected by AgentFormModal (camelCase)
interface ModalAgent {
    id: string;
    name: string;
    email: string;
    phone: string;
    referralCode: string;
    activeClients: number;
    totalSales: number;
    commissionRate: number;
    status: "active" | "inactive" | "pending";
    joinDate: string;
}

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch agents from Supabase
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("Fetching agents from Supabase...");
    try {
      const { data, error: supabaseError } = await supabase
        .from('agents')
        .select('*') // Select all columns
        .order('name'); // Order by name

      if (supabaseError) {
        throw supabaseError;
      }

      console.log("Agents fetched:", data);
      setAgents(data || []); // Set data or empty array if null

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
  }, []); // No dependencies needed now

  // Initial fetch on component mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Keep state for modals, selection etc.
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null); // ID is string (UUID)
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<ModalAgent | null>(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [viewingAgent, setViewingAgent] = useState<ModalAgent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null); // ID is string (UUID)

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (agent.referral_code && agent.referral_code.toLowerCase().includes(searchQuery.toLowerCase())) // Use snake_case
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

  // Helper to convert Supabase Agent (snake_case) to ModalAgent (camelCase)
  const convertToModalAgent = (agent: Agent): ModalAgent => ({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone ?? '',
      referralCode: agent.referral_code, // Map from snake_case
      activeClients: agent.active_clients ?? 0, // Map from snake_case
      totalSales: agent.total_sales ?? 0, // Map from snake_case
      commissionRate: agent.commission_rate, // Map from snake_case
      status: agent.status ?? 'active',
      joinDate: agent.join_date ?? (agent.created_at ? agent.created_at.split('T')[0] : new Date().toISOString().split('T')[0]), // Map from snake_case
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

  const handleDeleteAgent = (id: string) => { // ID is string
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
            <Button onClick={handleAddAgent}>Add New Agent</Button>
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
                          <TableCell>{agent.referral_code}</TableCell> {/* Use snake_case */}
                          <TableCell>{agent.active_clients ?? 0}</TableCell> {/* Use snake_case */}
                          <TableCell>
                            R {agent.total_sales?.toLocaleString() ?? 0} {/* Use snake_case */}
                          </TableCell>
                          <TableCell>
                            {(agent.commission_rate * 100).toFixed(1)}% {/* Use snake_case */}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={"secondary" as const} // Explicit cast
                              className={getStatusColor(agent.status)}
                            >
                              {agent.status?.charAt(0).toUpperCase() +
                                (agent.status?.slice(1) ?? '')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant={"outline" as const} // Explicit cast
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewAgent(agent);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant={"outline" as const} // Explicit cast
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
                                variant={"destructive" as const} // Explicit cast
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
            )}
          </Card>
        </div>
      </main>

      {/* Modals */}
      <AgentFormModal
        open={showAgentForm}
        onClose={() => setShowAgentForm(false)}
        agent={editingAgent}
        onAgentAdded={fetchAgents} // Refetch after adding
      />

      <ViewDetailsModal
        open={showViewDetails}
        onClose={() => setShowViewDetails(false)}
        title="Agent Details"
        data={(viewingAgent as unknown as Record<string, unknown>) || {}} // Cast via unknown
        onEdit={() => {
          setShowViewDetails(false);
          if (viewingAgent) {
             const originalAgent = agents.find(a => a.id === viewingAgent.id);
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
