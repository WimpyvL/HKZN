import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppStore } from "@/dashboard/lib/store"; // Corrected import path
import LoadingScreen from "../LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "agent";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, currentUser, isLoadingAuth } = useAppStore(); // Corrected hook name, added isLoadingAuth

  if (isLoadingAuth) { // Use loading state from store
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check it
  if (requiredRole && currentUser?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (currentUser?.role === "agent") {
      return <Navigate to="/agent" replace />;
    } else if (currentUser?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
