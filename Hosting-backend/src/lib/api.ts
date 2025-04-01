// import { supabase } from "./supabaseClient"; // Removed Supabase import
import {
  Agent,
  Client,
  Product,
  Transaction,
  CommissionPayout,
  Settings,
} from "./store";

// Removed all Supabase-dependent API functions:
// fetchAgents, createAgent, updateAgent, deleteAgent,
// fetchClients, createClient, updateClient, deleteClient, updateAgentClientCount,
// fetchProducts, createProduct, updateProduct, toggleProductStatus,
// fetchTransactions, createTransaction, updateTransaction, updateAgentSales,
// fetchCommissionPayouts, createCommissionPayout, processCommissionPayout,
// fetchSettings, updateSettings, createDefaultSettings
// You will need to implement alternative data fetching logic here (e.g., using fetch with your PHP API)
// or remove calls to these functions from other parts of the application.
