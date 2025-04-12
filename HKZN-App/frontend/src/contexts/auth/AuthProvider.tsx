import React, { ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import AuthContext from './AuthContext';
import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentSession,
  onAuthStateChange,
  // getCurrentUser // We might fetch profile separately
} from './authFunctions';
import { supabase } from '@/integrations/supabase/client'; // Re-added for profile fetching
import type { Profile } from '@/types'; // Re-added for profile state

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // Re-added profile state
  const [loading, setLoading] = useState(true); // Start loading until initial check is complete

  // Re-added fetchUserProfile function, targeting 'profiles' table
  const fetchUserProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    console.log("Fetching profile from 'profiles' table for user ID:", userId);
    try {
      const { data, error } = await supabase
        .from('profiles') // Target 'profiles' table
        .select('*')
        .eq('id', userId)
        .single(); // Fetch a single record

      if (error) {
        console.error("Error fetching user profile:", error.message);
        setProfile(null);
      } else {
        console.log("Profile fetched:", data);
        setProfile(data as Profile); // Set profile data
      }
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      setProfile(null);
    }
  }, []);


  // Check initial session and set up listener
  useEffect(() => {
    setLoading(true);
    // Fetch initial session and user data, then fetch profile
    getCurrentSession().then(({ session: initialSession }) => {
      setSession(initialSession);
      const initialUser = initialSession?.user ?? null;
      setUser(initialUser);
      // Fetch profile after getting user
      fetchUserProfile(initialUser?.id).finally(() => {
        // Initial check complete after profile fetch attempt
        setLoading(false);
      });
    });

    // Listen for auth state changes
    const authListener = onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // Fetch profile on SIGNED_IN, clear on SIGNED_OUT
      if (_event === 'SIGNED_IN') {
        setLoading(true); // Set loading while fetching profile
        fetchUserProfile(currentUser?.id).finally(() => setLoading(false));
      } else if (_event === 'SIGNED_OUT') {
        setProfile(null); // Clear profile on logout
        setLoading(false); // Ensure loading is false on logout
      }
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserProfile]); // Re-added fetchUserProfile dependency

  // --- Auth Functions ---
  // These now just call the functions from authFunctions.ts
  // State updates are handled by the onAuthStateChange listener

  const handleLogin = async (credentials: import('@/types').Credentials) => {
    setLoading(true); // Indicate loading during login attempt
    let loginError = null; // Variable to store potential error
    try {
      const { error } = await loginUser(credentials);
      if (error) {
        loginError = error; // Store the error
        console.error("Login failed in AuthProvider:", error.message);
      }
      // State update (user, profile) will be handled by onAuthStateChange
    } catch (err) {
      // Catch unexpected errors during the login call itself
      console.error("Unexpected error during handleLogin:", err);
      loginError = err instanceof Error ? err : new Error('An unexpected error occurred.');
    } finally {
       // Loading state should be reset by onAuthStateChange's profile fetch
       // or immediately if login fails before triggering SIGNED_IN.
       // If loginError is present and SIGNED_IN didn't fire, reset loading.
       if (loginError) {
         setLoading(false);
       }
       // We might need a slight delay or better state management if login fails quickly
       // For now, let the listener handle it. If listener doesn't fire on fail, reset here.
       // setLoading(false); // Potentially reset loading here if login fails without state change
    }
    return loginError; // Explicitly return the error object or null
  };

  const handleLogout = async () => {
    setLoading(true); // Indicate loading during logout
    try {
      await logoutUser();
      // State update (user=null, profile=null) handled by onAuthStateChange
    } finally {
      setLoading(false); // Reset loading after logout attempt
    }
  };

  const handleRegister = async (credentials: import('@/types').Credentials) => {
     setLoading(true); // Indicate loading during registration attempt
     let registrationError = null; // Variable to store potential error
     try {
        const { error } = await registerUser(credentials);
        if (error) {
           registrationError = error; // Store the error
           console.error("Registration failed in AuthProvider:", error.message);
        }
        // User might need to confirm email, state change handled by listener if auto-login occurs
     } catch (err) {
        // Catch unexpected errors during the register call itself
        console.error("Unexpected error during handleRegister:", err);
        registrationError = err instanceof Error ? err : new Error('An unexpected error occurred.');
     } finally {
        setLoading(false); // Reset loading after registration attempt
     }
     return registrationError; // Explicitly return the error object or null
  };


  // Value provided to context consumers
  const value = useMemo(() => ({
    session,
    user,
    profile, // Re-added profile to context value
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    // Role checks still use app_metadata for efficiency
    isAdmin: user?.app_metadata?.role === 'admin',
    isAgent: user?.app_metadata?.role === 'agent',
  }), [session, user, profile, loading]); // Re-added profile to dependency array

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
