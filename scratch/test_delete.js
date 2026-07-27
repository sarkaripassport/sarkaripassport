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

async function testDelete() {
  const env = await getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Insert a test job
  console.log("Inserting test job...");
  const testId = 'test_' + Date.now();
  const testJob = {
    id: testId,
    slug: 'test-job-' + Date.now(),
    created_at: new Date().toISOString(),
    data: {
      title: { en: 'Test Job Deletion', hi: 'परीक्षण', mr: 'परीक्षण' },
      organization: { en: 'Test Org', hi: 'परीक्षण', mr: 'परीक्षण' },
      category: 'admit-card',
      status: 'draft',
      isLive: false
    }
  };

  const { error: insError } = await supabase.from('jobs').insert(testJob);
  if (insError) {
    console.error("Insert failed:", insError.message);
    return;
  }
  console.log("Test job inserted successfully with ID:", testId);

  // 2. Fetch it to confirm
  const { data: fetch1, error: fetch1Error } = await supabase.from('jobs').select('id').eq('id', testId).single();
  if (fetch1Error || !fetch1) {
    console.error("Fetch 1 failed:", fetch1Error?.message);
    return;
  }
  console.log("Fetched inserted job successfully:", fetch1);

  // 3. Delete it
  console.log("Deleting job...");
  const { error: delError } = await supabase.from('jobs').delete().eq('id', testId);
  if (delError) {
    console.error("Delete failed:", delError.message);
    return;
  }
  console.log("Delete query executed.");

  // 4. Try to fetch again
  const { data: fetch2, error: fetch2Error } = await supabase.from('jobs').select('id').eq('id', testId).single();
  if (fetch2Error) {
    console.log("Fetched again: not found (expected behavior). Error message:", fetch2Error.message);
  } else {
    console.log("Fetched again: FOUND! Deletion failed to remove the row from DB! Row:", fetch2);
  }
}

testDelete();
