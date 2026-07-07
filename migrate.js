const fs = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function getEnv() {
  const envFile = await fs.readFile('.env.local', 'utf-8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) {
      env[key.trim()] = val.join('=').trim();
    }
  });
  return env;
}

async function migrate() {
  const env = await getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log('Starting Supabase Migration...');

  try {
    // 1. Settings
    const settingsPath = path.join(process.cwd(), 'settings-db.json');
    const settingsData = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(settingsData);
    
    console.log('Migrating Settings...');
    const { error: settingsError } = await supabase.from('settings').upsert({ id: 'global', data: settings });
    if (settingsError) throw settingsError;

    // 2. Categories
    const categoriesPath = path.join(process.cwd(), 'categories-db.json');
    const categoriesData = await fs.readFile(categoriesPath, 'utf-8');
    const categories = JSON.parse(categoriesData);
    
    console.log(`Migrating ${categories.length} Categories...`);
    const categoryRows = categories.map(c => ({ id: c.id, slug: c.slug, data: c }));
    const { error: catError } = await supabase.from('categories').upsert(categoryRows);
    if (catError) throw catError;

    // 3. Jobs
    const jobsPath = path.join(process.cwd(), 'jobs-db.json');
    const jobsData = await fs.readFile(jobsPath, 'utf-8');
    const jobs = JSON.parse(jobsData);
    
    console.log(`Migrating ${jobs.length} Jobs...`);
    const jobRows = jobs.map(j => ({
      id: j.id,
      slug: j.slug,
      created_at: j.created_at,
      updated_at: j.updated_at || j.created_at,
      data: j
    }));
    
    const { error: jobsError } = await supabase.from('jobs').upsert(jobRows);
    if (jobsError) throw jobsError;

    console.log('Migration Complete! All data is now in Supabase.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
