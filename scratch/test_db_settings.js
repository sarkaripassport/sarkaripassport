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
const supabase = createClient(url, key);

async function cleanSettings() {
  console.log('1. Checking current settings in Supabase...');
  const { data: settings, error: sErr } = await supabase.from('settings').select('*');
  if (sErr) {
    console.error('Error reading settings:', sErr);
    process.exit(1);
  }
  console.log('Found settings rows:', settings?.length);
  if (settings && settings.length > 0) {
    for (const row of settings) {
      console.log('Row id:', row.id, 'telegram:', row.telegram);
      // Clean telegram and any onestopread strings
      let needsUpdate = false;
      const updatedRow = { ...row };

      if (updatedRow.telegram && updatedRow.telegram.includes('onestopread')) {
        updatedRow.telegram = 'https://t.me/govjobwala';
        needsUpdate = true;
      }
      // Check other social links or text
      const str = JSON.stringify(updatedRow);
      if (str.includes('onestopread')) {
        console.log('Row contains onestopread! Cleaning...');
        // Replace onestopread with govjobwala in any string property
        for (const k of Object.keys(updatedRow)) {
          if (typeof updatedRow[k] === 'string' && updatedRow[k].includes('onestopread')) {
            updatedRow[k] = updatedRow[k].replace(/onestopread/gi, 'govjobwala');
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        console.log('Updating row id:', row.id, 'with new telegram:', updatedRow.telegram);
        const { error: uErr } = await supabase.from('settings').update({
          telegram: updatedRow.telegram,
          facebook: updatedRow.facebook || 'https://facebook.com/govjobwala',
          twitter: updatedRow.twitter || 'https://twitter.com/govjobwala',
          youtube: updatedRow.youtube || 'https://youtube.com/@govjobwala',
          instagram: updatedRow.instagram || 'https://instagram.com/govjobwala',
          whatsapp_link: updatedRow.whatsapp_link || 'https://whatsapp.com/channel/0029VaA2KzV7T8bd5WEGk90n'
        }).eq('id', row.id);
        if (uErr) {
          console.error('Error updating settings:', uErr);
        } else {
          console.log('Successfully updated settings id:', row.id);
        }
      } else {
        console.log('Row id:', row.id, 'is already clean of onestopread.');
      }
    }
  }

  console.log('2. Checking users table in Supabase...');
  const { data: users, error: uErr } = await supabase.from('users').select('*');
  if (uErr) {
    console.error('Error reading users:', uErr.message);
  } else {
    console.log('Found users rows:', users?.length);
    for (const u of users || []) {
      if (u.email && u.email.includes('onestopread')) {
        console.log('Found user with onestopread email:', u.email, 'id:', u.id);
        const newEmail = u.email.replace(/onestopread/gi, 'govjobwala');
        const { error: uUpdateErr } = await supabase.from('users').update({ email: newEmail }).eq('id', u.id);
        if (uUpdateErr) {
          console.error('Error updating user email:', uUpdateErr);
        } else {
          console.log('Successfully updated user email to:', newEmail);
        }
      }
    }
  }

  console.log('DB cleaning complete!');
  process.exit(0);
}

cleanSettings();
