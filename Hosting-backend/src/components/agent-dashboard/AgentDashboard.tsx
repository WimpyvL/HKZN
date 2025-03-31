import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AgentSidebar from "./AgentSidebar";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  LineChart,
  PieChart,
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

const AgentDashboard = () => {
  const { currentUser, clients, transactions, products } = useStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalCommission: 0,
    pendingCommission: 0,
    recentSales: 0,
  });

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "agent") {
      navigate("/");
      return;
    }

    // Calculate agent stats when user is authenticated and is an agent
    // Filter clients referred by this agent
    const agentClients = clients.filter(
      (c) => c.referredBy === currentUser.name,
    );

    // Filter transactions for this agent
    const agentTransactions = transactions.filter(
      (t) => t.agentName === currentUser.name,
    );

    // Calculate stats
    const totalClients = agentClients.length;
    const activeClients = agentClients.filter(
      (c) => c.status === "active",
    ).length;
    const totalCommission = agentTransactions.reduce(
      (sum, t) => sum + t.commission,
      0,
    );
    const pendingCommission = agentTransactions
      .filter((t) => t.status === "pending")
      .reduce((sum, t) => sum + t.commission, 0);
    const recentSales = agentTransactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return transactionDate >= thirtyDaysAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    setStats({
      totalClients,
      activeClients,
      totalCommission,
      pendingCommission,
      recentSales,
    });
  }, [currentUser, clients, transactions, navigate]);

  // Removed duplicate useEffect for calculating agent stats

  // Main dashboard content
  const DashboardHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <div>
          <span className="text-sm text-gray-500 mr-2">Welcome back,</span>
          <span className="font-medium">{currentUser?.name}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold">{stats.totalClients}</p>
              <p className="text-xs text-gray-500">
                {stats.activeClients} active
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Commission</p>
              <p className="text-2xl font-bold">
                R {stats.totalCommission.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                R {stats.pendingCommission.toLocaleString()} pending
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
              <p className="text-sm text-gray-500">Recent Sales (30d)</p>
              <p className="text-2xl font-bold">
                R {stats.recentSales.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {
                  transactions.filter(
                    (t) =>
                      t.agentName === currentUser?.name &&
                      t.status === "completed",
                  ).length
                }{" "}
                transactions
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 h-20"
            onClick={() => navigate("/agent/register-client")}
          >
            <Users className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Register Client</p>
              <p className="text-xs text-gray-500">Add a new client</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 h-20"
            onClick={() => navigate("/agent/products")}
          >
            <Package className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">View Products</p>
              <p className="text-xs text-gray-500">
                {products.filter((p) => p.isActive).length} active products
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 h-20"
            onClick={() => navigate("/agent/commissions")}
          >
            <DollarSign className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Check Commissions</p>
              <p className="text-xs text-gray-500">View your earnings</p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {transactions
            .filter((t) => t.agentName === currentUser?.name)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 5)
            .map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${transaction.status === "completed" ? "bg-green-100" : transaction.status === "pending" ? "bg-yellow-100" : "bg-red-100"}`}
                  >
                    <Calendar
                      className={`h-4 w-4 ${transaction.status === "completed" ? "text-green-600" : transaction.status === "pending" ? "text-yellow-600" : "text-red-600"}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.clientName}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.product} - {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    R {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    R {transaction.commission.toLocaleString()} commission
                  </p>
                </div>
              </div>
            ))}

          {transactions.filter((t) => t.agentName === currentUser?.name)
            .length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>No transactions yet</p>
              <p className="text-sm">
                Start registering clients to see your activity here
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <AgentSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Use location to determine which component to render */}
        {(() => {
          // Add console logging to help debug routing issues
          console.log("Current location in AgentDashboard:", location.pathname);

          const path = location.pathname;

          // Use includes for more flexible path matching with BrowserRouter
          if (path === "/agent" || path === "/agent/") {
            return <DashboardHome />;
          } else if (path.includes("/agent/clients")) {
            return <AgentClients />;
          } else if (path.includes("/agent/register-client")) {
            return <ClientRegistration />;
          } else if (path.includes("/agent/products")) {
            return <ProductSelection />;
          } else if (path.includes("/agent/commissions")) {
            return <AgentCommissions />;
          } else if (path.includes("/agent/settings")) {
            return <AgentSettings />;
          } else {
            // Default to dashboard home if no match
            return <DashboardHome />;
          }
        })()}
      </main>
    </div>
  );
};

export default AgentDashboard;
