import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function SetupAdminsPage() {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const results = [];
  for (const user of users) {
    if (!user.user_metadata || user.user_metadata.role !== 'super_admin') {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, role: 'super_admin' }
      });
      if (updateError) {
        results.push(`Error upgrading ${user.email}: ${updateError.message}`);
      } else {
        results.push(`Successfully upgraded ${user.email} to super_admin`);
      }
    } else {
      results.push(`User ${user.email} is already super_admin`);
    }
  }

  return (
    <div className="p-10 font-mono text-sm space-y-2">
      <h1 className="text-xl font-bold mb-4">Setup Complete</h1>
      {results.map((r, i) => <div key={i}>{r}</div>)}
    </div>
  );
}
