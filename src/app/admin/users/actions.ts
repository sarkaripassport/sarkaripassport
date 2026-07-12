'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'co_admin';
  created_at: string;
}

async function verifySuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'super_admin') {
    throw new Error('Unauthorized: Only Super Admins can perform this action.');
  }
}

export async function getUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error('Unauthorized');

  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  return users.map(user => ({
    id: user.id,
    email: user.email || '',
    role: user.user_metadata?.role || 'co_admin',
    created_at: user.created_at,
  }));
}

export async function addCoAdmin(email: string, password?: string) {
  await verifySuperAdmin();
  
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'co_admin' }
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function removeAdmin(userId: string) {
  await verifySuperAdmin();
  
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
