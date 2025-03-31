
export type UserRole = 'admin' | 'agent';

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  phone: string | null;
  address: string | null;
  commission_rate: number;
  created_at: string;
  updated_at: string;
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
  value: any;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  session: any | null;
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAgent: boolean;
}
