const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabaseAdmin.from('jobs').select('id, data');
  if (error) {
    console.error("Error fetching jobs:", error);
    return;
  }
  console.log("Total jobs:", data.length);
  data.forEach(job => {
    console.log(`Job ID: ${job.id}`);
    console.log(`Logo URL: ${job.data.logo_url || 'NONE'}`);
  });
}
run();
