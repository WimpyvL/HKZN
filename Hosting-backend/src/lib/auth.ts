import { User } from "./store"; // Assuming User type is defined in store.ts

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to handle fetch responses specifically for auth
async function handleAuthResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message || errorMessage;
    } catch (e) { /* Ignore if body isn't JSON */ }
    console.error("Auth API Error Response:", response);
    throw new Error(errorMessage);
  }

  const result = await response.json();
  if (!result.success) {
    console.error("Auth API Error Result:", result);
    throw new Error(result.message || "Authentication API request failed");
  }
  return result; // Return the full result object { success: true, user?: ..., loggedIn?: ... }
}

// --- Sign Up ---
// userData might need specific fields depending on register.php requirements
export async function signUp(email: string, password: string, userData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      // Send necessary registration data - adjust payload based on register.php needs
      body: JSON.stringify({ email, password, ...userData }),
    });
    // register.php likely returns { success: boolean, message: string }
    const result = await handleAuthResponse(response);
    return { success: result.success }; // Return only success status
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, error };
  }
}

// --- Sign In ---
export async function signIn(email: string, password: string): Promise<{ success: boolean; user: User | null; error?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
      // Crucially, ensure credentials ('include') are sent for session cookie handling
      credentials: 'include',
    });
    // login.php returns { success: boolean, message: string, user?: { id, email, role } }
    const result = await handleAuthResponse(response);
    if (result.success && result.user) {
      // Map PHP response user to frontend User type if needed
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name || 'User', // Add name if PHP returns it
      };
      return { success: true, user: user };
    } else {
      // Handle cases where login is successful according to PHP but user data is missing (shouldn't happen with current login.php)
      throw new Error(result.message || 'Login successful but user data missing.');
    }
  } catch (error) {
    console.error("Error signing in:", error);
    return { success: false, user: null, error };
  }
}

// --- Sign Out ---
export async function signOut(): Promise<{ success: boolean; error?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/logout.php`, {
      method: 'POST', // Use POST or GET depending on logout.php implementation
      headers: { 'Accept': 'application/json' },
      credentials: 'include', // Send session cookie
    });
    // logout.php likely returns { success: boolean, message: string }
    const result = await handleAuthResponse(response);
    return { success: result.success };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
}

// --- Check Current Authentication Status ---
export async function getCurrentUser(): Promise<{ success: boolean; user: User | null; error?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/check_auth.php`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include', // Send session cookie
    });
     // check_auth.php returns { success: true, loggedIn: boolean, user?: { id, email, role } }
    const result = await handleAuthResponse(response);
    if (result.loggedIn && result.user) {
       // Map PHP response user to frontend User type if needed
       const user: User = {
         id: result.user.id,
         email: result.user.email,
         role: result.user.role,
         name: result.user.name || 'User', // Add name if PHP returns it
       };
      return { success: true, user: user };
    } else {
      return { success: true, user: null }; // Successfully checked, but not logged in
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    // If the check itself fails (e.g., network error), return success: false
    return { success: false, user: null, error };
  }
}

// Helper function (if still needed, otherwise remove)
// function generateReferralCode(name: string): string {
//   const initials = name
//     .split(" ")
//     .map((part) => part[0])
//     .join("")
//     .toUpperCase();
//   const randomNum = Math.floor(1000 + Math.random() * 9000);
//   return `${initials}${randomNum}`;
// }
