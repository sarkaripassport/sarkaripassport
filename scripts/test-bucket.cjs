const filename = "test.txt";
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabaseAdmin.storage.from('uploads').upload(filename, "hello", { upsert: true });
  console.log("Upload result:", error || "Success");
  
  const { data: { publicUrl } } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
  console.log("Public URL:", publicUrl);

  const res = await fetch(publicUrl);
  console.log("Fetch status:", res.status);
  console.log("Fetch body:", await res.text());
}
run();
