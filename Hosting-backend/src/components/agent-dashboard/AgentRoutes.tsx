import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AgentDashboard from "./AgentDashboard";
import AgentClients from "./AgentClients";
import ClientRegistration from "./ClientRegistration";
import ProductSelection from "./ProductSelection";
import AgentCommissions from "./AgentCommissions";
import AgentSettings from "./AgentSettings";

const AgentRoutes = () => {
  // Add console logging to help debug routing issues
  console.log("Rendering AgentRoutes component");
  console.log("Current path:", window.location.pathname);
  console.log("Current hash:", window.location.hash);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/agent" replace />} />
      <Route path="/agent" element={<AgentDashboard />} />
      <Route path="/agent/clients" element={<AgentClients />} />
      <Route path="/agent/register-client" element={<ClientRegistration />} />
      <Route path="/agent/products" element={<ProductSelection />} />
      <Route path="/agent/commissions" element={<AgentCommissions />} />
      <Route path="/agent/settings" element={<AgentSettings />} />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/agent" replace />} />
    </Routes>
  );
};

export default AgentRoutes;
