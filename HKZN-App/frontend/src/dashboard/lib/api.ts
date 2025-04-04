import {
  Agent,
  Client,
  Product,
  Transaction,
  CommissionPayout,
  // Settings - Removed as no PHP API endpoints exist for settings
} from "./store"; // Assuming types are defined here or imported

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle API responses
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    // Try to get error message from response body, otherwise use status text
    let errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message || errorMessage;
    } catch (e) {
      // Ignore if response body is not JSON or empty
    }
    console.error("API Error Response:", response);
    throw new Error(errorMessage);
  }

  const result = await response.json();

  if (!result.success) {
    console.error("API Error Result:", result);
    throw new Error(result.message || "API request failed");
  }

  return result.data; // Return only the data part on success
}

// Helper to convert camelCase keys to snake_case for sending data to PHP
// function camelToSnake(obj: Record<string, any>): Record<string, any> {
//     const newObj: Record<string, any> = {};
//     for (const key in obj) {
//         if (Object.prototype.hasOwnProperty.call(obj, key)) {
//             const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
//             newObj[snakeKey] = obj[key];
//         }
//     }
//     return newObj;
// }

// --- Agents API ---

export async function fetchAgents(): Promise<Agent[]> {
  // try { // Error handling moved to store
    const response = await fetch(`${API_BASE_URL}/get_agents.php`, { credentials: 'include' }); // Include credentials for session
    const data = await handleApiResponse(response);

    // Transform from database format (snake_case) to app format (camelCase)
    const agents: Agent[] = data.map((agent: any) => ({
      id: agent.id,
      // userId: agent.user_id, // Removed: Not in Agent type
      name: agent.name,
      email: agent.email, // Added email if returned by PHP
      phone: agent.phone,
      referralCode: agent.referral_code,
      activeClients: agent.active_clients || 0,
      totalSales: agent.total_sales || 0,
      commissionRate: parseFloat(agent.commission_rate) || 0, // Ensure number
      status: agent.status,
      joinDate: agent.join_date,
    }));
    return agents;
  // } catch (error) {
  //   console.error("Error fetching agents:", error);
  //   throw error; // Re-throw error to be caught by the caller
  // }
}

export async function createAgent(agent: Omit<Agent, "id">): Promise<Agent> {
  // try { // Error handling moved to store
    // Transform to database format (snake_case)
    // Note: Agent type doesn't have email, but DB might. PHP needs to handle this.
    const dbAgent = {
        // user_id: agent.userId, // Removed: Not in Agent type input
        name: agent.name,
        email: agent.email, // Pass email if available in input type
        phone: agent.phone,
        referral_code: agent.referralCode,
        commission_rate: agent.commissionRate,
        status: agent.status,
        join_date: agent.joinDate || new Date().toISOString().split('T')[0], // Default join date
    };

    const response = await fetch(`${API_BASE_URL}/add_agent.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
      body: JSON.stringify(dbAgent),
      credentials: 'include',
    });
    const newAgentData = await handleApiResponse(response); // Assuming API returns the created agent

    // Transform response to app format (camelCase)
    // Assumes PHP returns data matching the DB schema
    const newAgent: Agent = {
        id: newAgentData.id,
        // userId: newAgentData.user_id, // Removed: Not in Agent type
        name: newAgentData.name,
        email: newAgentData.email, // Map email if returned
        phone: newAgentData.phone,
        referralCode: newAgentData.referral_code,
        activeClients: newAgentData.active_clients || 0,
        totalSales: newAgentData.total_sales || 0,
        commissionRate: parseFloat(newAgentData.commission_rate) || 0,
        status: newAgentData.status,
        joinDate: newAgentData.join_date,
    };
    return newAgent;
  // } catch (error) {
  //   console.error("Error creating agent:", error);
  //   throw error;
  // }
}

export async function updateAgent(id: string | number, agent: Partial<Agent>): Promise<void> {
  console.warn("updateAgent called, but PHP endpoint (e.g., update_agent.php) is not implemented yet.");
  // Implement fetch call to update_agent.php when available
  throw new Error("Update agent functionality not yet implemented in the backend API.");
}

export async function deleteAgent(id: string | number): Promise<void> {
  console.warn("deleteAgent called, but PHP endpoint (e.g., delete_agent.php) is not implemented yet.");
  // Implement fetch call to delete_agent.php when available
  throw new Error("Delete agent functionality not yet implemented in the backend API.");
}

// --- Clients API ---

export async function fetchClients(): Promise<Client[]> {
  // try { // Error handling moved to store
    const response = await fetch(`${API_BASE_URL}/get_clients.php`, { credentials: 'include' });
    const data = await handleApiResponse(response);

    // Transform from database format to app format
    const clients: Client[] = data.map((client: any) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address || undefined,
      referredBy: client.referred_by_agent_name || `AgentID: ${client.referred_by_agent_id}`, // Use agent name (string) - PHP needs to provide this
      product: client.product_name || `ProductID: ${client.product_id}`, // Use product name (string) - PHP needs to provide this
      status: client.status,
      joinDate: client.join_date,
    }));
    return clients;
  // } catch (error) {
  //   console.error("Error fetching clients:", error);
  //   // Check if the error message indicates the known 500 error
  //   if (error instanceof Error && error.message.includes("get_clients.php")) {
  //      console.warn("Known issue: get_clients.php might be failing on the server.");
  //      // Optionally return empty array or handle differently
  //      return [];
  //   }
  //   throw error;
  // }
}

export async function createClient(client: Omit<Client, "id">): Promise<Client> {
  // try { // Error handling moved to store
    // Transform to database format
    // Client type uses referredBy (string, agent name) and product (string, product name)
    // PHP add_client.php needs to look up agent_id and product_id from these names
    // OR frontend needs refactoring to handle IDs. Sticking to type for now.
    const dbClient = {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address || null,
        referred_by_agent_name: client.referredBy, // Send agent name
        product_name: client.product, // Send product name
        status: client.status,
        join_date: client.joinDate || new Date().toISOString().split('T')[0],
    };

    const response = await fetch(`${API_BASE_URL}/add_client.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
      body: JSON.stringify(dbClient),
      credentials: 'include',
    });
    const newClientData = await handleApiResponse(response);

    // Transform response to app format
    // Assumes PHP returns the created client with names populated
    const newClient: Client = {
        id: newClientData.id,
        name: newClientData.name,
        email: newClientData.email,
        phone: newClientData.phone,
        address: newClientData.address || undefined,
        referredBy: newClientData.referred_by_agent_name || `AgentID: ${newClientData.referred_by_agent_id}`,
        product: newClientData.product_name || `ProductID: ${newClientData.product_id}`,
        status: newClientData.status,
        joinDate: newClientData.join_date,
    };
    return newClient;
  // } catch (error) {
  //   console.error("Error creating client:", error);
  //   throw error;
  // }
}

