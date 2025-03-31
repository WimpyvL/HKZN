import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";

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
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, currentUser } = useStore();
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkInitialAuth = () => {
      try {
        // Check if we have auth data in localStorage
        const storedData = localStorage.getItem("agent-referral-storage");
        if (storedData) {
          // We have data, auth is complete
          setIsLoading(false);
        } else {
          // No stored data, redirect to login
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoading(false);
      }
    };

    // Add a timeout to ensure we don't get stuck in loading state
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    checkInitialAuth();

    // Clear timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []);

  // Mock auth check function
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Simulate auth check
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
