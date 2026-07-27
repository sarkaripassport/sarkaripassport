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

async function checkJobs() {
  const env = await getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Checking first 5 jobs in DB...");
  const { data, error } = await supabase.from('jobs').select('id, slug, created_at').limit(5);
  if (error) {
    console.error("Error fetching jobs:", error.message);
    return;
  }
  console.log("Jobs found:", data);

  // Let's check if there is an error deleting a non-existent job or if we can test deletion
  console.log("Testing delete query format...");
  const { error: delError } = await supabase.from('jobs').delete().eq('id', 'non-existent-id-test');
  if (delError) {
    console.error("Delete query error:", delError.message);
  } else {
    console.log("Delete query format is valid and executed successfully.");
  }
}

checkJobs();
