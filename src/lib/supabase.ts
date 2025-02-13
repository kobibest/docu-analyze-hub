
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ntnjhnpxzsnkmiypfjjj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bmpobnB4enNua21peXBmampqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTU0MjYsImV4cCI6MjA1NDkzMTQyNn0.TFXfcZxZB1S5ye0DPl6ALHY_nNQ8k_dsD-U_Wgb1y90";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
