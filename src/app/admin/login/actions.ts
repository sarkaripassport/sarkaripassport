'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';

// In-memory cache for admin emails to prevent hammering Supabase Auth API
let adminEmailsCache: Set<string> | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getAdminEmails(): Promise<Set<string>> {
  const now = Date.now();
  if (adminEmailsCache && (now - lastCacheTime < CACHE_TTL)) {
    return adminEmailsCache;
  }

  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error('Error fetching admin users:', error);
      return new Set(); // Fallback to empty if error
    }

    const emails = new Set(users.map(u => u.email?.toLowerCase()).filter(Boolean) as string[]);
    adminEmailsCache = emails;
    lastCacheTime = now;
    return emails;
  } catch (err) {
    console.error('Failed to update admin emails cache', err);
    return new Set();
  }
}

export async function checkEmailIsAuthorized(email: string): Promise<boolean> {
  const emails = await getAdminEmails();
  // If cache is empty due to error, we might want to allow it to pass through to Supabase natively,
  // but for strict security, we can just return the check result.
  if (emails.size === 0) return true; // Fail-safe: let Supabase handle it if cache fails to load
  return emails.has(email.toLowerCase());
}
