import {
  Agent,
  Client,
  Product,
  Transaction,
  CommissionPayout,
  // Settings - Removed as no PHP API endpoints exist for settings
} from "./store";

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
function camelToSnake(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            newObj[snakeKey] = obj[key];
        }
    }
    return newObj;
}

// --- Agents API ---

export async function fetchAgents(): Promise<Agent[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/get_agents.php`);
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
      // email is missing in agents table schema from knowledge base, add if available
    }));
    return agents;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error; // Re-throw error to be caught by the caller
  }
}

export async function createAgent(agent: Omit<Agent, "id">): Promise<Agent> {
  try {
    // Transform to database format (snake_case)
    // Note: Ensure the PHP script handles password hashing and user creation if needed
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
        // active_clients and total_sales are usually calculated, not set directly
    };

    const response = await fetch(`${API_BASE_URL}/add_agent.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dbAgent),
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
  } catch (error) {
    console.error("Error creating agent:", error);
    throw error;
  }
}

export async function updateAgent(id: string | number, agent: Partial<Agent>): Promise<void> {
  console.warn("updateAgent called, but PHP endpoint (e.g., update_agent.php) is not implemented yet.");
  // try {
  //   const dbAgent = camelToSnake(agent); // Convert only provided fields
  //   const response = await fetch(`${API_BASE_URL}/update_agent.php`, { // Assumes update_agent.php exists
  //     method: "POST", // Or PUT
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id, ...dbAgent }),
  //   });
  //   await handleApiResponse(response);
  // } catch (error) {
  //   console.error("Error updating agent:", error);
  //   throw error;
  // }
  throw new Error("Update agent functionality not yet implemented in the backend API.");
}

export async function deleteAgent(id: string | number): Promise<void> {
  console.warn("deleteAgent called, but PHP endpoint (e.g., delete_agent.php) is not implemented yet.");
  // try {
  //   const response = await fetch(`${API_BASE_URL}/delete_agent.php`, { // Assumes delete_agent.php exists
  //     method: "POST", // Or DELETE
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id }),
  //   });
  //   await handleApiResponse(response);
  // } catch (error) {
  //   console.error("Error deleting agent:", error);
  //   throw error;
  // }
  throw new Error("Delete agent functionality not yet implemented in the backend API.");
}

// --- Clients API ---

export async function fetchClients(): Promise<Client[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/get_clients.php`);
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
      // notes: client.notes || undefined, // Removed: Not in Client type
    }));
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    // Check if the error message indicates the known 500 error
    if (error instanceof Error && error.message.includes("get_clients.php")) {
       console.warn("Known issue: get_clients.php might be failing on the server.");
       // Optionally return empty array or handle differently
       return [];
    }
    throw error;
  }
}

export async function createClient(client: Omit<Client, "id">): Promise<Client> {
  try {
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
        // notes: client.notes || null, // Removed: Not in Client type input
    };

    const response = await fetch(`${API_BASE_URL}/add_client.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dbClient),
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
        // notes: newClientData.notes || undefined, // Removed: Not in Client type
    };
    // Note: The PHP script should handle updating the agent's client count
    return newClient;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

export async function updateClient(id: string | number, client: Partial<Client>): Promise<void> {
  console.warn("updateClient called, but PHP endpoint (e.g., update_client.php) is not implemented yet.");
  // try {
  //   const dbClient = camelToSnake(client);
  //   const response = await fetch(`${API_BASE_URL}/update_client.php`, { // Assumes update_client.php exists
  //     method: "POST", // Or PUT
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id, ...dbClient }),
  //   });
  //   await handleApiResponse(response);
  //   // Note: PHP script should handle updating agent count if status changes
  // } catch (error) {
  //   console.error("Error updating client:", error);
  //   throw error;
  // }
  throw new Error("Update client functionality not yet implemented in the backend API.");
}

export async function deleteClient(id: string | number): Promise<void> {
  console.warn("deleteClient called, but PHP endpoint (e.g., delete_client.php) is not implemented yet.");
  // try {
  //   const response = await fetch(`${API_BASE_URL}/delete_client.php`, { // Assumes delete_client.php exists
  //     method: "POST", // Or DELETE
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id }),
  //   });
  //   await handleApiResponse(response);
  //    // Note: PHP script should handle updating agent count
  // } catch (error) {
  //   console.error("Error deleting client:", error);
  //   throw error;
  // }
  throw new Error("Delete client functionality not yet implemented in the backend API.");
}