export async function updateClient(id: string | number, client: Partial<Client>): Promise<void> {
  console.warn("updateClient called, but PHP endpoint (e.g., update_client.php) is not implemented yet.");
  // Implement fetch call to update_client.php when available
  throw new Error("Update client functionality not yet implemented in the backend API.");
}

export async function deleteClient(id: string | number): Promise<void> {
  console.warn("deleteClient called, but PHP endpoint (e.g., delete_client.php) is not implemented yet.");
   // Implement fetch call to delete_client.php when available
  throw new Error("Delete client functionality not yet implemented in the backend API.");
}


// --- Products API ---

export async function fetchProducts(): Promise<Product[]> {
  // try { // Error handling moved to store
    const response = await fetch(`${API_BASE_URL}/get_products.php`, { credentials: 'include' });
    const data = await handleApiResponse(response);

    // Transform from database format to app format
    const products: Product[] = data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price) || 0,
      commissionRate: parseFloat(product.commission_rate) || 0,
      features: typeof product.features === 'string' ? JSON.parse(product.features || '[]') : (product.features || []), // Handle JSON string or object
      isActive: !!product.is_active, // Ensure boolean
      category: product.category,
    }));
    return products;
  // } catch (error) {
  //   console.error("Error fetching products:", error);
  //   throw error;
  // }
}

