import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';

// Define types locally
interface Transaction {
  id: string | number;
  date: string;
  client_id?: string | number | null; // Use client_id
  clientName?: string; // Mapped later
  product_id?: string | number | null; // Use product_id
  product?: string; // Mapped later
  amount: number;
  commission: number;
  status: "completed" | "pending" | "failed" | "refunded";
}

interface CommissionPayout {
  id: string | number;
  agent_id: string | number;
  amount: number;
  period: string;
  status: "pending" | "processed" | "failed";
  payment_date?: string | null;
}

const AgentCommissions = () => {
  // const { currentUser, transactions, commissionPayouts } = useStore(); // Remove useStore

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<CommissionPayout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Get current agent's ID
  const currentAgentId = "AGENT_ID_PLACEHOLDER"; // Replace with actual agent ID logic

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch transactions and payouts
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [transactionsRes, payoutsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/get_transactions.php`), // Fetch all transactions for now
        fetch(`${apiBaseUrl}/get_commission_payouts.php`) // Fetch all payouts for now
      ]);

      if (!transactionsRes.ok) throw new Error(`Failed to fetch transactions: ${transactionsRes.status}`);
      if (!payoutsRes.ok) throw new Error(`Failed to fetch payouts: ${payoutsRes.status}`);

      const transactionsResult = await transactionsRes.json();
      const payoutsResult = await payoutsRes.json();

      if (!transactionsResult.success) throw new Error(transactionsResult.message || 'Failed to fetch transactions.');
      if (!payoutsResult.success) throw new Error(payoutsResult.message || 'Failed to fetch payouts.');

      // Filter data for the current agent
      const agentTransactions = Array.isArray(transactionsResult.data)
        ? transactionsResult.data.filter((tx: any) => String(tx.agent_id) === String(currentAgentId))
        : [];
      const agentPayouts = Array.isArray(payoutsResult.data)
        ? payoutsResult.data.filter((p: any) => String(p.agent_id) === String(currentAgentId))
        : [];

      setTransactions(agentTransactions);
      setPayouts(agentPayouts);

    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) errorMessage = err.message;
      console.error("Error fetching agent commission data:", errorMessage);
      setError(errorMessage);
      setTransactions([]);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, currentAgentId]); // Add currentAgentId dependency

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "processed":
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

  // Calculate summary stats
  const totalCommissionEarned = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (Number(t.commission) || 0), 0);

  const totalPaidOut = payouts
    .filter(p => p.status === 'processed')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const pendingPayout = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Commissions</h1>

       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card className="p-4"><p className="text-sm text-gray-500">Total Earned</p><p className="text-2xl font-bold">R {totalCommissionEarned.toLocaleString()}</p></Card>
           <Card className="p-4"><p className="text-sm text-gray-500">Total Paid Out</p><p className="text-2xl font-bold">R {totalPaidOut.toLocaleString()}</p></Card>
           <Card className="p-4"><p className="text-sm text-gray-500">Pending Payout</p><p className="text-2xl font-bold">R {pendingPayout.toLocaleString()}</p></Card>
       </div>


      {loading && (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2">Loading commission data...</span>
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <>
          {/* Recent Commissions Table */}
          <Card className="w-full bg-white p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Commissions Earned</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Sale Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-gray-500">No recent commissions.</TableCell></TableRow>
                  ) : (
                    transactions.slice(0, 10).map((tx) => ( // Show recent 10
                      <TableRow key={`tx-${tx.id}`}>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.client_id ?? 'N/A'}</TableCell>
                        <TableCell>{tx.product_id ?? 'N/A'}</TableCell>
                        <TableCell>R {tx.amount.toLocaleString()}</TableCell>
                        <TableCell>R {tx.commission.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(tx.status)}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Payout History Table */}
          <Card className="w-full bg-white p-6">
            <h2 className="text-2xl font-bold mb-4">Payout History</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.length === 0 ? (
                     <TableRow><TableCell colSpan={4} className="text-center text-gray-500">No payout history.</TableCell></TableRow>
                  ) : (
                    payouts.map((payout) => (
                      <TableRow key={`payout-${payout.id}`}>
                        <TableCell>{payout.period}</TableCell>
                        <TableCell>R {payout.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(payout.status)}>
                            {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{payout.payment_date || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AgentCommissions;
