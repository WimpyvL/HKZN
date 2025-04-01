import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
// import { useSupabaseStore } from "@/lib/supabaseStore"; // Removed unused import
import { useStore } from "@/lib/store";
import LoadingScreen from "../LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "agent";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, currentUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
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