// --- Products API ---

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/get_products.php`);
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
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// Note: createProduct in the old code had Omit<Product, "id" | "isActive">
// Assuming isActive defaults to true on creation in the backend
export async function createProduct(product: Omit<Product, "id" | "isActive">): Promise<Product> {
  try {
    // Transform to database format
    const dbProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        commission_rate: product.commissionRate,
        features: JSON.stringify(product.features || []), // Ensure features is stringified JSON
        category: product.category,
        // is_active is likely handled by the backend, defaulting to true
    };

    const response = await fetch(`${API_BASE_URL}/add_product.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dbProduct),
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
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(id: string | number, product: Partial<Product>): Promise<void> {
  console.warn("updateProduct called, but PHP endpoint (e.g., update_product.php) is not implemented yet.");
  // try {
  //   // Ensure features are stringified if present
  //   const productToSend = { ...product };
  //   if (productToSend.features) {
  //       productToSend.features = JSON.stringify(productToSend.features);
  //   }
  //   const dbProduct = camelToSnake(productToSend);

  //   const response = await fetch(`${API_BASE_URL}/update_product.php`, { // Assumes update_product.php exists
  //     method: "POST", // Or PUT
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id, ...dbProduct }),
  //   });
  //   await handleApiResponse(response);
  // } catch (error) {
  //   console.error("Error updating product:", error);
  //   throw error;
  // }
  throw new Error("Update product functionality not yet implemented in the backend API.");
}

// toggleProductStatus requires a specific backend endpoint
export async function toggleProductStatus(id: string | number): Promise<void> {
  console.warn("toggleProductStatus called, but PHP endpoint (e.g., update_product_status.php) is not implemented yet.");
  // try {
  //   const response = await fetch(`${API_BASE_URL}/update_product_status.php`, { // Assumes endpoint exists
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id }),
  //   });
  //   await handleApiResponse(response);
  // } catch (error) {
  //   console.error("Error toggling product status:", error);
  //   throw error;
  // }
  throw new Error("Toggle product status functionality not yet implemented in the backend API.");
}


// --- Transactions API ---

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/get_transactions.php`);
    const data = await handleApiResponse(response);

    // Transform from database format to app format
    // Assumes PHP returns necessary fields like agent_name, client_name, product_name
    const transactions: Transaction[] = data.map((tx: any) => ({
      id: tx.id,
      date: tx.transaction_date, // Match DB schema
      // agentId: tx.agent_id, // Use names per Transaction type
      // clientId: tx.client_id,
      // productId: tx.product_id,
      agentName: tx.agent_name || `Agent ID: ${tx.agent_id}`, // PHP needs to return agent_name
      clientName: tx.client_name || `Client ID: ${tx.client_id}`, // PHP needs to return client_name
      product: tx.product_name || `Product ID: ${tx.product_id}`, // PHP needs to return product_name (maps to 'product' field in type)
      amount: parseFloat(tx.amount) || 0,
      commission: parseFloat(tx.commission_amount) || 0, // Match DB schema & 'commission' field in type
      status: tx.status,
      paymentMethod: tx.payment_method,
      // notes: tx.notes || undefined, // Removed: Not in Transaction type
    }));
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

// Transaction type uses names, but DB uses IDs. PHP needs to handle insertion based on IDs.
// Frontend might need to pass IDs instead of names, or PHP needs to look up IDs from names.
// Adjusting frontend type or this function might be needed based on PHP implementation.
export async function createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
  try {
    // Transform to database format - Sending names per Transaction type
    // PHP add_transaction.php needs to look up IDs from these names
    const dbTransaction = {
        transaction_date: transaction.date || new Date().toISOString().split('T')[0],
        agent_name: transaction.agentName, // Send name
        client_name: transaction.clientName, // Send name
        product_name: transaction.product, // Send name (maps to 'product' field in type)
        amount: transaction.amount,
        commission_amount: transaction.commission, // Maps to 'commission' field in type
        status: transaction.status,
        payment_method: transaction.paymentMethod,
        // notes: transaction.notes || null, // Removed: Not in Transaction type input
    };

    const response = await fetch(`${API_BASE_URL}/add_transaction.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dbTransaction),
    });
    const newTxData = await handleApiResponse(response);

    // Transform response to app format
    // Assumes PHP returns the newly created transaction with names populated
     const newTransaction: Transaction = {
        id: newTxData.id,
        date: newTxData.transaction_date,
        // agentId: newTxData.agent_id, // Use names per type
        // clientId: newTxData.client_id,
        // productId: newTxData.product_id,
        agentName: newTxData.agent_name || `Agent ID: ${newTxData.agent_id}`,
        clientName: newTxData.client_name || `Client ID: ${newTxData.client_id}`,
        product: newTxData.product_name || `Product ID: ${newTxData.product_id}`, // Maps to 'product' field
        amount: parseFloat(newTxData.amount) || 0,
        commission: parseFloat(newTxData.commission_amount) || 0, // Maps to 'commission' field
        status: newTxData.status,
        paymentMethod: newTxData.payment_method,
        // notes: newTxData.notes || undefined, // Removed: Not in Transaction type
    };
    // Note: PHP script should handle updating agent's total sales if status is 'completed'
    return newTransaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function updateTransaction(id: string | number, transaction: Partial<Transaction>): Promise<void> {
  console.warn("updateTransaction called, but PHP endpoint (e.g., update_transaction.php) is not implemented yet.");
  // try {
  //   // Convert relevant fields to snake_case
  //   const dbTransaction: Record<string, any> = {};
  //   if (transaction.date) dbTransaction.transaction_date = transaction.date;
  //   if (transaction.agentId) dbTransaction.agent_id = transaction.agentId;
  //   // ... map other fields ...
  //   if (transaction.commission) dbTransaction.commission_amount = transaction.commission;
  //   if (transaction.status) dbTransaction.status = transaction.status;
  //   // ...

  //   const response = await fetch(`${API_BASE_URL}/update_transaction.php`, { // Assumes update_transaction.php exists
  //     method: "POST", // Or PUT
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id, ...dbTransaction }),
  //   });
  //   await handleApiResponse(response);
  //   // Note: PHP script should handle updating agent sales if status changes
  // } catch (error) {
  //   console.error("Error updating transaction:", error);
  //   throw error;
  // }
  throw new Error("Update transaction functionality not yet implemented in the backend API.");
}


