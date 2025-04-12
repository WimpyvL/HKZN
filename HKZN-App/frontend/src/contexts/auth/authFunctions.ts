import { supabase } from '@/integrations/supabase/client'; // Assuming '@/' maps to './src/*'
import type { Credentials } from '@/types'; // Assuming Credentials type exists

export const loginUser = async ({ email, password }: Credentials) => {
  console.log("Attempting Supabase login for:", email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error.message);
      return { user: null, session: null, error };
    }

    console.log("Supabase login successful:", data.user?.email);
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    console.error("Unexpected login error:", err);
    const error = err instanceof Error ? err : new Error('An unexpected error occurred during login.');
    return { user: null, session: null, error };
  }
};

export const logoutUser = async () => {
  console.log("Attempting Supabase logout");
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase logout error:", error.message);
      return { error };
    }
    console.log("Supabase logout successful");
    return { error: null };
  } catch (err) {
     console.error("Unexpected logout error:", err);
     const error = err instanceof Error ? err : new Error('An unexpected error occurred during logout.');
     return { error };
  }
};

export const registerUser = async ({ email, password }: Credentials) => {
  console.log("Attempting Supabase registration for:", email);
   try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Add options here if needed, e.g., for email confirmation redirect
      // options: {
      //   emailRedirectTo: 'http://localhost:5173/welcome', // Example redirect URL
      // }
    });

    if (error) {
      console.error("Supabase registration error:", error.message);
      return { user: null, session: null, error };
    }

    // Depending on your Supabase project settings (e.g., email confirmation required),
    // data.user might exist but data.session might be null until confirmation.
    console.log("Supabase registration initiated:", data.user?.email, "Session:", data.session ? "created" : "pending confirmation");
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
     console.error("Unexpected registration error:", err);
     const error = err instanceof Error ? err : new Error('An unexpected error occurred during registration.');
     return { user: null, session: null, error };
  }
};

// Function to get the current session (useful for initial load)
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error.message);
    return { session: null, error };
  }
  return { session: data.session, error: null };
};

// Function to get the current user (useful for profile info)
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
   if (error) {
    console.error("Error getting user:", error.message);
    return { user: null, error };
  }
  return { user, error: null };
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: import('@supabase/supabase-js').Session | null) => void) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(callback);
  return authListener;
};
