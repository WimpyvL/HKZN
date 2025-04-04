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
// import { useStore } from "@/lib/store"; // Remove useStore
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons

// Define Transaction type locally (match API response)
interface Transaction {
  id: string | number;
  date: string; // Mapped from transaction_date in PHP
  agent_id?: string | number | null;
  client_id?: string | number | null;
  product_id?: string | number | null;
  amount: number;
  commission: number; // Mapped from commission_amount in PHP
  status: "completed" | "pending" | "failed" | "refunded"; // Match DB enum
  paymentMethod: string;
}

interface SalesReportProps {
  // Removed props
}

const SalesReport = (/*{}: SalesReportProps*/) => {

  // Add state for transactions, loading, error
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/get_transactions.php`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch transactions.');
        }
        setTransactions(Array.isArray(result.data) ? result.data : []);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while fetching transactions.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error fetching transactions:", errorMessage);
        setError(errorMessage);
        setTransactions([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [apiBaseUrl]);

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "failed":
      case "refunded":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="w-full bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sales Report</h2>
        <SearchBar
          onSearch={setSearchQuery} // Use internal search state
          placeholder="Search sales..."
        />
      </div>

      {/* Add Loading and Error states */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2">Loading sales report...</span>
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Sales Report</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (() => {
        // Calculate filtered sales only when data is ready
        const filteredSales = transactions.filter(tx =>
          tx.date.includes(searchQuery) ||
          String(tx.agent_id).includes(searchQuery) ||
          String(tx.client_id).includes(searchQuery) ||
          String(tx.product_id).includes(searchQuery) ||
          tx.status.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Agent ID</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={7} className="text-center text-gray-500">
                       No sales data found.
                     </TableCell>
                   </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.agent_id ?? 'N/A'}</TableCell>
                      <TableCell>{sale.client_id ?? 'N/A'}</TableCell>
                      <TableCell>{sale.product_id ?? 'N/A'}</TableCell>
                      <TableCell>R {sale.amount.toLocaleString()}</TableCell>
                      <TableCell>R {sale.commission.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(sale.status)}
                        >
                          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                        </Badge>
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

export default SalesReport;
