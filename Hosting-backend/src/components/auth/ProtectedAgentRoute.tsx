import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import LoadingScreen from "../LoadingScreen";

interface ProtectedAgentRouteProps {
  children: React.ReactNode;
}

const ProtectedAgentRoute: React.FC<ProtectedAgentRouteProps> = ({
  children,
}) => {
  const { currentUser, isAuthenticated } = useStore();
  const navigate = useNavigate();

  // No need for useEffect since we're handling the redirect immediately below

  // Show loading screen while checking authentication
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
