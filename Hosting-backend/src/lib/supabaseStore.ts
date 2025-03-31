import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Agent,
  Client,
  Product,
  Transaction,
  CommissionPayout,
  Settings,
  User,
} from "./store";
import * as api from "./api";
import * as auth from "./auth";

interface SupabaseState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    isAgent: boolean,
  ) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Agents
  agents: Agent[];
  loadingAgents: boolean;
  fetchAgents: () => Promise<void>;
  addAgent: (agent: Omit<Agent, "id">) => Promise<boolean>;
  updateAgent: (id: string, data: Partial<Agent>) => Promise<boolean>;
  deleteAgent: (id: string) => Promise<boolean>;

  // Clients
  clients: Client[];
  loadingClients: boolean;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, "id">) => Promise<boolean>;
  updateClient: (id: string, data: Partial<Client>) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;

  // Products
  products: Product[];
  loadingProducts: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "isActive">) => Promise<boolean>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<boolean>;
  toggleProductStatus: (id: string) => Promise<boolean>;

  // Transactions
  transactions: Transaction[];
  loadingTransactions: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<boolean>;
  updateTransaction: (
    id: string,
    data: Partial<Transaction>,
  ) => Promise<boolean>;

  // Commission Payouts
  commissionPayouts: CommissionPayout[];
  loadingPayouts: boolean;
  fetchCommissionPayouts: () => Promise<void>;
  addCommissionPayout: (
    payout: Omit<CommissionPayout, "id">,
  ) => Promise<boolean>;
  processCommissionPayout: (id: string) => Promise<boolean>;

  // Settings
  settings: Settings | null;
  loadingSettings: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<Settings>) => Promise<boolean>;
}

// Default settings
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

