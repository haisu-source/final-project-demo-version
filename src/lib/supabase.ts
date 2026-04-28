import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IS_DEMO_MODE_DB } from "./demo-mode";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (IS_DEMO_MODE_DB) {
    throw new Error(
      "Supabase client requested in demo mode. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable the real database."
    );
  }
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 5 } },
      }
    );
  }
  return _client;
}

// Convenience export. Accessing a property triggers client creation,
// which throws in demo mode. Always gate calls with IS_DEMO_MODE_DB.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
