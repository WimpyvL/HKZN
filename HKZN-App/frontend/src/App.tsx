
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/auth';
import ProtectedRoute from './components/common/ProtectedRoute';

import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import WebDesign from "./pages/WebDesign";
import Hosting from "./pages/Hosting";
import CloudServices from "./pages/CloudServices";
import Connectivity from "./pages/Connectivity";
import EmailAutomation from "./pages/EmailAutomation";
import FibrePrepaid from "./pages/FibrePrepaid";
import Security from "./pages/Security";
import VpnServices from "./pages/VpnServices";
import SolarSolutions from "./pages/SolarSolutions";
import MicrosoftBusiness from "./pages/MicrosoftBusiness"; // Added import
import Voip from "./pages/Voip"; // Added import
import ItSupport from "./pages/ItSupport"; // Added import
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ServiceWizardPage from "./pages/ServiceWizard";

// --- Dashboard Imports (adjust paths) ---
import AdminHome from "./dashboard/components/home"; // Renamed to avoid conflict with frontend Home/Index
import AgentsPage from "./dashboard/components/agents/AgentsPage";
import ClientsPage from "./dashboard/components/clients/ClientsPage";
import TransactionsPage from "./dashboard/components/transactions/TransactionsPage";
import SettingsPage from "./dashboard/components/settings/SettingsPage";
import AgentDashboard from "./dashboard/components/agent-dashboard/AgentDashboard";
import ProductManagement from "./dashboard/components/admin/ProductManagement";
import WebProductsPage from "./dashboard/components/admin/WebProductsPage";
import FiberProductsPage from "./dashboard/components/admin/FiberProductsPage";
import SolarProductsPage from "./dashboard/components/admin/SolarProductsPage";
import QuotesPage from "./dashboard/components/admin/QuotesPage";
import AdminCommissionPayouts from "./dashboard/components/dashboard/AdminCommissionPayouts";
// Note: LoadingScreen and NotFoundPage might conflict, use frontend versions or rename.
// Assuming frontend's NotFound is used. DashboardSelector might need a dedicated route if required.

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> {/* Removed basename="/ReactDev" */}
        <HelmetProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/web-design" element={<WebDesign />} />
                <Route path="/hosting" element={<Hosting />} />
                <Route path="/cloud-services" element={<CloudServices />} />
                <Route path="/connectivity" element={<Connectivity />} />
                <Route path="/email-automation" element={<EmailAutomation />} />
                <Route path="/fibre-prepaid" element={<FibrePrepaid />} />
                <Route path="/security" element={<Security />} />
                <Route path="/vpn-services" element={<VpnServices />} />
                <Route path="/solar-solutions" element={<SolarSolutions />} />
                <Route path="/microsoft-business" element={<MicrosoftBusiness />} /> {/* Added route */}
                <Route path="/voip" element={<Voip />} /> {/* Added route */}
                <Route path="/it-support" element={<ItSupport />} /> {/* Added route */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/service-wizard" element={<ServiceWizardPage />} /> {/* Add route for wizard */}

                {/* Auth routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />

                {/* --- Admin Dashboard Routes --- */}
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminHome /></ProtectedRoute>} />
                <Route path="/admin/quotes" element={<ProtectedRoute requiredRole="admin"><QuotesPage /></ProtectedRoute>} />
                <Route path="/admin/agents" element={<ProtectedRoute requiredRole="admin"><AgentsPage /></ProtectedRoute>} />
                <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin"><ClientsPage /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><ProductManagement /></ProtectedRoute>} />
                <Route path="/admin/products/web" element={<ProtectedRoute requiredRole="admin"><WebProductsPage /></ProtectedRoute>} />
                <Route path="/admin/products/fiber" element={<ProtectedRoute requiredRole="admin"><FiberProductsPage /></ProtectedRoute>} />
                <Route path="/admin/products/solar" element={<ProtectedRoute requiredRole="admin"><SolarProductsPage /></ProtectedRoute>} />
                <Route path="/admin/transactions" element={<ProtectedRoute requiredRole="admin"><TransactionsPage /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><SettingsPage /></ProtectedRoute>} />
                <Route path="/admin/commissions" element={<ProtectedRoute requiredRole="admin"><AdminCommissionPayouts /></ProtectedRoute>} />

                {/* --- Agent Dashboard Routes --- */}
                {/* Using ProtectedRoute from frontend context */}
                <Route
                  path="/agent/*"
                  element={
                    <ProtectedRoute requiredRole="agent">
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route (Keep frontend's) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