export const useSupabaseStore = create<SupabaseState>(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,
      login: async (email, password, isAgent) => {
        try {
          const result = await auth.signIn(email, password);
          if (result.success && result.user) {
            set({ currentUser: result.user, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },
      register: async (userData) => {
        try {
          const result = await auth.signUp(
            userData.email,
            userData.password,
            userData,
          );
          return result.success;
        } catch (error) {
          console.error("Registration error:", error);
          return false;
        }
      },
      logout: async () => {
        await auth.signOut();
        set({ currentUser: null, isAuthenticated: false });
      },
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const result = await auth.getCurrentUser();
          if (result.success && result.user) {
            set({ currentUser: result.user, isAuthenticated: true });
          } else {
            set({ currentUser: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Auth check error:", error);
          set({ currentUser: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      // Agents
      agents: [],
      loadingAgents: false,
      fetchAgents: async () => {
        set({ loadingAgents: true });
        try {
          const result = await api.fetchAgents();
          if (result.success) {
            set({ agents: result.data || [] });
          }
        } catch (error) {
          console.error("Error fetching agents:", error);
        } finally {
          set({ loadingAgents: false });
        }
      },
      addAgent: async (agent) => {
        try {
          const result = await api.createAgent(agent);
          if (result.success && result.data) {
            set((state) => ({ agents: [...state.agents, result.data] }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error adding agent:", error);
          return false;
        }
      },
      updateAgent: async (id, data) => {
        try {
          const result = await api.updateAgent(id, data);
          if (result.success) {
            set((state) => ({
              agents: state.agents.map((agent) =>
                agent.id === id ? { ...agent, ...data } : agent,
              ),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error updating agent:", error);
          return false;
        }
      },
      deleteAgent: async (id) => {
        try {
          const result = await api.deleteAgent(id);
          if (result.success) {
            set((state) => ({
              agents: state.agents.filter((agent) => agent.id !== id),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error deleting agent:", error);
          return false;
        }
      },

      // Clients
      clients: [],
      loadingClients: false,
      fetchClients: async () => {
        set({ loadingClients: true });
        try {
          const result = await api.fetchClients();
          if (result.success) {
            set({ clients: result.data || [] });
          }
        } catch (error) {
          console.error("Error fetching clients:", error);
        } finally {
          set({ loadingClients: false });
        }
      },
      addClient: async (client) => {
        try {
          const result = await api.createClient(client);
          if (result.success && result.data) {
            set((state) => ({ clients: [...state.clients, result.data] }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error adding client:", error);
          return false;
        }
      },
      updateClient: async (id, data) => {
        try {
          const result = await api.updateClient(id, data);
          if (result.success) {
            set((state) => ({
              clients: state.clients.map((client) =>
                client.id === id ? { ...client, ...data } : client,
              ),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error updating client:", error);
          return false;
        }
      },
      deleteClient: async (id) => {
        try {
          const result = await api.deleteClient(id);
          if (result.success) {
            set((state) => ({
              clients: state.clients.filter((client) => client.id !== id),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error deleting client:", error);
          return false;
        }
      },

      // Products
      products: [],
      loadingProducts: false,
      fetchProducts: async () => {
        set({ loadingProducts: true });
        try {
          const result = await api.fetchProducts();
          if (result.success) {
            set({ products: result.data || [] });
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          set({ loadingProducts: false });
        }
      },
      addProduct: async (product) => {
        try {
          const result = await api.createProduct(product);
          if (result.success && result.data) {
            set((state) => ({ products: [...state.products, result.data] }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error adding product:", error);
          return false;
        }
      },
      updateProduct: async (id, data) => {
        try {
          const result = await api.updateProduct(id, data);
          if (result.success) {
            set((state) => ({
              products: state.products.map((product) =>
                product.id === id ? { ...product, ...data } : product,
              ),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error updating product:", error);
          return false;
        }
      },
      toggleProductStatus: async (id) => {
        try {
          const result = await api.toggleProductStatus(id);
          if (result.success) {
            set((state) => ({
              products: state.products.map((product) =>
                product.id === id
                  ? { ...product, isActive: !product.isActive }
                  : product,
              ),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error toggling product status:", error);
          return false;
        }
      },

      // Transactions
      transactions: [],
      loadingTransactions: false,
      fetchTransactions: async () => {
        set({ loadingTransactions: true });
        try {
          const result = await api.fetchTransactions();
          if (result.success) {
            set({ transactions: result.data || [] });
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          set({ loadingTransactions: false });
        }
      },
      addTransaction: async (transaction) => {
        try {
          const result = await api.createTransaction(transaction);
          if (result.success && result.data) {
            set((state) => ({
              transactions: [result.data, ...state.transactions],
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error adding transaction:", error);
          return false;
        }
      },
      updateTransaction: async (id, data) => {
        try {
          const result = await api.updateTransaction(id, data);
          if (result.success) {
            set((state) => ({
              transactions: state.transactions.map((transaction) =>
                transaction.id === id
                  ? { ...transaction, ...data }
                  : transaction,
              ),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error updating transaction:", error);
          return false;
        }
      },

      // Commission Payouts
      commissionPayouts: [],
      loadingPayouts: false,
      fetchCommissionPayouts: async () => {
        set({ loadingPayouts: true });
        try {
          const result = await api.fetchCommissionPayouts();
          if (result.success) {
            set({ commissionPayouts: result.data || [] });
          }
        } catch (error) {
          console.error("Error fetching commission payouts:", error);
        } finally {
          set({ loadingPayouts: false });
        }
      },
      addCommissionPayout: async (payout) => {
        try {
          const result = await api.createCommissionPayout(payout);
          if (result.success && result.data) {
            set((state) => ({
              commissionPayouts: [result.data, ...state.commissionPayouts],
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error adding commission payout:", error);
          return false;
        }
      },
      processCommissionPayout: async (id) => {
        try {
          const result = await api.processCommissionPayout(id);
          if (result.success) {
            set((state) => ({
              commissionPayouts: state.commissionPayouts.map((payout) =>
                payout.id === id
                  ? {
                      ...payout,
                      status: "processed",
                      paymentDate: new Date().toISOString().split("T")[0],
                    }
                  : payout,
              ),
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error processing commission payout:", error);
          return false;
        }
      },

      // Settings
      settings: null,
      loadingSettings: false,
      fetchSettings: async () => {
        set({ loadingSettings: true });
        try {
          const result = await api.fetchSettings();
          if (result.success) {
            set({ settings: result.data || defaultSettings });
          } else {
            set({ settings: defaultSettings });
          }
        } catch (error) {
          console.error("Error fetching settings:", error);
          set({ settings: defaultSettings });
        } finally {
          set({ loadingSettings: false });
        }
      },
      updateSettings: async (data) => {
        try {
          const result = await api.updateSettings(data);
          if (result.success) {
            set((state) => ({
              settings: state.settings
                ? {
                    ...state.settings,
                    ...data,
                  }
                : defaultSettings,
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error updating settings:", error);
          return false;
        }
      },
    }),
    {
      name: "agent-referral-storage",
      partialize: (state) => ({
        // Only persist these fields
        settings: state.settings,
      }),
    },
  ),
);

// Initialize data loading
export const initializeStore = async () => {
  const store = useSupabaseStore.getState();

  // Check authentication first
  await store.checkAuth();

  // If authenticated, load data
  if (store.isAuthenticated) {
    await Promise.all([
      store.fetchAgents(),
      store.fetchClients(),
      store.fetchProducts(),
      store.fetchTransactions(),
      store.fetchCommissionPayouts(),
      store.fetchSettings(),
    ]);
  }
};
