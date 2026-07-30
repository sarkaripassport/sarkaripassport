import { createClient } from '@supabase/supabase-js';

// Custom fetch wrapper with 15-second timeout to prevent Next.js build / SSG from hanging indefinitely
const fetchWithTimeout = (url: RequestInfo | URL, options: RequestInit = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 15000); // 15s timeout
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
};

// Create a single supabase client for interacting with your database
export const supabaseAdmin: any = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: fetchWithTimeout as any
    }
  }
);
