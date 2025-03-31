import { supabase } from "./supabaseClient";
import {
  Agent,
  Client,
  Product,
  Transaction,
  CommissionPayout,
  Settings,
} from "./store";

// Agents API
export async function fetchAgents() {
  try {
    const { data, error } = await supabase.from("agents").select("*");

    if (error) throw error;

    // Transform from database format to app format
    const agents: Agent[] = data.map((agent) => ({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      referralCode: agent.referral_code,
      activeClients: agent.active_clients || 0,
      totalSales: agent.total_sales || 0,
      commissionRate: agent.commission_rate,
      status: agent.status,
      joinDate: agent.join_date,
    }));

    return { success: true, data: agents };
  } catch (error) {
    console.error("Error fetching agents:", error);
    return { success: false, error };
  }
}

export async function createAgent(agent: Omit<Agent, "id">) {
  try {
    const { data, error } = await supabase
      .from("agents")
      .insert({
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        referral_code: agent.referralCode,
        commission_rate: agent.commissionRate,
        status: agent.status,
        join_date: agent.joinDate,
        active_clients: agent.activeClients || 0,
        total_sales: agent.totalSales || 0,
      })
      .select();

    if (error) throw error;

    // Transform from database format to app format
    const newAgent: Agent = {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      phone: data[0].phone,
      referralCode: data[0].referral_code,
      activeClients: data[0].active_clients || 0,
      totalSales: data[0].total_sales || 0,
      commissionRate: data[0].commission_rate,
      status: data[0].status,
      joinDate: data[0].join_date,
    };

    return { success: true, data: newAgent };
  } catch (error) {
    console.error("Error creating agent:", error);
    return { success: false, error };
  }
}

export async function updateAgent(id: string, agent: Partial<Agent>) {
  try {
    // Transform to database format
    const dbAgent: any = {};
    if (agent.name) dbAgent.name = agent.name;
    if (agent.email) dbAgent.email = agent.email;
    if (agent.phone) dbAgent.phone = agent.phone;
    if (agent.referralCode) dbAgent.referral_code = agent.referralCode;
    if (agent.commissionRate !== undefined)
      dbAgent.commission_rate = agent.commissionRate;
    if (agent.status) dbAgent.status = agent.status;
    if (agent.activeClients !== undefined)
      dbAgent.active_clients = agent.activeClients;
    if (agent.totalSales !== undefined) dbAgent.total_sales = agent.totalSales;

    const { error } = await supabase
      .from("agents")
      .update(dbAgent)
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating agent:", error);
    return { success: false, error };
  }
}

export async function deleteAgent(id: string) {
  try {
    const { error } = await supabase.from("agents").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting agent:", error);
    return { success: false, error };
  }
}

// Clients API
export async function fetchClients() {
  try {
    const { data, error } = await supabase.from("clients").select("*");

    if (error) throw error;

    // Transform from database format to app format
    const clients: Client[] = data.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      referredBy: client.referred_by,
      product: client.product,
      status: client.status,
      joinDate: client.join_date,
      address: client.address || undefined,
    }));

    return { success: true, data: clients };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return { success: false, error };
  }
}

export async function createClient(client: Omit<Client, "id">) {
  try {
    const { data, error } = await supabase
      .from("clients")
      .insert({
        name: client.name,
        email: client.email,
        phone: client.phone,
        referred_by: client.referredBy,
        product: client.product,
        status: client.status,
        join_date: client.joinDate,
        address: client.address || null,
      })
      .select();

    if (error) throw error;

    // Transform from database format to app format
    const newClient: Client = {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      phone: data[0].phone,
      referredBy: data[0].referred_by,
      product: data[0].product,
      status: data[0].status,
      joinDate: data[0].join_date,
      address: data[0].address || undefined,
    };

    // Update agent's active clients count
    await updateAgentClientCount(client.referredBy);

    return { success: true, data: newClient };
  } catch (error) {
    console.error("Error creating client:", error);
    return { success: false, error };
  }
}

export async function updateClient(id: string, client: Partial<Client>) {
  try {
    // Transform to database format
    const dbClient: any = {};
    if (client.name) dbClient.name = client.name;
    if (client.email) dbClient.email = client.email;
    if (client.phone) dbClient.phone = client.phone;
    if (client.referredBy) dbClient.referred_by = client.referredBy;
    if (client.product) dbClient.product = client.product;
    if (client.status) dbClient.status = client.status;
    if (client.address !== undefined) dbClient.address = client.address;

    const { error } = await supabase
      .from("clients")
      .update(dbClient)
      .eq("id", id);

    if (error) throw error;

    // If status changed, update agent's active clients count
    if (client.status) {
      const { data } = await supabase
        .from("clients")
        .select("referred_by")
        .eq("id", id)
        .single();

      if (data) {
        await updateAgentClientCount(data.referred_by);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false, error };
  }
}

export async function deleteClient(id: string) {
  try {
    // Get the client's referredBy before deleting
    const { data } = await supabase
      .from("clients")
      .select("referred_by")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) throw error;

    // Update agent's active clients count
    if (data) {
      await updateAgentClientCount(data.referred_by);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false, error };
  }
}

