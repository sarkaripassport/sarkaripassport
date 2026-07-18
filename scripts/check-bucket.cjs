const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabaseAdmin.storage.from('uploads').list();
  if (error) {
    console.error("List error:", error);
    return;
  }
  console.log("Bucket objects:");
  data.forEach(f => console.log(`${f.name} - ${f.metadata?.size || 'unknown size'} bytes - ${f.metadata?.mimetype || 'unknown mime'}`));
}
run();
