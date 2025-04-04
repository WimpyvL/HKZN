import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/store"; // Corrected import

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  checkAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use isLoadingAuth from the store now
  const { isAuthenticated, isLoadingAuth, checkAuth } = useAppStore();
  const navigate = useNavigate();

  // Check authentication on mount using the store's checkAuth
  useEffect(() => {
    // The checkAuth function is now called automatically when the store initializes
    // We just need to reflect the store's loading state
  }, []); // Empty dependency array, checkAuth runs once on store init

  const value = {
    isAuthenticated,
    isLoading: isLoadingAuth, // Use loading state from store
    checkAuth, // Pass the checkAuth function from the store
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
