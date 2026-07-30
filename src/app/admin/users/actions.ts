'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { getJobs } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'co_admin';
  created_at: string;
}

export interface AdminAnalytics {
  email: string;
  totalJobs: number;
  publishedJobs: number;
  draftJobs: number;
}

async function verifySuperAdmin() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || (user.user_metadata?.role !== 'super_admin' && user.email !== 'admin@govjobwala.com')) {
    throw new Error('Unauthorized: Only Super Admins can perform this action.');
  }
}

export async function getUsers(): Promise<AdminUser[]> {
  await requireAdmin();
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

export async function getAdminAnalytics(): Promise<AdminAnalytics[]> {
  await verifySuperAdmin();
  
  const users = await getUsers();
  const jobs = await getJobs();
  
  const analytics: AdminAnalytics[] = users.map(user => {
    const userJobs = jobs.filter(job => job.created_by === user.email);
    const publishedJobs = userJobs.filter(job => job.isLive).length;
    const draftJobs = userJobs.filter(job => !job.isLive).length;
    
    return {
      email: user.email,
      totalJobs: userJobs.length,
      publishedJobs,
      draftJobs,
    };
  });
  
  return analytics;
}
