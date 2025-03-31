import { Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AgentsPage from "./components/agents/AgentsPage";
import ClientsPage from "./components/clients/ClientsPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import SettingsPage from "./components/settings/SettingsPage";
import AgentDashboard from "./components/agent-dashboard/AgentDashboard";
import ProductManagement from "./components/admin/ProductManagement";
import WebProductsPage from "./components/admin/WebProductsPage";
import FiberProductsPage from "./components/admin/FiberProductsPage";
import SolarProductsPage from "./components/admin/SolarProductsPage";
import QuotesPage from "./components/admin/QuotesPage"; // Import the new QuotesPage
import AdminCommissionPayouts from "./components/dashboard/AdminCommissionPayouts";
import LoadingScreen from "./components/LoadingScreen";
import DashboardSelector from "./components/DashboardSelector";
import { useStore } from "./lib/store";
import ProtectedAgentRoute from "./components/auth/ProtectedAgentRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const { isAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Dashboard Selector - Main Entry Point */}
        <Route path="/" element={<DashboardSelector />} />

        {/* Admin Routes - Protected with ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Add route for the new QuotesPage */}
        <Route
          path="/quotes"
          element={
            <ProtectedRoute requiredRole="admin">
              <QuotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute requiredRole="admin">
              <AgentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute requiredRole="admin">
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/web"
          element={
            <ProtectedRoute requiredRole="admin">
              <WebProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/fiber"
          element={
            <ProtectedRoute requiredRole="admin">
              <FiberProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/solar"
          element={
            <ProtectedRoute requiredRole="admin">
              <SolarProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute requiredRole="admin">
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/commissions"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCommissionPayouts />
            </ProtectedRoute>
          }
        />

        {/* Agent Routes - Protected with ProtectedAgentRoute */}
        {/* Single route with wildcard to handle all agent routes */}
        <Route
          path="/agent/*"
          element={
            <ProtectedAgentRoute>
              <AgentDashboard />
            </ProtectedAgentRoute>
          }
        />

        {/* Allow Tempo routes to be captured before the catchall */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
      </Routes>
    </Suspense>
  );
}

export default App;
