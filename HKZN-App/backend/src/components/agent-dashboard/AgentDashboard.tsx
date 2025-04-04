import React, { useState, useEffect, useCallback } from "react"; // Import hooks
import { useNavigate, useLocation } from "react-router-dom";
import AgentSidebar from "./AgentSidebar";
import { useAppStore } from "@/lib/store"; // Corrected import
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Users,
  DollarSign,
  Package,
  Calendar,
} from "lucide-react";
import ProductSelection from "./ProductSelection";
import ClientRegistration from "./ClientRegistration";
import AgentCommissions from "./AgentCommissions";
import AgentClients from "./AgentClients";
import AgentSettings from "./AgentSettings";

// Define types locally
interface Client { id: string | number; status: string; referred_by_agent_id?: string | number | null; /* other fields */ }
// Correct Transaction interface to match API data structure
interface Transaction {
  id: string | number;
  date: string;
  amount: number;
  commission: number;
  status: "completed" | "pending" | "failed" | "refunded";
  agent_id?: string | number | null;
  client_id?: string | number | null; // Use client_id
  product_id?: string | number | null; // Use product_id
  paymentMethod?: string; // Add if needed
}
interface Product { id: string | number; name: string; isActive?: boolean; /* other fields */ }

const AgentDashboard = () => {
  const { currentUser } = useAppStore(); // Corrected hook name
  const navigate = useNavigate();
  const location = useLocation();

  // State for fetched data
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const currentAgentId = currentUser?.id; // Get agent ID from store

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!currentAgentId) {
        setError("Agent ID not found.");
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const [clientsRes, transactionsRes, productsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/get_clients.php`),
        fetch(`${apiBaseUrl}/get_transactions.php`),
        fetch(`${apiBaseUrl}/get_products.php`),
      ]);

      if (!clientsRes.ok) throw new Error(`Failed to fetch clients: ${clientsRes.status}`);
      if (!transactionsRes.ok) throw new Error(`Failed to fetch transactions: ${transactionsRes.status}`);
      if (!productsRes.ok) throw new Error(`Failed to fetch products: ${productsRes.status}`);

      const clientsResult = await clientsRes.json();
      const transactionsResult = await transactionsRes.json();
      const productsResult = await productsRes.json();

      if (!clientsResult.success) throw new Error(clientsResult.message || 'Failed to fetch clients.');
      if (!transactionsResult.success) throw new Error(transactionsResult.message || 'Failed to fetch transactions.');
      if (!productsResult.success) throw new Error(productsResult.message || 'Failed to fetch products.');

      // Filter data specifically for the current agent
      const agentClients = Array.isArray(clientsResult.data)
        ? clientsResult.data.filter((c: any) => String(c.referred_by_agent_id) === String(currentAgentId))
        : [];
      const agentTransactions = Array.isArray(transactionsResult.data)
        ? transactionsResult.data.filter((t: any) => String(t.agent_id) === String(currentAgentId))
        : [];

      setClients(agentClients);
      setTransactions(agentTransactions);
      setProducts(Array.isArray(productsResult.data) ? productsResult.data : []);

    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred while fetching dashboard data.';
      if (err instanceof Error) errorMessage = err.message;
      console.error("Error fetching dashboard data:", errorMessage);
      setError(errorMessage);
      setClients([]);
      setTransactions([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, currentAgentId]);

  // Initial fetch and auth check
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "agent") {
      navigate("/"); // Redirect non-agents
      return;
    }
    fetchData();
  }, [currentUser, navigate, fetchData]);


  // Calculate stats - only run if data is loaded
  const calculateStats = () => {
    if (loading || error || !currentUser) {
      return { totalClients: 0, activeClients: 0, totalCommission: 0, pendingCommission: 0, recentSales: 0 };
    }

    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === "active").length;
    const totalCommission = transactions.reduce((sum, t) => sum + (Number(t.commission) || 0), 0);
    const pendingCommission = transactions
      .filter(t => t.status === "pending")
      .reduce((sum, t) => sum + (Number(t.commission) || 0), 0);

    const recentSales = transactions
      .filter(t => {
        if (!t.date || typeof t.date !== 'string') return false;
        try {
          const transactionDate = new Date(t.date);
          if (isNaN(transactionDate.getTime())) return false;
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return transactionDate >= thirtyDaysAgo;
        } catch (e) { return false; }
      })
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return { totalClients, activeClients, totalCommission, pendingCommission, recentSales };
  };

  const stats = calculateStats(); // Calculate stats for rendering

  // Main dashboard content component
  const DashboardHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <div>
          <span className="text-sm text-gray-500 mr-2">Welcome back,</span>
          <span className="font-medium">{currentUser?.name}</span>
        </div>
      </div>

      {/* Loading/Error state for stats */}
      {loading && <p>Loading stats...</p>}
      {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Stats</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

      {/* Stats Cards - Render only when not loading/error */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Clients</p>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
                <p className="text-xs text-gray-500">{stats.activeClients} active</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full"><Users className="h-6 w-6 text-blue-600" /></div>
            </div>
          </Card>
          <Card className="bg-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Commission</p>
                <p className="text-2xl font-bold">R {stats.totalCommission.toLocaleString()}</p>
                <p className="text-xs text-gray-500">R {stats.pendingCommission.toLocaleString()} pending</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full"><DollarSign className="h-6 w-6 text-green-600" /></div>
            </div>
          </Card>
          <Card className="bg-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Recent Sales (30d)</p>
                <p className="text-2xl font-bold">R {stats.recentSales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {transactions.filter(t => t.status === "completed").length} completed transactions
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full"><BarChart className="h-6 w-6 text-purple-600" /></div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="bg-white p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2 h-20" onClick={() => navigate("/agent/register-client")}>
            <Users className="h-5 w-5" />
            <div className="text-left"><p className="font-medium">Register Client</p><p className="text-xs text-gray-500">Add a new client</p></div>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 h-20" onClick={() => navigate("/agent/products")}>
            <Package className="h-5 w-5" />
            <div className="text-left"><p className="font-medium">View Products</p><p className="text-xs text-gray-500">{products.filter(p => p.isActive).length} active products</p></div>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 h-20" onClick={() => navigate("/agent/commissions")}>
            <DollarSign className="h-5 w-5" />
            <div className="text-left"><p className="font-medium">Check Commissions</p><p className="text-xs text-gray-500">View your earnings</p></div>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {loading && <p>Loading activity...</p>}
          {error && <p className="text-red-500">Error loading activity.</p>}
          {!loading && !error && (
            transactions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No transactions yet</p>
                <p className="text-sm">Start registering clients to see your activity here</p>
              </div>
            ) : (
              transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transaction.status === "completed" ? "bg-green-100" : transaction.status === "pending" ? "bg-yellow-100" : "bg-red-100"}`}>
                        <Calendar className={`h-4 w-4 ${transaction.status === "completed" ? "text-green-600" : transaction.status === "pending" ? "text-yellow-600" : "text-red-600"}`} />
                      </div>
                      <div>
                        {/* Display IDs for now */}
                        <p className="font-medium">Client ID: {transaction.client_id ?? 'N/A'}</p>
                        <p className="text-sm text-gray-500">Product ID: {transaction.product_id ?? 'N/A'} - {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R {transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-green-600">R {transaction.commission.toLocaleString()} commission</p>
                    </div>
                  </div>
                ))
            )
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <AgentSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {(() => {
          const path = location.pathname;
          if (path === "/agent" || path === "/agent/") return <DashboardHome />;
          if (path.includes("/agent/clients")) return <AgentClients />;
          if (path.includes("/agent/register-client")) return <ClientRegistration />;
          if (path.includes("/agent/products")) return <ProductSelection />;
          if (path.includes("/agent/commissions")) return <AgentCommissions />;
          if (path.includes("/agent/settings")) return <AgentSettings />;
          return <DashboardHome />; // Default
        })()}
      </main>
    </div>
  );
};

export default AgentDashboard;
