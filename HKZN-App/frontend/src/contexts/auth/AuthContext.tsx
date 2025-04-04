import React from 'react';

// Define the User type (matching AuthProvider)
interface User {
  id: number;
  email: string;
  role: 'user' | 'admin' | 'agent';
}

// Define the actual context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (...args: unknown[]) => Promise<void>;
  logout: () => Promise<void>; // Logout likely doesn't need args here
  register: (...args: unknown[]) => Promise<void>;
  isAdmin: boolean; // Add isAdmin flag
  isAgent: boolean; // Add isAgent flag
}

// Create the context with the correct type
const AuthContext = React.createContext<AuthContextType | null>(null);

export default AuthContext;