// Helper function to update agent's active client count
async function updateAgentClientCount(agentName: string) {
  try {
    // Get agent ID from name
    const { data: agentData } = await supabase
      .from("agents")
      .select("id")
      .eq("name", agentName)
      .single();

    if (!agentData) return;

    // Count active clients for this agent
    const { data, error } = await supabase
      .from("clients")
      .select("id", { count: "exact" })
      .eq("referred_by", agentName)
      .eq("status", "active");

    if (error) throw error;

    // Update agent's active_clients count
    await supabase
      .from("agents")
      .update({ active_clients: data?.length || 0 })
      .eq("id", agentData.id);
  } catch (error) {
    console.error("Error updating agent client count:", error);
  }
}

// Products API
export async function fetchProducts() {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) throw error;

    // Transform from database format to app format
    const products: Product[] = data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      commissionRate: product.commission_rate,
      features: product.features,
      isActive: product.is_active,
      category: product.category,
    }));

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error };
  }
}

export async function createProduct(product: Omit<Product, "id" | "isActive">) {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        commission_rate: product.commissionRate,
        features: product.features,
        is_active: true,
        category: product.category,
      })
      .select();

    if (error) throw error;

    // Transform from database format to app format
    const newProduct: Product = {
      id: data[0].id,
      name: data[0].name,
      description: data[0].description,
      price: data[0].price,
      commissionRate: data[0].commission_rate,
      features: data[0].features,
      isActive: data[0].is_active,
      category: data[0].category,
    };

    return { success: true, data: newProduct };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error };
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    // Transform to database format
    const dbProduct: any = {};
    if (product.name) dbProduct.name = product.name;
    if (product.description) dbProduct.description = product.description;
    if (product.price !== undefined) dbProduct.price = product.price;
    if (product.commissionRate !== undefined)
      dbProduct.commission_rate = product.commissionRate;
    if (product.features) dbProduct.features = product.features;
    if (product.isActive !== undefined) dbProduct.is_active = product.isActive;
    if (product.category) dbProduct.category = product.category;

    const { error } = await supabase
      .from("products")
      .update(dbProduct)
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error };
  }
}

export async function toggleProductStatus(id: string) {
  try {
    // Get current status
    const { data, error: fetchError } = await supabase
      .from("products")
      .select("is_active")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle status
    const { error } = await supabase
      .from("products")
      .update({ is_active: !data.is_active })
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error toggling product status:", error);
    return { success: false, error };
  }
}

// Transactions API
export async function fetchTransactions() {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    // Transform from database format to app format
    const transactions: Transaction[] = data.map((transaction) => ({
      id: transaction.id,
      date: transaction.date,
      agentName: transaction.agent_name,
      clientName: transaction.client_name,
      product: transaction.product,
      amount: transaction.amount,
      commission: transaction.commission,
      status: transaction.status,
      paymentMethod: transaction.payment_method,
    }));

    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, error };
  }
}

export async function createTransaction(transaction: Omit<Transaction, "id">) {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        date: transaction.date,
        agent_name: transaction.agentName,
        client_name: transaction.clientName,
        product: transaction.product,
        amount: transaction.amount,
        commission: transaction.commission,
        status: transaction.status,
        payment_method: transaction.paymentMethod,
      })
      .select();

    if (error) throw error;

    // Transform from database format to app format
    const newTransaction: Transaction = {
      id: data[0].id,
      date: data[0].date,
      agentName: data[0].agent_name,
      clientName: data[0].client_name,
      product: data[0].product,
      amount: data[0].amount,
      commission: data[0].commission,
      status: data[0].status,
      paymentMethod: data[0].payment_method,
    };

    // Update agent's total sales if transaction is completed
    if (transaction.status === "completed") {
      await updateAgentSales(transaction.agentName, transaction.amount);
    }

    return { success: true, data: newTransaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error };
  }
}

