const fs = require('fs');
const { execSync } = require('child_process');

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

console.log('1. Fetching settings via curl...');
try {
  const res = execSync(`curl -4 -s -m 10 -H "apikey: ${key}" -H "Authorization: Bearer ${key}" "${url}/rest/v1/settings?select=*"`, { encoding: 'utf8' });
  const settings = JSON.parse(res);
  console.log('Found settings rows:', settings.length);
  for (const row of settings) {
    console.log('ID:', row.id, 'telegram:', row.telegram);
    if (row.telegram && row.telegram.includes('onestopread')) {
      console.log('Updating telegram for id:', row.id);
      const updatePayload = JSON.stringify({ telegram: 'https://t.me/govjobwala' });
      execSync(`curl -4 -s -m 10 -X PATCH -H "apikey: ${key}" -H "Authorization: Bearer ${key}" -H "Content-Type: application/json" -d '${updatePayload}' "${url}/rest/v1/settings?id=eq.${row.id}"`);
      console.log('Successfully updated settings id:', row.id);
    } else {
      console.log('Settings id:', row.id, 'is clean.');
    }
  }
} catch (e) {
  console.error('Settings curl error:', e.message);
}

console.log('2. Fetching users via curl...');
try {
  const res = execSync(`curl -4 -s -m 10 -H "apikey: ${key}" -H "Authorization: Bearer ${key}" "${url}/rest/v1/users?select=*"`, { encoding: 'utf8' });
  const users = JSON.parse(res);
  console.log('Found users rows:', users.length);
  for (const u of users) {
    if (u.email && u.email.includes('onestopread')) {
      console.log('Found user with onestopread email:', u.email, 'id:', u.id);
      const newEmail = u.email.replace(/onestopread/gi, 'govjobwala');
      const updatePayload = JSON.stringify({ email: newEmail });
      execSync(`curl -4 -s -m 10 -X PATCH -H "apikey: ${key}" -H "Authorization: Bearer ${key}" -H "Content-Type: application/json" -d '${updatePayload}' "${url}/rest/v1/users?id=eq.${u.id}"`);
      console.log('Successfully updated user email to:', newEmail);
    }
  }
} catch (e) {
  console.error('Users curl error:', e.message);
}

console.log('DONE!');