export async function createProduct(product: Omit<Product, "id" | "isActive">): Promise<Product> {
  // try { // Error handling moved to store
    // Transform to database format
    const dbProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        commission_rate: product.commissionRate,
        features: JSON.stringify(product.features || []), // Ensure features is stringified JSON
        category: product.category,
    };

    const response = await fetch(`${API_BASE_URL}/add_product.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
      body: JSON.stringify(dbProduct),
      credentials: 'include',
    });
    const newProductData = await handleApiResponse(response);

    // Transform response to app format
    const newProduct: Product = {
        id: newProductData.id,
        name: newProductData.name,
        description: newProductData.description,
        price: parseFloat(newProductData.price) || 0,
        commissionRate: parseFloat(newProductData.commission_rate) || 0,
        features: typeof newProductData.features === 'string' ? JSON.parse(newProductData.features || '[]') : (newProductData.features || []),
        isActive: !!newProductData.is_active,
        category: newProductData.category,
    };
    return newProduct;
  // } catch (error) {
  //   console.error("Error creating product:", error);
  //   throw error;
  // }
}

export async function updateProduct(id: string | number, product: Partial<Product>): Promise<void> {
  console.warn("updateProduct called, but PHP endpoint (e.g., update_product.php) is not implemented yet.");
   // Implement fetch call to update_product.php when available
  throw new Error("Update product functionality not yet implemented in the backend API.");
}

export async function toggleProductStatus(id: string | number): Promise<void> {
  console.warn("toggleProductStatus called, but PHP endpoint (e.g., update_product_status.php) is not implemented yet.");
   // Implement fetch call to update_product_status.php when available
  throw new Error("Toggle product status functionality not yet implemented in the backend API.");
}


// --- Transactions API ---

export async function fetchTransactions(): Promise<Transaction[]> {
  // try { // Error handling moved to store
    const response = await fetch(`${API_BASE_URL}/get_transactions.php`, { credentials: 'include' });
    const data = await handleApiResponse(response);

    // Transform from database format to app format
    const transactions: Transaction[] = data.map((tx: any) => ({
      id: tx.id,
      date: tx.transaction_date,
      agentId: tx.agent_id,
      clientId: tx.client_id,
      productId: tx.product_id,
      agentName: tx.agent_name || `Agent ID: ${tx.agent_id}`,
      clientName: tx.client_name || `Client ID: ${tx.client_id}`,
      productName: tx.product_name || `Product ID: ${tx.product_id}`,
      amount: parseFloat(tx.amount) || 0,
      commission: parseFloat(tx.commission_amount) || 0,
      status: tx.status,
      paymentMethod: tx.payment_method,
      notes: tx.notes || undefined,
    }));
    return transactions;
  // } catch (error) {
  //   console.error("Error fetching transactions:", error);
  //   throw error;
  // }
}

export async function createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
  // try { // Error handling moved to store
    // Transform to database format - Sending IDs is more robust
    const dbTransaction = {
        transaction_date: transaction.date || new Date().toISOString().split('T')[0],
        agent_id: transaction.agentId, // Send ID
        client_id: transaction.clientId, // Send ID
        product_id: transaction.productId, // Send ID
        amount: transaction.amount,
        commission_amount: transaction.commission,
        status: transaction.status,
        payment_method: transaction.paymentMethod,
        notes: transaction.notes || null,
    };

    const response = await fetch(`${API_BASE_URL}/add_transaction.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
      body: JSON.stringify(dbTransaction),
      credentials: 'include',
    });
    const newTxData = await handleApiResponse(response);

    // Transform response to app format
     const newTransaction: Transaction = {
        id: newTxData.id,
        date: newTxData.transaction_date,
        agentId: newTxData.agent_id,
        clientId: newTxData.client_id,
        productId: newTxData.product_id,
        agentName: newTxData.agent_name || `Agent ID: ${newTxData.agent_id}`,
        clientName: newTxData.client_name || `Client ID: ${newTxData.client_id}`,
        productName: newTxData.product_name || `Product ID: ${newTxData.product_id}`,
        amount: parseFloat(newTxData.amount) || 0,
        commission: parseFloat(newTxData.commission_amount) || 0,
        status: newTxData.status,
        paymentMethod: newTxData.payment_method,
        notes: newTxData.notes || undefined,
    };
    return newTransaction;
  // } catch (error) {
  //   console.error("Error creating transaction:", error);
  //   throw error;
  // }
}

export async function updateTransaction(id: string | number, transaction: Partial<Transaction>): Promise<void> {
  console.warn("updateTransaction called, but PHP endpoint (e.g., update_transaction.php) is not implemented yet.");
  // Implement fetch call to update_transaction.php when available
  throw new Error("Update transaction functionality not yet implemented in the backend API.");
}


// --- Commission Payouts API ---

export async function fetchCommissionPayouts(): Promise<CommissionPayout[]> {
  // try { // Error handling moved to store
    const response = await fetch(`${API_BASE_URL}/get_commission_payouts.php`, { credentials: 'include' });
    const data = await handleApiResponse(response);

    // Transform from database format to app format
    const payouts: CommissionPayout[] = data.map((payout: any) => ({
      id: payout.id,
      agentId: payout.agent_id,
      agentName: payout.agent_name || `Agent ID: ${payout.agent_id}`,
      amount: parseFloat(payout.amount) || 0,
      period: payout.period,
      status: payout.status,
      paymentDate: payout.payment_date || undefined,
      transactionIds: typeof payout.transaction_ids === 'string' ? JSON.parse(payout.transaction_ids || '[]') : (payout.transaction_ids || []),
    }));
    return payouts;
  // } catch (error) {
  //   console.error("Error fetching commission payouts:", error);
  //   throw error;
  // }
}

export async function generateCommissionPayouts(period: string): Promise<{ message: string; generated_count: number }> {
    // try { // Error handling moved to store
        const response = await fetch(`${API_BASE_URL}/generate_payouts.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
            body: JSON.stringify({ period }),
            credentials: 'include',
        });
        // Need to adapt if generate_payouts returns different structure than handleApiResponse expects
        const result = await response.json(); // Parse JSON directly first
         if (!response.ok || !result.success) {
             console.error("API Error Result (Generate Payouts):", result);
             throw new Error(result.message || `HTTP error! status: ${response.status}`);
         }
        // Return the specific success message and count from this endpoint
        return { message: result.message, generated_count: result.generated_count || 0 };
    // } catch (error) {
    //     console.error("Error generating commission payouts:", error);
    //     throw error;
    // }
}

export async function processCommissionPayout(id: string | number): Promise<void> {
  console.warn("processCommissionPayout called, but PHP endpoint (e.g., process_payout.php) is not implemented yet.");
  // Implement fetch call to process_payout.php when available
  throw new Error("Process commission payout functionality not yet implemented in the backend API.");
}
