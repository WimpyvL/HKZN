import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  DollarSign,
  Calendar,
  Download,
  BarChart,
  PieChart,
  TrendingUp,
} from "lucide-react";
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

const AgentCommissions = () => {
  const { currentUser, transactions } = useStore();
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [commissionStats, setCommissionStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    thisMonth: 0,
    lastMonth: 0,
  });

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "agent") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Filter transactions for this agent
  const agentTransactions = transactions.filter(
    (transaction) => currentUser && transaction.agentName === currentUser.name,
  );

  // Calculate commission statistics
  useEffect(() => {
    if (agentTransactions.length > 0) {
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      const total = agentTransactions.reduce((sum, t) => sum + t.commission, 0);
      const pending = agentTransactions
        .filter((t) => t.status === "pending")
        .reduce((sum, t) => sum + t.commission, 0);
      const completed = agentTransactions
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + t.commission, 0);

      const thisMonthCommission = agentTransactions
        .filter((t) => {
          const date = new Date(t.date);
          return (
            date.getMonth() === thisMonth && date.getFullYear() === thisYear
          );
        })
        .reduce((sum, t) => sum + t.commission, 0);

      const lastMonthCommission = agentTransactions
        .filter((t) => {
          const date = new Date(t.date);
          return (
            date.getMonth() === lastMonth &&
            date.getFullYear() === lastMonthYear
          );
        })
        .reduce((sum, t) => sum + t.commission, 0);

      setCommissionStats({
        total,
        pending,
        completed,
        thisMonth: thisMonthCommission,
        lastMonth: lastMonthCommission,
      });
    }
  }, [agentTransactions]);

  // Apply filters
  const filteredTransactions = agentTransactions
    .filter((transaction) => {
      // Status filter
      if (statusFilter !== "all" && transaction.status !== statusFilter) {
        return false;
      }

      // Period filter
      if (periodFilter !== "all") {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        if (periodFilter === "thisMonth") {
          return (
            transactionDate.getMonth() === thisMonth &&
            transactionDate.getFullYear() === thisYear
          );
        } else if (periodFilter === "lastMonth") {
          const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
          const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
          return (
            transactionDate.getMonth() === lastMonth &&
            transactionDate.getFullYear() === lastMonthYear
          );
        } else if (periodFilter === "thisYear") {
          return transactionDate.getFullYear() === thisYear;
        }
      }

      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const exportCommissionsToCSV = () => {
    const headers = [
      "Date",
      "Client",
      "Product",
      "Amount",
      "Commission",
      "Status",
    ];

    const csvData = [
      headers.join(","),
      ...filteredTransactions.map((transaction) =>
        [
          `"${transaction.date}"`,
          `"${transaction.clientName}"`,
          `"${transaction.product}"`,
          `"R ${transaction.amount.toLocaleString()}"`,
          `"R ${transaction.commission.toLocaleString()}"`,
          `"${transaction.status}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "my-commissions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Your commissions have been exported to CSV",
    });
  };

  // Calculate month-over-month growth percentage
  const growthPercentage =
    commissionStats.lastMonth > 0
      ? ((commissionStats.thisMonth - commissionStats.lastMonth) /
          commissionStats.lastMonth) *
        100
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Commissions</h1>
        <Button variant="outline" onClick={exportCommissionsToCSV}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Commissions</p>
              <p className="text-2xl font-bold">
                R {commissionStats.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {agentTransactions.length} transactions
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold">
                R {commissionStats.thisMonth.toLocaleString()}
              </p>
              <div className="flex items-center text-xs">
                {growthPercentage !== 0 && (
                  <span
                    className={
                      growthPercentage > 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {growthPercentage > 0 ? "↑" : "↓"}{" "}
                    {Math.abs(growthPercentage).toFixed(1)}%
                  </span>
                )}
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending Commissions</p>
              <p className="text-2xl font-bold">
                R {commissionStats.pending.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {agentTransactions.filter((t) => t.status === "pending").length}{" "}
                pending transactions
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Commission History */}
      <Card className="w-full bg-white p-6">
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Commission History</h2>
            <p className="text-sm text-gray-500">
              Track your earnings from client referrals
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    {agentTransactions.length === 0 ? (
                      <>
                        <p>You haven't earned any commissions yet</p>
                        <Button
                          variant="link"
                          onClick={() => navigate("/agent/register-client")}
                          className="mt-2"
                        >
                          Register a client to start earning
                        </Button>
                      </>
                    ) : (
                      "No commissions found matching your criteria"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.clientName}
                    </TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>
                      R {transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-4 flex justify-end">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between gap-8">
                <div>
                  <p className="text-sm text-gray-500">Total Transactions</p>
                  <p className="font-bold">{filteredTransactions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold">
                    R{" "}
                    {filteredTransactions
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Commission</p>
                  <p className="font-bold text-green-600">
                    R{" "}
                    {filteredTransactions
                      .reduce((sum, t) => sum + t.commission, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AgentCommissions;
