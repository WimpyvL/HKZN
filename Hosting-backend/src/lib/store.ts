import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types - Keep necessary type definitions even if state is removed,
// as they might be used by components (like modals).
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent";
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  activeClients: number;
  totalSales: number;
  commissionRate: number;
  status: "active" | "inactive" | "pending";
  joinDate: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  referredBy: string;
  product: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  commissionRate: number;
  features: string[];
  isActive: boolean;
  category?: "web" | "solar" | "fiber";
}

export interface Transaction {
  id: string;
  date: string;
  agentName: string;
  clientName: string;
  product: string;
  amount: number;
  commission: number;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
}

export interface CommissionPayout {
  id: string;
  agentId: string;
  agentName: string;
  amount: number;
  period: string;
  status: "pending" | "processed" | "failed";
  paymentDate?: string;
}

export interface Settings {
  general: {
    companyName: string;
    adminEmail: string;
    timezone: string;
    dateFormat: string;
    darkMode: boolean;
  };
  commission: {
    defaultRate: number;
    minRate: number;
    maxRate: number;
    payoutThreshold: number;
    autoApprove: boolean;
    tieredRates: boolean;
  };
  notifications: {
    email: boolean;
    newClient: boolean;
    commission: boolean;
    agentActivity: boolean;
    notificationEmail: string;
  };
}

// Define the state shape for ONLY Auth and Settings
interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    isAgent: boolean,
  ) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;

  // Settings
  settings: Settings;
  updateSettings: (data: Partial<Settings>) => void;

  // Removed state slices for Agents, Clients, Products, Transactions, Payouts
}

// Keep default settings
const defaultSettings: Settings = {
  general: {
    companyName: "Agent Referrals Inc.",
    adminEmail: "admin@agentreferrals.com",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    darkMode: false,
  },
  commission: {
    defaultRate: 5.0,
    minRate: 2.0,
    maxRate: 10.0,
    payoutThreshold: 100,
    autoApprove: true,
    tieredRates: false,
  },
  notifications: {
    email: true,
    newClient: true,
    commission: true,
    agentActivity: false,
    notificationEmail: "notifications@agentreferrals.com",
  },
};

// Create store with only Auth and Settings state + actions
export const useStore = create<AppState>()( // Add type hint here
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      login: async (email, password, isAgent) => {
        // Simulate API call (replace with actual API call later)
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (email && password) {
          let user: User;
          if (email === "admin@example.com" && password === "password123") {
            user = { id: "admin-1", name: "Admin User", email, role: "admin" };
          } else if (email === "agent@example.com" && password === "password123") {
            user = { id: "1", name: "John Smith", email, role: "agent" };
          } else {
             // Basic fallback for demo purposes
             const role = isAgent ? "agent" : "admin";
             user = { id: isAgent ? "agent-demo" : "admin-demo", name: isAgent ? "Demo Agent" : "Demo Admin", email, role };
          }
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      register: async (userData) => {
        // Simulate API call (replace with actual API call later)
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (userData.email && userData.password) {
          return true; // Simulate success
        }
        return false;
      },
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      // Settings
      settings: defaultSettings,
      updateSettings: (data) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...data,
            // Deep merge if necessary, e.g., for nested objects
            general: { ...state.settings.general, ...data.general },
            commission: { ...state.settings.commission, ...data.commission },
            notifications: { ...state.settings.notifications, ...data.notifications },
          },
        }));
      },

      // Removed actions for Agents, Clients, Products, Transactions, Payouts
    }),
    {
      name: "agent-referral-storage",
      // Partialize function now correctly reflects the remaining state
      partialize: (state): Pick<AppState, 'currentUser' | 'isAuthenticated' | 'settings'> => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        settings: state.settings,
      }),
    },
  ),
);
