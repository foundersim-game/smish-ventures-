import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const DEFAULT_SUPABASE_URL = "https://ddbodqpkojrskspxjdnk.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYm9kcXBrb2pyc2tzcHhqZG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODI2NjEsImV4cCI6MjEwNjM1ODY2MX0.3-eswymEh3THbEgqVm6BJn1nIE_qYnqJ5PIJTxWaYeI";

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return true;
}

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  try {
    supabaseInstance = createClient(url, anonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    // Return fallback client
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
  }
}

