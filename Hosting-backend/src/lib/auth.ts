// import { supabase } from "./supabaseClient"; // Removed Supabase import
import { useStore } from "./store";
import { User } from "./store";

// Removed Supabase-dependent functions: signUp, signIn, signOut, getCurrentUser
// You will need to implement alternative authentication logic here or remove calls
// to these functions from other parts of the application.

// Helper function to generate a referral code (kept as it's independent)
function generateReferralCode(name: string): string {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${initials}${randomNum}`;
}
