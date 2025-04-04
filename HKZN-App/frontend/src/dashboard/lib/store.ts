import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import * as api from "./api"; // For data fetching/mutation
import * as authApi from "./auth"; // For authentication calls

// --- Type Definitions ---
// (Assuming these are still relevant or defined elsewhere if needed by components)
export interface User {
  id: string | number; // Allow number if PHP returns int ID
  name: string;
  email: string;
  role: "admin" | "agent";
}

export interface Agent {
  id: string | number;
  name: string;
  email?: string; // Make optional if not always present
  phone?: string;
  referralCode?: string;
  activeClients?: number;
  totalSales?: number;
  commissionRate?: number;
  status?: "active" | "inactive" | "pending";
  joinDate?: string;
}

export interface Client {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  referredBy?: string; // Agent Name or ID? Needs consistency
  product?: string; // Product Name or ID? Needs consistency
  status?: "active" | "inactive" | "pending";
  joinDate?: string;
  address?: string;
}

export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  commissionRate?: number;
  features?: string[];
  isActive?: boolean;
  category?: "web" | "solar" | "fiber" | string; // Allow other categories
}

export interface Transaction {
  id: string | number;
  date: string;
  agentName?: string; // Prefer names if available from API
  clientName?: string;
  productName?: string; // Renamed from 'product' to avoid conflict
  amount?: number;
  commission?: number;
  status?: "completed" | "pending" | "failed";
  paymentMethod?: string;
  // Add IDs if needed for linking, e.g., agentId, clientId, productId
  agentId?: string | number;
  clientId?: string | number;
  productId?: string | number;
  notes?: string;
}

export interface CommissionPayout {
  id: string | number;
  agentId: string | number;
  agentName?: string; // Prefer name if available
  amount?: number;
  period?: string;
  status?: "pending" | "processed" | "failed";
  paymentDate?: string;
  transactionIds?: number[]; // Assuming PHP returns array of IDs
}

// --- Store State Interface ---
interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean; // Renamed for clarity
  login: (email: string, password: string) => Promise<boolean>; // Removed isAgent
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>; // Make async
  checkAuth: () => Promise<void>;
  initializeData: () => Promise<void>; // Add helper action type

  // Agents
  agents: Agent[];
  loadingAgents: boolean;
  fetchAgents: () => Promise<void>;
  addAgent: (agent: Omit<Agent, "id">) => Promise<boolean>;
  updateAgent: (id: string | number, data: Partial<Agent>) => Promise<boolean>;
  deleteAgent: (id: string | number) => Promise<boolean>;

  // Clients
  clients: Client[];
  loadingClients: boolean;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, "id">) => Promise<boolean>;
  updateClient: (id: string | number, data: Partial<Client>) => Promise<boolean>;
  deleteClient: (id: string | number) => Promise<boolean>;

  // Products
  products: Product[];
  loadingProducts: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "isActive">) => Promise<boolean>;
  updateProduct: (id: string | number, data: Partial<Product>) => Promise<boolean>;
  toggleProductStatus: (id: string | number) => Promise<boolean>;

  // Transactions
  transactions: Transaction[];
  loadingTransactions: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<boolean>;
  updateTransaction: (id: string | number, data: Partial<Transaction>) => Promise<boolean>;

  // Commission Payouts
  commissionPayouts: CommissionPayout[];
  loadingPayouts: boolean;
  fetchCommissionPayouts: () => Promise<void>;
  // addCommissionPayout removed
  processCommissionPayout: (id: string | number) => Promise<boolean>;
  generateCommissionPayouts: (period: string) => Promise<{ message: string; generated_count: number } | null>; // Add generate action
}

