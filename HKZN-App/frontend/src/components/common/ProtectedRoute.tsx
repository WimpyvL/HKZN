import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/contexts/auth/useAuth'; // Import the updated hook

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'agent'; // Roles defined in types/index.ts
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  // Use the updated useAuth hook providing Supabase state
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading indicator while checking auth state and fetching profile
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Use a consistent loader, e.g., from lucide-react if available */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // User is not logged in (no active session), redirect to login
    // Preserve the intended destination in location state
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role if requiredRole is specified
  if (requiredRole) {
    if (!profile) {
      // Profile is still loading or failed to load, deny access temporarily
      // This might happen briefly after login before profile is fetched.
      // Consider showing a specific loading/error state or redirecting.
      console.warn("ProtectedRoute: Profile not available for role check.");
      // Redirect to a safe default page, like dashboard or home
      return <Navigate to="/dashboard" replace />; // Or "/"
    }

    if (profile.role !== requiredRole) {
      // User is logged in but does not have the required role, redirect
      console.warn(`ProtectedRoute: Access denied. User role '${profile.role}' does not match required role '${requiredRole}'.`);
      // Redirect to a safe default page
      return <Navigate to="/dashboard" replace />; // Or "/"
    }
  }

  // User is logged in and meets role requirements (if any)
  return <>{children}</>;
};

export default ProtectedRoute;
