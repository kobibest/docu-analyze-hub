
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-project-url.supabase.co";
const supabaseAnonKey = "your-anon-key";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
