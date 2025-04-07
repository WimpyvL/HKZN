import React, { useState, useEffect } from "react"; // Import useState, useEffect
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useStore } from "@/lib/store"; // Remove useStore
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons

// Define Agent type locally (match API response)
interface Agent {
  id: string | number;
  name: string;
  referral_code: string; // From API
  active_clients: number; // From API
  total_sales: number; // From API
  commission_rate: number; // From API
}


// Remove defaultAgents array

const AgentsTable = () => {

  // Add state for agents, loading, error
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add searchQuery state

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
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
        setAgents(Array.isArray(result.data) ? result.data : []);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while fetching agents.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error fetching agents:", errorMessage);
        setError(errorMessage);
        setAgents([]); // Clear agents on error
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [apiBaseUrl]);

  // TODO: Implement sorting logic based on fetched data if needed

  // Filter agents based on search query - MOVED INSIDE RENDER LOGIC
  // const filteredAgents = agents.filter(...)

  return (
    <Card className="w-full bg-white p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Agents Overview</h2>
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

      {!loading && !error && (() => {
        // Calculate filtered agents only when data is ready
        const filteredAgents = agents.filter(agent =>
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (agent.referral_code && agent.referral_code.toLowerCase().includes(searchQuery.toLowerCase())) // Check referral_code exists
          // Add email search if needed: || agent.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                <TableHead>
                  {/* Disable sorting button for now */}
                  <Button variant="ghost" disabled className="flex items-center gap-1">
                    Name
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </Button>
                </TableHead>
                <TableHead>
                   {/* Disable sorting button for now */}
                  <Button variant="ghost" disabled className="flex items-center gap-1">
                    Referral Code
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </Button>
                </TableHead>
                <TableHead>
                   {/* Disable sorting button for now */}
                  <Button variant="ghost" disabled className="flex items-center gap-1">
                    Active Clients
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </Button>
                </TableHead>
                <TableHead>
                   {/* Disable sorting button for now */}
                  <Button variant="ghost" disabled className="flex items-center gap-1">
                    Total Sales
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </Button>
                </TableHead>
                <TableHead>
                   {/* Disable sorting button for now */}
                  <Button variant="ghost" disabled className="flex items-center gap-1">
                    Commission Rate
                    {/* <ArrowUpDown className="h-4 w-4" /> */}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {filteredAgents.length === 0 ? ( // Use filteredAgents
                   <TableRow>
                     <TableCell colSpan={5} className="text-center text-gray-500">
                       No agents found.
                     </TableCell>
                   </TableRow>
                ) : (
                  filteredAgents.map((agent) => ( // Use filteredAgents
                    <TableRow key={agent.id}>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.referral_code}</TableCell> {/* Use snake_case */}
                    <TableCell>{agent.active_clients}</TableCell> {/* Use snake_case */}
                    <TableCell>R {agent.total_sales.toLocaleString()}</TableCell> {/* Use snake_case */}
                    <TableCell>
                      {(agent.commission_rate * 100).toFixed(1)}% {/* Use snake_case */}
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
  );
};

export default AgentsTable;