export async function updateTransaction(
  id: string,
  transaction: Partial<Transaction>,
) {
  try {
    // Get original transaction to check status change
    const { data: originalTransaction } = await supabase
      .from("transactions")
      .select("status, agent_name, amount")
      .eq("id", id)
      .single();

    // Transform to database format
    const dbTransaction: any = {};
    if (transaction.date) dbTransaction.date = transaction.date;
    if (transaction.agentName) dbTransaction.agent_name = transaction.agentName;
    if (transaction.clientName)
      dbTransaction.client_name = transaction.clientName;
    if (transaction.product) dbTransaction.product = transaction.product;
    if (transaction.amount !== undefined)
      dbTransaction.amount = transaction.amount;
    if (transaction.commission !== undefined)
      dbTransaction.commission = transaction.commission;
    if (transaction.status) dbTransaction.status = transaction.status;
    if (transaction.paymentMethod)
      dbTransaction.payment_method = transaction.paymentMethod;

    const { error } = await supabase
      .from("transactions")
      .update(dbTransaction)
      .eq("id", id);

    if (error) throw error;

    // If status changed to completed, update agent's total sales
    if (
      originalTransaction &&
      transaction.status === "completed" &&
      originalTransaction.status !== "completed"
    ) {
      const amount = transaction.amount || originalTransaction.amount;
      await updateAgentSales(
        transaction.agentName || originalTransaction.agent_name,
        amount,
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error };
  }
}

// Helper function to update agent's total sales
async function updateAgentSales(agentName: string, amount: number) {
  try {
    // Get agent
    const { data: agentData } = await supabase
      .from("agents")
      .select("id, total_sales")
      .eq("name", agentName)
      .single();

    if (!agentData) return;

    // Update agent's total_sales
    const newTotalSales = (agentData.total_sales || 0) + amount;
    await supabase
      .from("agents")
      .update({ total_sales: newTotalSales })
      .eq("id", agentData.id);
  } catch (error) {
    console.error("Error updating agent sales:", error);
  }
}

// Commission Payouts API
export async function fetchCommissionPayouts() {
  try {
    const { data, error } = await supabase
      .from("commission_payouts")
      .select("*")
      .order("period", { ascending: false });

    if (error) throw error;

    // Transform from database format to app format
    const payouts: CommissionPayout[] = data.map((payout) => ({
      id: payout.id,
      agentId: payout.agent_id,
      agentName: payout.agent_name,
      amount: payout.amount,
      period: payout.period,
      status: payout.status,
      paymentDate: payout.payment_date || undefined,
    }));

    return { success: true, data: payouts };
  } catch (error) {
    console.error("Error fetching commission payouts:", error);
    return { success: false, error };
  }
}

export async function createCommissionPayout(
  payout: Omit<CommissionPayout, "id">,
) {
  try {
    const { data, error } = await supabase
      .from("commission_payouts")
      .insert({
        agent_id: payout.agentId,
        agent_name: payout.agentName,
        amount: payout.amount,
        period: payout.period,
        status: payout.status,
        payment_date: payout.paymentDate || null,
      })
      .select();

    if (error) throw error;

    // Transform from database format to app format
    const newPayout: CommissionPayout = {
      id: data[0].id,
      agentId: data[0].agent_id,
      agentName: data[0].agent_name,
      amount: data[0].amount,
      period: data[0].period,
      status: data[0].status,
      paymentDate: data[0].payment_date || undefined,
    };

    return { success: true, data: newPayout };
  } catch (error) {
    console.error("Error creating commission payout:", error);
    return { success: false, error };
  }
}

export async function processCommissionPayout(id: string) {
  try {
    const paymentDate = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("commission_payouts")
      .update({
        status: "processed",
        payment_date: paymentDate,
      })
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error processing commission payout:", error);
    return { success: false, error };
  }
}

// Settings API
export async function fetchSettings() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      // If no settings exist, create default settings
      if (error.code === "PGRST116") {
        return await createDefaultSettings();
      }
      throw error;
    }

    // Transform from database format to app format
    const settings: Settings = {
      general: {
        companyName: data.company_name,
        adminEmail: data.admin_email,
        timezone: data.timezone,
        dateFormat: data.date_format,
        darkMode: data.dark_mode,
      },
      commission: {
        defaultRate: data.default_commission_rate,
        minRate: data.min_commission_rate,
        maxRate: data.max_commission_rate,
        payoutThreshold: data.payout_threshold,
        autoApprove: data.auto_approve,
        tieredRates: data.tiered_rates,
      },
      notifications: {
        email: data.email_notifications,
        newClient: data.new_client_notifications,
        commission: data.commission_notifications,
        agentActivity: data.agent_activity_notifications,
        notificationEmail: data.notification_email,
      },
    };

    return { success: true, data: settings };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { success: false, error };
  }
}

