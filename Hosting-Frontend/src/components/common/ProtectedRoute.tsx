
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/contexts/auth/useAuth'; // Updated import path

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'agent';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  // Using placeholder useAuth hook now
  const { user, loading } = useAuth(); // Renamed isLoading to loading, removed profile, isAdmin, isAgent
  const location = useLocation();

  if (loading) { // Use 'loading' from placeholder hook
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // User not logged in (based on placeholder hook), redirect to login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Role-based access control - Placeholder logic
  // TODO: Re-implement role checking based on the new MySQL backend auth system
  if (requiredRole) {
     console.warn(`Role checking for '${requiredRole}' not implemented yet. Allowing access.`);
     // For now, allow access if a role is required but checking isn't implemented
     // Or redirect if you prefer stricter temporary behavior:
     // return <Navigate to="/" replace />;
  }

  // User is logged in (placeholder assumes so if !loading and user is not null, which it won't be here)
  // and role check is bypassed for now
  return <>{children}</>;
};

export default ProtectedRoute;