// --- Store Implementation ---
const stateCreator: StateCreator<AppState> = (set, get) => ({
  // Auth State & Actions
  currentUser: null,
  isAuthenticated: false,
  isLoadingAuth: true, // Start loading until checkAuth completes
  login: async (email, password) => {
    try {
      // Use refactored authApi.signIn
      const result = await authApi.signIn(email, password);
      if (result.success && result.user) {
        set({ currentUser: result.user, isAuthenticated: true });
        await get().initializeData(); // Fetch data after successful login
        return true;
      }
      set({ currentUser: null, isAuthenticated: false });
      return false;
    } catch (error) {
      console.error("Store login error:", error);
      set({ currentUser: null, isAuthenticated: false }); // Ensure state is cleared on failure
      return false;
    }
  },
  register: async (userData) => {
    try {
      // Use refactored authApi.signUp
      const result = await authApi.signUp(userData.email, userData.password, userData);
      return result.success;
    } catch (error) {
      console.error("Store registration error:", error);
      return false;
    }
  },
  logout: async () => {
    try {
      // Use refactored authApi.signOut
      await authApi.signOut();
    } catch (error) {
      console.error("Store logout error:", error);
    } finally {
      // Clear all fetched data on logout
      set({
        currentUser: null,
        isAuthenticated: false,
        agents: [],
        clients: [],
        products: [],
        transactions: [],
        commissionPayouts: [],
      });
    }
  },
  checkAuth: async () => {
    set({ isLoadingAuth: true });
    try {
      // Use refactored authApi.getCurrentUser
      const result = await authApi.getCurrentUser();
      if (result.success && result.user) {
        set({ currentUser: result.user, isAuthenticated: true, isLoadingAuth: false });
        await get().initializeData(); // Fetch data if already authenticated
      } else {
        // If check was successful but user not logged in, or if check failed
        set({ currentUser: null, isAuthenticated: false, isLoadingAuth: false });
      }
    } catch (error) {
      // Catch potential errors from handleAuthResponse if fetch itself fails
      console.error("Store auth check error:", error);
      set({ currentUser: null, isAuthenticated: false, isLoadingAuth: false });
    }
  },
  // Helper to fetch data after auth success (Implementation added)
  initializeData: async () => {
    if (!get().isAuthenticated) {
        console.log("User not authenticated, skipping data initialization.");
        return;
    }
    console.log("Initializing data fetch...");
    // Use Promise.allSettled to fetch concurrently and handle individual errors
    await Promise.allSettled([
      get().fetchAgents(),
      get().fetchClients(),
      get().fetchProducts(),
      get().fetchTransactions(),
      get().fetchCommissionPayouts(),
    ]).then(results => {
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Error initializing data slice ${index}:`, result.reason);
            }
        });
        console.log("Initial data fetch attempt complete.");
    });
  },

  // Agents State & Actions
  agents: [],
  loadingAgents: false,
  fetchAgents: async () => {
    if (!get().isAuthenticated) return; // Don't fetch if not logged in
    set({ loadingAgents: true });
    try {
      const data = await api.fetchAgents();
      set({ agents: data || [], loadingAgents: false });
    } catch (error) {
      console.error("Store fetchAgents error:", error);
      set({ agents: [], loadingAgents: false });
    }
  },
  addAgent: async (agent) => {
    if (!get().isAuthenticated) return false;
    try {
      const newAgent = await api.createAgent(agent);
      set((state) => ({ agents: [...state.agents, newAgent] }));
      return true;
    } catch (error) {
      console.error("Store addAgent error:", error);
      return false;
    }
  },
  updateAgent: async (id, data) => {
     if (!get().isAuthenticated) return false;
    try {
      await api.updateAgent(id, data);
      set((state) => ({
        agents: state.agents.map((a) => (a.id === id ? { ...a, ...data } : a)),
      }));
      return true;
    } catch (error) {
      console.error("Store updateAgent error:", error);
      return false;
    }
  },
  deleteAgent: async (id) => {
     if (!get().isAuthenticated) return false;
    try {
      await api.deleteAgent(id);
      set((state) => ({ agents: state.agents.filter((a) => a.id !== id) }));
      return true;
    } catch (error) {
      console.error("Store deleteAgent error:", error);
      return false;
    }
  },

  // Clients State & Actions
  clients: [],
  loadingClients: false,
  fetchClients: async () => {
    if (!get().isAuthenticated) return;
    set({ loadingClients: true });
    try {
      const data = await api.fetchClients();
      set({ clients: data || [], loadingClients: false });
    } catch (error) {
      console.error("Store fetchClients error:", error);
      set({ clients: [], loadingClients: false });
    }
  },
  addClient: async (client) => {
     if (!get().isAuthenticated) return false;
    try {
      const newClient = await api.createClient(client);
      set((state) => ({ clients: [...state.clients, newClient] }));
      return true;
    } catch (error) {
      console.error("Store addClient error:", error);
      return false;
    }
  },
  updateClient: async (id, data) => {
     if (!get().isAuthenticated) return false;
    try {
      await api.updateClient(id, data);
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }));
      return true;
    } catch (error) {
      console.error("Store updateClient error:", error);
      return false;
    }
  },
  deleteClient: async (id) => {
     if (!get().isAuthenticated) return false;
    try {
      await api.deleteClient(id);
      set((state) => ({ clients: state.clients.filter((c) => c.id !== id) }));
      return true;
    } catch (error) {
      console.error("Store deleteClient error:", error);
      return false;
    }
  },

  // Products State & Actions
  products: [],
  loadingProducts: false,
  fetchProducts: async () => {
    if (!get().isAuthenticated) return;
    set({ loadingProducts: true });
    try {
      const data = await api.fetchProducts();
      set({ products: data || [], loadingProducts: false });
    } catch (error) {
      console.error("Store fetchProducts error:", error);
      set({ products: [], loadingProducts: false });
    }
  },
  addProduct: async (product) => {
     if (!get().isAuthenticated) return false;
    try {
      const newProduct = await api.createProduct(product);
      set((state) => ({ products: [...state.products, newProduct] }));
      return true;
    } catch (error) {
      console.error("Store addProduct error:", error);
      return false;
    }
  },
  updateProduct: async (id, data) => {
     if (!get().isAuthenticated) return false;
    try {
      await api.updateProduct(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }));
      return true;
    } catch (error) {
      console.error("Store updateProduct error:", error);
      return false;
    }
  },
  toggleProductStatus: async (id) => {
     if (!get().isAuthenticated) return false;
    try {
      await api.toggleProductStatus(id);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, isActive: !p.isActive } : p
        ),
      }));
      return true;
    } catch (error) {
      console.error("Store toggleProductStatus error:", error);
      return false;
    }
  },

  // Transactions State & Actions
  transactions: [],
  loadingTransactions: false,
  fetchTransactions: async () => {
    if (!get().isAuthenticated) return;
    set({ loadingTransactions: true });
    try {
      const data = await api.fetchTransactions();
      set({ transactions: data || [], loadingTransactions: false });
    } catch (error) {
      console.error("Store fetchTransactions error:", error);
      set({ transactions: [], loadingTransactions: false });
    }
  },
  addTransaction: async (transaction) => {
     if (!get().isAuthenticated) return false;
    try {
      const newTransaction = await api.createTransaction(transaction);
      set((state) => ({ transactions: [newTransaction, ...state.transactions] }));
      return true;
    } catch (error) {
      console.error("Store addTransaction error:", error);
      return false;
    }
  },
  updateTransaction: async (id, data) => {
     if (!get().isAuthenticated) return false;
    try {
      await api.updateTransaction(id, data);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...data } : t
        ),
      }));
      return true;
    } catch (error) {
      console.error("Store updateTransaction error:", error);
      return false;
    }
  },

  // Commission Payouts State & Actions
  commissionPayouts: [],
  loadingPayouts: false,
  fetchCommissionPayouts: async () => {
    if (!get().isAuthenticated) return;
    set({ loadingPayouts: true });
    try {
      const data = await api.fetchCommissionPayouts();
      set({ commissionPayouts: data || [], loadingPayouts: false });
    } catch (error) {
      console.error("Store fetchCommissionPayouts error:", error);
      set({ commissionPayouts: [], loadingPayouts: false });
    }
  },
  processCommissionPayout: async (id) => {
     if (!get().isAuthenticated) return false;
    try {
      await api.processCommissionPayout(id);
      set((state) => ({
        commissionPayouts: state.commissionPayouts.map((p) =>
          p.id === id
            ? { ...p, status: "processed", paymentDate: new Date().toISOString().split("T")[0] }
            : p
        ),
      }));
      return true;
    } catch (error) {
      console.error("Store processCommissionPayout error:", error);
      return false;
    }
  },
  generateCommissionPayouts: async (period: string) => {
     if (!get().isAuthenticated) return null;
     try {
        // Assuming api.generateCommissionPayouts returns { message: string, generated_count: number } or throws
        const result = await api.generateCommissionPayouts(period);
        get().fetchCommissionPayouts(); // Refresh payouts list after generation
        return result;
     } catch (error) {
        console.error("Store generateCommissionPayouts error:", error);
        return null; // Indicate failure
     }
  },

});

// Create the store with persistence for auth state
export const useAppStore = create<AppState>()(
  persist(
    stateCreator,
    {
      name: "hkzn-app-storage", // New storage name
      partialize: (state) => ({
        // Only persist auth state
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth check on app load
useAppStore.getState().checkAuth();
