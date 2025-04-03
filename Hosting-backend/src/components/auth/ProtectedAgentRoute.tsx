import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/store"; // Corrected import
import LoadingScreen from "../LoadingScreen";

interface ProtectedAgentRouteProps {
  children: React.ReactNode;
}

const ProtectedAgentRoute: React.FC<ProtectedAgentRouteProps> = ({
  children,
}) => {
  const { currentUser, isAuthenticated, isLoadingAuth } = useAppStore(); // Corrected hook name, added isLoadingAuth
  const navigate = useNavigate();

  // Show loading screen while checking authentication
  if (isLoadingAuth) {
    return <LoadingScreen />;
  }
  // If not authenticated after check, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is not an agent, redirect immediately to admin dashboard
  if (currentUser?.role !== "agent") {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is an agent, render children
  return <>{children}</>;
};

export default ProtectedAgentRoute;
