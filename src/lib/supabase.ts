import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v5 as uuidv5 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

// Namespace UUID for generating stable UUIDs from product IDs
const PRODUCT_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

/**
 * Convert a product ID string to a stable UUID
 * This ensures kissimy-store-banne always gets the same UUID
 */
export function productIdToUUID(productId: string): string {
  try {
    return uuidv5(productId, PRODUCT_NAMESPACE);
  } catch {
    // Fallback: return productId as-is if uuidv5 fails
    return productId;
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase env vars are missing (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    return null;
  }
  cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  return cachedClient;
}

// Server-only: admin client using service role key (bypasses RLS). Do NOT expose to client.
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (cachedAdminClient) return cachedAdminClient;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.warn('Supabase admin key missing (SUPABASE_SERVICE_ROLE_KEY)');
    return null;
  }
  cachedAdminClient = createClient(supabaseUrl, serviceKey);
  return cachedAdminClient;
}

// Server helper: create a client impersonating a user via JWT for auth checks
export function getSupabaseClientWithAuth(token: string): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase env vars are missing');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}
