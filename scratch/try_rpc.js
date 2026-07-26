const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
const path = require('path');

async function getEnv() {
  const envFile = await fs.readFile(path.join(__dirname, '../.env.local'), 'utf-8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) {
      env[key.trim()] = val.join('=').trim();
    }
  });
  return env;
}

async function tryRpc() {
  const env = await getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const queries = [
    'exec_sql', 'execute_sql', 'run_sql', 'sql'
  ];

  for (const q of queries) {
    try {
      const { data, error } = await supabase.rpc(q, { query: 'SELECT 1' });
      if (error) {
        console.log(`RPC ${q} returned error:`, error.message);
      } else {
        console.log(`🎉 RPC ${q} exists and returned:`, data);
      }
    } catch (e) {
      console.log(`RPC ${q} threw:`, e.message);
    }
  }
}

tryRpc();
