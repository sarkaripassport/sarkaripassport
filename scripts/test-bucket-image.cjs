const filename = "test.png";
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  // 1x1 transparent PNG base64
  const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const buffer = Buffer.from(b64, 'base64');

  const { data, error } = await supabaseAdmin.storage.from('uploads').upload(filename, buffer, { 
    contentType: 'image/png',
    upsert: true 
  });
  console.log("Upload result:", error || "Success");
  
  const { data: { publicUrl } } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
  console.log("Public URL:", publicUrl);

  const res = await fetch(publicUrl);
  console.log("Fetch status:", res.status);
  console.log("Fetch headers:", res.headers.get('content-type'));
}
run();
