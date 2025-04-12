
export type UserRole = 'client' | 'admin' | 'agent'; // Added 'client'

export interface Credentials {
  email: string;
  password: string;
}

// Updated Profile interface to match the new 'profiles' table
export interface Profile {
  id: string; // Matches auth.users.id
  first_name: string | null;
  last_name: string | null;
  role: UserRole; // 'client', 'admin', 'agent'
  created_at: string;
  updated_at: string;
  // Removed: email, phone, address, commission_rate (not in the new profiles table)
}

export interface Client {
  id: string;
  agent_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  commission_rate: number | null;
  features: { features: string[] } | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  agent_id: string | null;
  client_id: string | null;
  product_id: string | null;
  amount: number;
  commission_amount: number;
  status: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface Commission {
  id: string;
  agent_id: string | null;
  transaction_id: string | null;
  amount: number;
  status: string;
  payout_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: unknown; // Use unknown instead of any
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  session: unknown | null; // Use unknown instead of any
  user: unknown | null; // Use unknown instead of any
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAgent: boolean;
}
