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

async function inspect() {
  const env = await getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  console.log("Supabase URL:", supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  // 1. Check categories
  console.log("\n--- Checking Categories ---");
  const { data: catData, error: catError } = await supabase.from('categories').select('*').limit(5);
  if (catError) {
    console.error("Categories Error:", catError.message);
  } else {
    console.log(`Successfully fetched categories. Found ${catData.length} rows.`);
    console.log("Sample:", JSON.stringify(catData, null, 2));
  }

  // 2. Check settings
  console.log("\n--- Checking Settings (id = global) ---");
  const { data: globalSettings, error: settingsError } = await supabase.from('settings').select('*').eq('id', 'global').single();
  if (settingsError) {
    console.error("Settings Error:", settingsError.message);
  } else {
    console.log("Global Settings found!");
    console.log("Keys in settings data:", Object.keys(globalSettings.data || {}));
  }

  // 3. Check messages (settings with id msg_%)
  console.log("\n--- Checking Messages (settings ID like msg_%) ---");
  const { data: messages, error: msgError } = await supabase.from('settings').select('*').like('id', 'msg_%');
  if (msgError) {
    console.error("Messages Error:", msgError.message);
  } else {
    console.log(`Found ${messages.length} messages in settings table.`);
    console.log("Sample messages:", JSON.stringify(messages.slice(0, 3), null, 2));
  }

  // 4. Check jobs
  console.log("\n--- Checking Jobs ---");
  const { count, error: jobsCountError } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  if (jobsCountError) {
    console.error("Jobs Count Error:", jobsCountError.message);
  } else {
    console.log(`Total jobs in database: ${count}`);
  }

  const { data: jobsSample, error: jobsError } = await supabase.from('jobs').select('id, slug').limit(2);
  if (jobsError) {
    console.error("Jobs fetch error:", jobsError.message);
  } else {
    console.log("Jobs sample:", JSON.stringify(jobsSample, null, 2));
  }
}

inspect().catch(err => console.error("Inspection crashed:", err));