// --- Commission Payouts API ---

export async function fetchCommissionPayouts(): Promise<CommissionPayout[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/get_commission_payouts.php`);
    const data = await handleApiResponse(response);

    // Transform from database format to app format
    // Assumes PHP returns agent_name
    const payouts: CommissionPayout[] = data.map((payout: any) => ({
      id: payout.id,
      agentId: payout.agent_id,
      agentName: payout.agent_name || `Agent ID: ${payout.agent_id}`, // Placeholder
      amount: parseFloat(payout.amount) || 0,
      period: payout.period,
      status: payout.status,
      paymentDate: payout.payment_date || undefined,
      // transactionIds: typeof payout.transaction_ids === 'string' ? JSON.parse(payout.transaction_ids || '[]') : (payout.transaction_ids || []), // Removed: Not in CommissionPayout type
    }));
    return payouts;
  } catch (error) {
    console.error("Error fetching commission payouts:", error);
    throw error;
  }
}

// Function to trigger the generation of payouts on the backend
export async function generateCommissionPayouts(period: string): Promise<{ message: string; generated_count: number }> {
    try {
        const response = await fetch(`${API_BASE_URL}/generate_payouts.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ period }), // Send the period (e.g., "YYYY-MM")
        });
        // Use handleApiResponse which expects 'data' field for success
        // Need to adapt if generate_payouts returns different structure
        const result = await response.json(); // Parse JSON directly first
         if (!response.ok || !result.success) {
             console.error("API Error Result (Generate Payouts):", result);
             throw new Error(result.message || `HTTP error! status: ${response.status}`);
         }
        // Return the specific success message and count from this endpoint
        return { message: result.message, generated_count: result.generated_count || 0 };
    } catch (error) {
        console.error("Error generating commission payouts:", error);
        throw error;
    }
}


// createCommissionPayout - No direct add_commission_payout.php exists, generation is done via generate_payouts.php
// export async function createCommissionPayout(payout: Omit<CommissionPayout, "id">): Promise<CommissionPayout> { ... }


// processCommissionPayout requires a specific backend endpoint
export async function processCommissionPayout(id: string | number): Promise<void> {
  console.warn("processCommissionPayout called, but PHP endpoint (e.g., process_payout.php) is not implemented yet.");
  // try {
  //   const response = await fetch(`${API_BASE_URL}/process_payout.php`, { // Assumes endpoint exists
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id }),
  //   });
  //   await handleApiResponse(response);
  // } catch (error) {
  //   console.error("Error processing commission payout:", error);
  //   throw error;
  // }
  throw new Error("Process commission payout functionality not yet implemented in the backend API.");
}

// --- Settings API ---
// Removed - No corresponding PHP endpoints identified.
// export async function fetchSettings(): Promise<Settings> { ... }
// export async function updateSettings(settings: Partial<Settings>): Promise<void> { ... }
