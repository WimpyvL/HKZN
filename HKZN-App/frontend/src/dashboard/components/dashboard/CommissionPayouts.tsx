import React, { useState, useEffect } from "react"; // Import useState, useEffect
import { Card } from "@/components/ui/card";
import SearchBar from "./SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { useStore } from "@/lib/store"; // Remove useStore
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons
import { toast } from "@/components/ui/use-toast"; // Import toast

// Define CommissionPayout type locally (match API response)
interface CommissionPayout {
  id: string | number;
  agent_id: string | number; // From API
  agentName?: string; // Potentially fetched/mapped later
  amount: number;
  period: string;
  status: "pending" | "processed" | "failed";
  payment_date?: string | null; // From API
}

interface CommissionPayoutsProps {
  // Removed props
}

const CommissionPayouts = (/*{}: CommissionPayoutsProps*/) => {

  // Add state for payouts, loading, error
  const [payouts, setPayouts] = useState<CommissionPayout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch payouts from API
  useEffect(() => {
    const fetchPayouts = async () => {
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
        setPayouts(Array.isArray(result.data) ? result.data : []);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while fetching payouts.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error fetching payouts:", errorMessage);
        setError(errorMessage);
        setPayouts([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [apiBaseUrl]);

  const getStatusColor = (status: CommissionPayout["status"]) => {
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

  const handleProcessClick = (id: string | number) => {
     toast({ title: "Info", description: "Process payout functionality needs backend integration." });
     // Original logic: onProcess?.(String(id));
  }

  return (
    <Card className="w-full bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Commission Payouts</h2>
        <SearchBar
          onSearch={setSearchQuery} // Use internal search state
          placeholder="Search payouts..."
        />
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

      {!loading && !error && (() => {
        // Calculate filtered payouts only when data is ready
        const filteredPayouts = payouts.filter(p =>
          String(p.agent_id).includes(searchQuery) ||
          p.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.status.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={6} className="text-center text-gray-500">
                       No payouts found.
                     </TableCell>
                   </TableRow>
                ) : (
                  filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.agent_id}</TableCell>
                      <TableCell>R {payout.amount.toLocaleString()}</TableCell>
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
                        {payout.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProcessClick(payout.id)}
                            disabled // Disable button
                          >
                            Process (WIP)
                          </Button>
                        )}
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

export default CommissionPayouts;
