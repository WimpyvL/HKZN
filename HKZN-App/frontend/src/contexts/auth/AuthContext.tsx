import React from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { Profile, Credentials } from '@/types'; // Import Profile and Credentials

// Define the actual context type based on AuthProvider's value
interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null; // Use SupabaseUser type (id is string)
  profile: Profile | null; // Re-added profile state to context type
  loading: boolean;
  login: (credentials: Credentials) => Promise<Error | null>; // Return Error or null
  logout: () => Promise<void>;
  register: (credentials: Credentials) => Promise<Error | null>; // Return Error or null
  isAdmin: boolean;
  isAgent: boolean;
}

// Create the context with the correct type, initializing to null
// We could provide default values matching the initial state in AuthProvider if needed,
// but null is common for contexts that require a Provider wrapper.
const AuthContext = React.createContext<AuthContextType | null>(null);

export default AuthContext;
