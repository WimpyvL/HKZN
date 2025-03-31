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
// import { useStore } from "@/lib/store"; // Remove useStore
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle, Plus } from 'lucide-react'; // Import Loader/Icons & Plus
import { toast } from "@/components/ui/use-toast"; // Import toast
import TransactionFormModal from "../modals/TransactionFormModal"; // Import the modal

// Define Transaction type locally (adjust based on actual DB structure/API response)
interface Transaction {
  id: string | number; // API might return number
  date: string;
  agent_id?: string | number | null; // From API
  client_id?: string | number | null; // From API
  product_id?: string | number | null; // From API
  agentName?: string; // Potentially fetched/mapped later
  clientName?: string; // Potentially fetched/mapped later
  product?: string; // Potentially fetched/mapped later
  amount: number;
  commission: number;
  status: "completed" | "pending" | "failed" | "refunded"; // Match DB enum
  paymentMethod: string;
}

interface TransactionsPageProps {
  // Removed props
}


const TransactionsPage = (/*{}: TransactionsPageProps*/) => {

  // Add state for transactions, loading, error
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

   // Fetch transactions function
  const fetchTransactions = useCallback(async () => {
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
        // Ensure data is an array
        setTransactions(Array.isArray(result.data) ? result.data : []);
      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while fetching transactions.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error fetching transactions:", errorMessage);
        setError(errorMessage);
        setTransactions([]); // Clear transactions on error
      } finally {
        setLoading(false);
      }
    }, [apiBaseUrl]); // Dependency: apiBaseUrl

  // Initial fetch on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Dependency: fetchTransactions function

  // Function to refetch transactions
  const refetchTransactions = useCallback(() => {
      fetchTransactions();
  }, [fetchTransactions]);


  const [selectedTransactionId, setSelectedTransactionId] = useState<string | number | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false); // State for modal visibility


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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Transactions</h1>
            <div className="flex space-x-2">
              <Button variant="outline" disabled>Export (WIP)</Button>
              {/* Enable button and set onClick handler */}
              <Button onClick={() => setShowTransactionForm(true)}>
                 <Plus className="mr-2 h-4 w-4" /> New Transaction
              </Button>
            </div>
          </div>

          <Card className="w-full bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <p className="text-sm text-gray-500">
                  View and manage all transactions
                </p>
              </div>
              <SearchBar
                onSearch={setSearchQuery} // Use internal search state
                placeholder="Search transactions..."
              />
            </div>

             {/* Add Loading and Error states */}
             {loading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2">Loading transactions...</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Fetching Transactions</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && (() => {
                // Calculate filtered transactions only when data is ready
                const filteredTransactions = transactions.filter(tx =>
                    String(tx.id).includes(searchQuery) ||
                    tx.date.includes(searchQuery) ||
                    String(tx.agent_id).includes(searchQuery) || // Search by ID
                    String(tx.client_id).includes(searchQuery) || // Search by ID
                    String(tx.product_id).includes(searchQuery) || // Search by ID
                    tx.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tx.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
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
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center text-gray-500">
                              No transactions found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTransactions.map((transaction) => (
                            <TableRow
                              key={transaction.id}
                              className={
                                selectedTransactionId === transaction.id
                                  ? "bg-gray-50"
                                  : ""
                              }
                              onClick={() => setSelectedTransactionId(transaction.id)}
                            >
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>{transaction.agent_id ?? 'N/A'}</TableCell>
                              <TableCell>{transaction.client_id ?? 'N/A'}</TableCell>
                              <TableCell>{transaction.product_id ?? 'N/A'}</TableCell>
                              <TableCell>
                                R {transaction.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                R {transaction.commission.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={getStatusColor(transaction.status)}
                                >
                                  {transaction.status.charAt(0).toUpperCase() +
                                    transaction.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{transaction.paymentMethod}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" disabled> {/* Keep View disabled for now */}
                                    View (WIP)
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

      {/* Add Transaction Modal */}
      <TransactionFormModal
        open={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
        onTransactionAdded={refetchTransactions} // Pass refetch function
      />
    </div>
  );
};

export default TransactionsPage;
