import { supabase } from "./supabaseClient";
import { useStore } from "./store";
import { User } from "./store";

export async function signUp(email: string, password: string, userData: any) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.isAgent ? "agent" : "admin",
          phone: userData.phone || null,
        },
      },
    });

    if (error) throw error;

    // If user is an agent, create agent record
    if (userData.isAgent && data.user) {
      const { error: agentError } = await supabase.from("agents").insert({
        id: data.user.id,
        name: userData.name,
        email: email,
        phone: userData.phone || "",
        referral_code: generateReferralCode(userData.name),
        commission_rate: 0.05,
        status: "pending",
        join_date: new Date().toISOString().split("T")[0],
      });

      if (agentError) throw agentError;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile data
    if (data.user) {
      // Use the user data directly from the signIn response
      const role = data.user.user_metadata?.role || "agent";
      const name = data.user.user_metadata?.name || "User";

      const user: User = {
        id: data.user.id,
        name: name,
        email: data.user.email || "",
        role: role as "admin" | "agent",
      };

      return { success: true, user };
    }

    return { success: false, error: "User data not found" };
  } catch (error) {
    console.error("Error signing in:", error);
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (data && data.user) {
      const role = data.user.user_metadata.role || "agent";
      const name = data.user.user_metadata.name || "User";

      const user: User = {
        id: data.user.id,
        name: name,
        email: data.user.email || "",
        role: role as "admin" | "agent",
      };

      return { success: true, user };
    }

    return { success: false, error: "User not found" };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { success: false, error };
  }
}

// Helper function to generate a referral code
function generateReferralCode(name: string): string {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${initials}${randomNum}`;
}
