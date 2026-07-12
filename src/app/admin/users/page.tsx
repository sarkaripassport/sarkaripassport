import { createClient } from '@/lib/supabase/server';
import { getUsers } from './actions';
import UsersClient from './UsersClient';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const role = user.user_metadata?.role || 'co_admin';
  const users = await getUsers();

  return <UsersClient users={users} currentRole={role} currentUserId={user.id} />;
}
