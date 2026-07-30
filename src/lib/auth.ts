import { createClient } from '@/lib/supabase/server';
import { checkEmailIsAuthorized } from '@/app/admin/login/actions';
import { NextResponse } from 'next/server';

/**
 * Checks if the current authenticated user is an authorized Admin.
 * Returns the user object if authorized, or null if unauthorized.
 */
export async function getAuthorizedAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return null;
    }

    const isAuthorized = await checkEmailIsAuthorized(user.email);
    if (!isAuthorized) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Auth verification error:", err);
    return null;
  }
}

/**
 * Throws an Error if the current user is not an authorized Admin.
 * Use this at the start of Server Actions.
 */
export async function requireAdmin() {
  const adminUser = await getAuthorizedAdmin();
  if (!adminUser) {
    throw new Error("Unauthorized: Admin access required.");
  }
  return adminUser;
}

/**
 * API route helper: Returns a 401 NextResponse if the current user is not an authorized Admin.
 * Returns null if the user IS an authorized Admin.
 */
export async function checkApiAdminAuth() {
  const adminUser = await getAuthorizedAdmin();
  if (!adminUser) {
    return NextResponse.json(
      { error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }
  return null;
}
