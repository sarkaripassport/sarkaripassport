const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local natively
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        // Remove surrounding quotes if any
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
      }
    }
  });
}

async function checkLogos() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('🔍 Database Diagnostic Info:');
  console.log('--------------------------------');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Key starts with:', supabaseKey ? supabaseKey.substring(0, 15) + '...' : 'undefined');
  console.log('--------------------------------');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase URL or Key in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  // Check jobs
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, slug, data')
    .limit(5);

  if (error) {
    console.error('❌ Error fetching jobs:', error.message);
    return;
  }

  console.log(`\n📋 Checking logo URLs in last ${jobs.length} jobs:`);
  jobs.forEach(job => {
    const jobData = job.data;
    console.log(`- Job ID: ${job.id}`);
    console.log(`  Slug: ${job.slug}`);
    console.log(`  Logo URL in database: "${jobData.logo_url}"`);
  });
}

checkLogos().catch(console.error);
