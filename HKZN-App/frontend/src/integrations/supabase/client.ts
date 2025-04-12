import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase URL and Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that the environment variables are set
if (!supabaseUrl) {
  throw new Error("Missing environment variable: VITE_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: VITE_SUPABASE_ANON_KEY");
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Export types if needed elsewhere, though often handled via supabase.d.ts generation
// export type { SupabaseClient } from '@supabase/supabase-js';
