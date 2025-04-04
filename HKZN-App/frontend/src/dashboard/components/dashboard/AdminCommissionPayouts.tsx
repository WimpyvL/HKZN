import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { useStore } from "@/lib/store"; // Remove useStore
import { toast } from "@/components/ui/use-toast";
import { Download, Filter, DollarSign, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Sidebar from "./Sidebar";
import ConfirmDialog from "../modals/ConfirmDialog";

// Define CommissionPayout type locally (adjust based on actual DB structure/API response)
interface CommissionPayout {
  id: string | number; // API might return number
  agent_id: string | number; // From API
  agentName?: string; // Potentially fetched/mapped later
  amount: number;
  period: string;
  status: "pending" | "processed" | "failed";
  payment_date?: string | null; // From API (payment_date)
}

// TODO: Define Agent type if needed for filtering (or fetch separately)
interface Agent {
  id: string | number;
  name: string;
}


const AdminCommissionPayouts = () => {
  // const { commissionPayouts, agents, processCommissionPayout } = useStore(); // Remove useStore

  // Add state for payouts, loading, error
  const [commissionPayouts, setCommissionPayouts] = useState<CommissionPayout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]); // Add state for agents if needed for filter
  const [isGenerating, setIsGenerating] = useState(false); // State for generation button

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch payouts function
  const fetchPayouts = useCallback(async () => { // Wrap in useCallback
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/get_commission_payouts.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch commission payouts.');
      }
      // Ensure data is an array
      setCommissionPayouts(Array.isArray(result.data) ? result.data : []);
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred while fetching payouts.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Error fetching payouts:", errorMessage);
      setError(errorMessage);
      setCommissionPayouts([]); // Clear payouts on error
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]); // Dependency: apiBaseUrl

  // Initial fetch on component mount
  useEffect(() => {
    fetchPayouts();
    // TODO: Fetch agents data for the filter dropdown if needed
    // fetchAgents();
  }, [fetchPayouts]); // Dependency: fetchPayouts function


  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all"); // Will filter by ID for now
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [showProcessConfirm, setShowProcessConfirm] = useState(false);
  const [payoutToProcess, setPayoutToProcess] = useState<string | number | null>(null);

  // Apply filters (adjust for agent_id and potentially missing agentName)
  const filteredPayouts = commissionPayouts.filter((payout) => {
    const matchesSearch =
      (payout.agentName && payout.agentName.toLowerCase().includes(searchQuery.toLowerCase())) || // Check if name exists
      payout.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(payout.agent_id).includes(searchQuery); // Search by agent ID

    const matchesStatus =
      statusFilter === "all" || payout.status === statusFilter;
    const matchesAgent =
      agentFilter === "all" || String(payout.agent_id) === agentFilter; // Filter by ID
    const matchesPeriod =
      periodFilter === "all" || payout.period === periodFilter;

    return matchesSearch && matchesStatus && matchesAgent && matchesPeriod;
  });

  // Get unique periods for filters
  const periods = ["all", ...new Set(commissionPayouts.map((p) => p.period))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "failed":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // --- Temporarily Disable/Comment Out Process Payout ---
  const handleProcessPayout = (id: string | number) => {
    toast({ title: "Info", description: "Process payout functionality needs backend integration." });
    // setPayoutToProcess(id);
    // setShowProcessConfirm(true);
  };

  const confirmProcessPayout = () => {
    toast({ title: "Info", description: "Confirm process payout functionality needs backend integration." });
    setShowProcessConfirm(false);
  };
  // --- End Temporarily Disable ---

   // --- Generate Payouts Handler ---
  const handleGeneratePayouts = async () => {
      setIsGenerating(true);
      try {
          const response = await fetch(`${apiBaseUrl}/generate_payouts.php`, {
              method: 'POST', // Use POST method
              headers: {
                  'Accept': 'application/json'
              }
          });
          const result = await response.json();

          if (!response.ok || !result.success) {
              throw new Error(result.message || `Failed to generate payouts (HTTP ${response.status})`);
          }

          toast({
              title: "Payout Generation",
              description: result.message || `${result.payouts_generated ?? 0} payouts generated.`,
          });
          // Refetch payouts list after generation
          fetchPayouts(); // Call fetch function

      } catch (err: unknown) {
          let errorMessage = 'An unknown error occurred while generating payouts.';
          if (err instanceof Error) {
              errorMessage = err.message;
          }
          console.error("Error generating payouts:", errorMessage);
          toast({
              title: "Generation Failed",
              description: errorMessage,
              variant: "destructive",
          });
      } finally {
          setIsGenerating(false);
      }
  };
  // --- End Generate Payouts Handler ---


  const exportPayoutsToCSV = () => {
    const headers = ["Agent ID", "Amount", "Period", "Status", "Payment Date"];

    const csvData = [
      headers.join(","),
      ...filteredPayouts.map((payout) =>
        [
          `"${payout.agent_id}"`,
          `"R ${payout.amount.toLocaleString()}"`,
          `"${payout.period}"`,
          `"${payout.status}"`,
          `"${payout.payment_date || "-"}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "commission-payouts.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Commission payouts have been exported to CSV",
    });
  };

  // Calculate statistics
  const totalPending = commissionPayouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalProcessed = commissionPayouts
    .filter((p) => p.status === "processed")
    .reduce((sum, p) => sum + p.amount, 0);

  const currentMonthPayouts = commissionPayouts.filter((p) => {
    const currentMonthYear = new Date().toLocaleString("en-ZA", { month: "long", year: "numeric" });
    return p.period.includes(currentMonthYear);
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Commission Payouts</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportPayoutsToCSV}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button
                onClick={handleGeneratePayouts} // Call new handler
                disabled={isGenerating} // Disable while generating
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Payouts
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Pending Payouts</p>
                  <p className="text-2xl font-bold">
                    R {totalPending.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {
                      commissionPayouts.filter((p) => p.status === "pending")
                        .length
                    }{" "}
                    payouts
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Processed Payouts</p>
                  <p className="text-2xl font-bold">
                    R {totalProcessed.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {
                      commissionPayouts.filter((p) => p.status === "processed")
                        .length
                    }{" "}
                    payouts
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Current Month</p>
                  <p className="text-2xl font-bold">
                    R{" "}
                    {currentMonthPayouts
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentMonthPayouts.length} payouts
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="w-full bg-white p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Payout Management</h2>
                <p className="text-sm text-gray-500">
                  Manage and process agent commission payouts
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  placeholder="Search payouts..."
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
                    <DropdownMenuLabel>Filter Payouts</DropdownMenuLabel>
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processed">Processed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Agent</p>
                        {/* Agent Filter - Disabled until agent names are fetched */}
                        <Select
                          value={agentFilter}
                          onValueChange={setAgentFilter}
                          disabled // Disable filter
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by agent (WIP)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Agents</SelectItem>
                            {/* Options populated when agents are fetched */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-2">
                      <p className="text-sm font-medium mb-2">Period</p>
                      <Select
                        value={periodFilter}
                        onValueChange={setPeriodFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Periods</SelectItem>
                          {periods
                            .filter((period) => period !== "all")
                            .map((period) => (
                              <SelectItem key={period} value={period}>
                                {period}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter("all");
                        setAgentFilter("all");
                        setPeriodFilter("all");
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
                <span className="ml-2">Loading payouts...</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Fetching Payouts</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayouts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
                          No commission payouts found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell className="font-medium">
                            {payout.agent_id}
                          </TableCell>
                          <TableCell className="font-medium">
                            R {payout.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>{payout.period}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getStatusColor(payout.status)}
                            >
                            {payout.status.charAt(0).toUpperCase() +
                              payout.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{payout.payment_date || "-"}</TableCell>
                        <TableCell>
                          {payout.status === "pending" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProcessPayout(payout.id)}
                              disabled // Disable button
                            >
                              Process Payout (WIP)
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              {payout.status === "processed" ? "Processed" : "Failed"}
                            </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )} {/* End loading/error check */}

            {/* Summary */}
            {filteredPayouts.length > 0 && (
              <div className="mt-4 flex justify-end">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between gap-8">
                    <div>
                      <p className="text-sm text-gray-500">Total Payouts</p>
                      <p className="font-bold">{filteredPayouts.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-bold">
                        R{" "}
                        {filteredPayouts
                          .reduce((sum, p) => sum + p.amount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pending Amount</p>
                      <p className="font-bold text-yellow-600">
                        R{" "}
                        {filteredPayouts
                          .filter((p) => p.status === "pending")
                          .reduce((sum, p) => sum + p.amount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Confirm Process Dialog */}
      <ConfirmDialog
        open={showProcessConfirm}
        onClose={() => setShowProcessConfirm(false)}
        onConfirm={confirmProcessPayout}
        title="Process Commission Payout"
        description="Are you sure you want to process this commission payout? This action will mark the payout as processed and cannot be undone."
        confirmText="Process"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminCommissionPayouts;
