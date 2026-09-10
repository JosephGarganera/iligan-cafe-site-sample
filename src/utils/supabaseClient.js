// src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Look inside standard import.meta.env first, then fallback to process.env
const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase Environmental Credentials in .env configuration layout.",
  );
}

// Single initialized database connection client exposed site-wide
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