export async function updateSettings(settings: Partial<Settings>) {
  try {
    // Transform to database format
    const dbSettings: any = {};

    if (settings.general) {
      if (settings.general.companyName !== undefined)
        dbSettings.company_name = settings.general.companyName;
      if (settings.general.adminEmail !== undefined)
        dbSettings.admin_email = settings.general.adminEmail;
      if (settings.general.timezone !== undefined)
        dbSettings.timezone = settings.general.timezone;
      if (settings.general.dateFormat !== undefined)
        dbSettings.date_format = settings.general.dateFormat;
      if (settings.general.darkMode !== undefined)
        dbSettings.dark_mode = settings.general.darkMode;
    }

    if (settings.commission) {
      if (settings.commission.defaultRate !== undefined)
        dbSettings.default_commission_rate = settings.commission.defaultRate;
      if (settings.commission.minRate !== undefined)
        dbSettings.min_commission_rate = settings.commission.minRate;
      if (settings.commission.maxRate !== undefined)
        dbSettings.max_commission_rate = settings.commission.maxRate;
      if (settings.commission.payoutThreshold !== undefined)
        dbSettings.payout_threshold = settings.commission.payoutThreshold;
      if (settings.commission.autoApprove !== undefined)
        dbSettings.auto_approve = settings.commission.autoApprove;
      if (settings.commission.tieredRates !== undefined)
        dbSettings.tiered_rates = settings.commission.tieredRates;
    }

    if (settings.notifications) {
      if (settings.notifications.email !== undefined)
        dbSettings.email_notifications = settings.notifications.email;
      if (settings.notifications.newClient !== undefined)
        dbSettings.new_client_notifications = settings.notifications.newClient;
      if (settings.notifications.commission !== undefined)
        dbSettings.commission_notifications = settings.notifications.commission;
      if (settings.notifications.agentActivity !== undefined)
        dbSettings.agent_activity_notifications =
          settings.notifications.agentActivity;
      if (settings.notifications.notificationEmail !== undefined)
        dbSettings.notification_email =
          settings.notifications.notificationEmail;
    }

    // Check if settings exist
    const { data } = await supabase.from("settings").select("id");

    if (data && data.length > 0) {
      // Update existing settings
      const { error } = await supabase
        .from("settings")
        .update(dbSettings)
        .eq("id", data[0].id);

      if (error) throw error;
    } else {
      // Create new settings
      await createDefaultSettings(settings);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error };
  }
}

// Helper function to create default settings
async function createDefaultSettings(customSettings?: Partial<Settings>) {
  try {
    const defaultSettings = {
      company_name:
        customSettings?.general?.companyName || "Agent Referrals Inc.",
      admin_email:
        customSettings?.general?.adminEmail || "admin@agentreferrals.com",
      timezone: customSettings?.general?.timezone || "America/New_York",
      date_format: customSettings?.general?.dateFormat || "MM/DD/YYYY",
      dark_mode: customSettings?.general?.darkMode || false,
      default_commission_rate: customSettings?.commission?.defaultRate || 5.0,
      min_commission_rate: customSettings?.commission?.minRate || 2.0,
      max_commission_rate: customSettings?.commission?.maxRate || 10.0,
      payout_threshold: customSettings?.commission?.payoutThreshold || 100,
      auto_approve: customSettings?.commission?.autoApprove || true,
      tiered_rates: customSettings?.commission?.tieredRates || false,
      email_notifications: customSettings?.notifications?.email || true,
      new_client_notifications:
        customSettings?.notifications?.newClient || true,
      commission_notifications:
        customSettings?.notifications?.commission || true,
      agent_activity_notifications:
        customSettings?.notifications?.agentActivity || false,
      notification_email:
        customSettings?.notifications?.notificationEmail ||
        "notifications@agentreferrals.com",
    };

    const { data, error } = await supabase
      .from("settings")
      .insert(defaultSettings)
      .select();

    if (error) throw error;

    // Transform to app format
    const settings: Settings = {
      general: {
        companyName: data[0].company_name,
        adminEmail: data[0].admin_email,
        timezone: data[0].timezone,
        dateFormat: data[0].date_format,
        darkMode: data[0].dark_mode,
      },
      commission: {
        defaultRate: data[0].default_commission_rate,
        minRate: data[0].min_commission_rate,
        maxRate: data[0].max_commission_rate,
        payoutThreshold: data[0].payout_threshold,
        autoApprove: data[0].auto_approve,
        tieredRates: data[0].tiered_rates,
      },
      notifications: {
        email: data[0].email_notifications,
        newClient: data[0].new_client_notifications,
        commission: data[0].commission_notifications,
        agentActivity: data[0].agent_activity_notifications,
        notificationEmail: data[0].notification_email,
      },
    };

    return { success: true, data: settings };
  } catch (error) {
    console.error("Error creating default settings:", error);
    return { success: false, error };
  }
}
