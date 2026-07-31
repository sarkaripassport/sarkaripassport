const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('f:/sarkarijob/.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) {
    env[key.trim()] = vals.join('=').trim().replace(/^['"]|['"]$/g, '');
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function checkAuthUsers() {
  console.log('Checking Supabase auth users...');
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error listing auth users:', error.message);
    process.exit(1);
  }
  const users = data.users || [];
  console.log('Found total auth users:', users.length);
  for (const u of users) {
    console.log('User id:', u.id, 'email:', u.email, 'role:', u.user_metadata?.role);
    if (u.email && u.email.toLowerCase().includes('onestopread')) {
      console.log('FOUND ONESTOPREAD USER! Replacing email with govjobwala...');
      const newEmail = u.email.toLowerCase().replace(/onestopread/g, 'govjobwala');
      const { error: updErr } = await supabase.auth.admin.updateUserById(u.id, { email: newEmail });
      if (updErr) {
        console.error('Failed to update user email:', updErr.message);
      } else {
        console.log('Successfully updated auth user email to:', newEmail);
      }
    }
  }
  console.log('Auth users check complete.');
  process.exit(0);
}

checkAuthUsers();
