import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext';
// Import placeholder functions - these might eventually call backend API
import { loginUser, logoutUser, registerUser } from './authFunctions';

// Define a more specific user type based on what check_auth returns
interface User {
  id: number;
  email: string;
  role: 'user' | 'admin' | 'agent'; // Match roles defined in PHP/DB
  // Add other fields if needed
}

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading until check is complete

  // Function to check authentication status with the backend
  const checkAuthState = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/check_auth.php`; // Use env variable
      const response = await fetch(apiUrl, {
        // IMPORTANT: Send credentials to allow session cookies to be sent/received
        credentials: 'include',
      });
      const result = await response.json();

      if (response.ok && result.success && result.loggedIn) {
        setUser(result.user as User); // Set user data if logged in
      } else {
        setUser(null); // Ensure user is null if not logged in or error
        // Optional: Handle specific errors from check_auth if needed
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setUser(null); // Set user to null on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth state on initial mount
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  // --- Placeholder Auth Functions ---
  // These should ideally be updated in authFunctions.ts to call the backend API
  // and then update the state here via checkAuthState or directly setting user.

  const handleLogin = async (...args: unknown[]) => {
    // This function is now primarily handled in Login.tsx calling the API.
    // After successful API login, the session is set. We might want to
    // re-trigger checkAuthState here or directly set the user based on API response.
    console.warn("AuthProvider: Login called, consider updating state via checkAuthState or response.");
    await loginUser(...args); // Call placeholder
    await checkAuthState(); // Re-check state after login attempt
  };

  const handleLogout = async () => {
    console.log("Attempting logout...");
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/logout.php`; // Use env variable
      const response = await fetch(apiUrl, {
        method: 'POST', // Use POST as defined in logout.php CORS headers
        credentials: 'include', // Send session cookie
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        // Log error but proceed with frontend logout anyway
        console.error("Logout API call failed:", result.message || `HTTP status ${response.status}`);
      } else {
        console.log("Logout successful via API.");
      }
    } catch (error) {
      console.error("Error calling logout API:", error);
    } finally {
      // Always clear frontend state regardless of API call success/failure
      setUser(null);
      // We don't necessarily need to call checkAuthState here,
      // as the session should be destroyed on the backend.
    }
  };

  const handleRegister = async (...args: unknown[]) => {
    // This function is handled in Register.tsx calling the API.
    console.warn("AuthProvider: Register called.");
    await registerUser(...args); // Call placeholder
    // No state change needed here, user needs to log in after registering.
  };


  // Value provided to context consumers
  const value = {
    user,
    loading,
    login: handleLogin, // Provide wrapped/placeholder functions
    logout: handleLogout,
    register: handleRegister,
    // Add isAdmin/isAgent helpers if needed, derived from user.role
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
