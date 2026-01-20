import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

/**
 * Convert a product ID string to a stable UUID v5 using crypto
 * This ensures kissimy-store-banne always gets the same UUID
 */
export function productIdToUUID(productId: string): string {
  try {
    // Generate UUID v5 using SHA1 hash
    const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    const hash = createHash('sha1').update(NAMESPACE + productId).digest();
    
    // Format as UUID v5
    hash[6] = (hash[6] & 0x0f) | 0x50; // version
    hash[8] = (hash[8] & 0x3f) | 0x80; // variant
    
    const uuid = [
      hash.slice(0, 4).toString('hex'),
      hash.slice(4, 6).toString('hex'),
      hash.slice(6, 8).toString('hex'),
      hash.slice(8, 10).toString('hex'),
      hash.slice(10, 16).toString('hex'),
    ].join('-');
    
    console.log(`🔑 productIdToUUID: "${productId}" -> "${uuid}"`);
    return uuid;
  } catch (error) {
    console.error('❌ productIdToUUID failed:', error);
    console.error('⚠️ Returning original productId, this will likely fail at DB level');
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
