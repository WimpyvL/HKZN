import React, { useState, useEffect } from "react"; // Import useState, useEffect
import { Card, CardContent } from "@/components/ui/card"; // Corrected path
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  FileCheck,
  DollarSign,
  Clock,
} from "lucide-react";
// import { useStore } from "@/lib/store"; // Remove useStore
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Loader2, AlertCircle } from 'lucide-react'; // Import Loader/Icons

// Define necessary types locally (simplified versions)
interface Agent { id: string | number; /* other fields if needed */ }
interface Client { id: string | number; status: string; /* other fields */ }
interface Transaction { id: string | number; date: string; amount: number; status: string; /* other fields */ }


interface MetricCardProps {
  title: string;
  value: string;
  change?: number; // Make change optional for now
  icon: React.ReactNode;
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  change = 0, // Keep default, but might not be used if change calculation is removed
  icon,
}: MetricCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
          {/* Optionally hide change indicator if not calculated */}
          {/* <div
            className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isPositive ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            <span>{Math.abs(change)}%</span>
          </div> */}
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

// Removed unused MetricsGridProps interface

const MetricsGrid = () => { // Removed unused props parameter

  // Add state for data, loading, error
  const [agents, setAgents] = useState<Agent[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get API base URL from environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [agentsRes, clientsRes, transactionsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/get_agents.php`),
          fetch(`${apiBaseUrl}/get_clients.php`),
          fetch(`${apiBaseUrl}/get_transactions.php`),
        ]);

        // Check all responses are ok
        if (!agentsRes.ok) throw new Error(`Failed to fetch agents: ${agentsRes.status}`);
        if (!clientsRes.ok) throw new Error(`Failed to fetch clients: ${clientsRes.status}`);
        if (!transactionsRes.ok) throw new Error(`Failed to fetch transactions: ${transactionsRes.status}`);

        const agentsResult = await agentsRes.json();
        const clientsResult = await clientsRes.json();
        const transactionsResult = await transactionsRes.json();

        // Check success flags in responses
        if (!agentsResult.success) throw new Error(agentsResult.message || 'Failed to fetch agents.');
        if (!clientsResult.success) throw new Error(clientsResult.message || 'Failed to fetch clients.');
        if (!transactionsResult.success) throw new Error(transactionsResult.message || 'Failed to fetch transactions.');

        setAgents(Array.isArray(agentsResult.data) ? agentsResult.data : []);
        setClients(Array.isArray(clientsResult.data) ? clientsResult.data : []);
        setTransactions(Array.isArray(transactionsResult.data) ? transactionsResult.data : []);

      } catch (err: unknown) {
        let errorMessage = 'An unknown error occurred while fetching metrics data.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Error fetching metrics data:", errorMessage);
        setError(errorMessage);
        setAgents([]);
        setClients([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl]);


  if (loading) {
    return (
        <div className="bg-gray-50 p-6 rounded-lg flex justify-center items-center min-h-[150px]">
             <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
             <span className="ml-2">Loading metrics...</span>
        </div>
    );
  }

  if (error) {
      return (
          <div className="bg-gray-50 p-6 rounded-lg">
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading Metrics</AlertTitle>
                  {/* Provide more specific error if possible */}
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
          </div>
      );
  }

  // Calculate metrics only when data is ready
  const totalAgents = agents.length;
  const activeReferrals = clients.filter((c) => c.status === "active").length;
  const pendingCommissions = transactions.filter((t) => t.status === "pending").length;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyRevenue = transactions
    .filter((t) => {
       if (!t.date || typeof t.date !== 'string') return false;
       try {
           const transactionDate = new Date(t.date);
           if (isNaN(transactionDate.getTime())) return false;
           return (
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear
           );
       } catch (e) { return false; }
    })
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const metrics = {
    totalAgents,
    activeReferrals,
    pendingCommissions,
    monthlyRevenue,
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Agents"
          value={metrics.totalAgents.toString()}
          icon={<Users size={20} className="text-blue-600" />}
        />
        <MetricCard
          title="Active Referrals"
          value={metrics.activeReferrals.toString()}
          icon={<FileCheck size={20} className="text-green-600" />}
        />
        <MetricCard
          title="Pending Commissions"
          value={metrics.pendingCommissions.toString()}
          icon={<Clock size={20} className="text-orange-600" />}
        />
        <MetricCard
          title="Monthly Revenue"
          value={`R ${metrics.monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign size={20} className="text-purple-600" />}
        />
      </div>
    </div>
  );
};

export default MetricsGrid;
