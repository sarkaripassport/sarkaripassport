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

async function inspectGlobal() {
  const env = await getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching global settings content...");
  const { data, error } = await supabase.from('settings').select('*').eq('id', 'global').single();
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Global settings data:");
    console.log(JSON.stringify(data.data, null, 2));
  }
}

inspectGlobal();
