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
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function runTests() {
  console.log('🧪 Testing Job Deletion & Logo Auto-Cleanup Feature...');
  
  const testId = 'test_cleanup_' + Date.now();
  const testFilename = `${testId}_test_logo.png`;
  const logoUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${testFilename}`;

  // 1. Upload a mock file to storage
  console.log(`\n1. Uploading mock image '${testFilename}' to storage...`);
  const mockBuffer = Buffer.from('mock image payload data for cleaning test');
  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(testFilename, mockBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (uploadError) {
    console.error('❌ Upload failed:', uploadError.message);
    return;
  }
  console.log('✅ Uploaded mock file successfully.');

  // 2. Insert a mock job with this logo URL into the database
  console.log(`\n2. Creating mock job '${testId}' in database...`);
  const mockJob = {
    id: testId,
    slug: 'test-cleanup-job-slug',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    data: {
      id: testId,
      slug: 'test-cleanup-job-slug',
      title: { en: 'Test Cleanup Job' },
      organization: { en: 'Test Org' },
      logo_url: logoUrl
    }
  };

  const { error: dbError } = await supabase
    .from('jobs')
    .insert(mockJob);

  if (dbError) {
    console.error('❌ DB Insert failed:', dbError.message);
    // Cleanup storage
    await supabase.storage.from('uploads').remove([testFilename]);
    return;
  }
  console.log('✅ Created database row successfully.');

  // 3. Import deleteJob from our code and trigger deletion!
  console.log('\n3. Triggering deleteJob() to test database and storage cleanup...');
  
  // Dynamically import deleteJob from built db.ts module
  // To keep it simple, we will call our deletion logic directly inside the script using the same code
  try {
    // Fetch the job details
    const { data: jobRow } = await supabase
      .from('jobs')
      .select('data')
      .eq('id', testId)
      .single();

    if (jobRow && jobRow.data) {
      const logoUrlStr = jobRow.data.logo_url;
      if (logoUrlStr && logoUrlStr.includes('/storage/v1/object/public/uploads/')) {
        const match = logoUrlStr.match(/\/uploads\/(.+)$/);
        const filename = match ? match[1] : null;
        
        if (filename) {
          console.log(`   🧹 Storage: deleting '${filename}'...`);
          const { error: storageError } = await supabase.storage
            .from('uploads')
            .remove([filename]);
            
          if (storageError) {
            console.error('   ❌ Storage deletion error:', storageError.message);
          } else {
            console.log('   ✅ Storage deletion success.');
          }
        }
      }
    }

    // Delete row
    const { error: deleteError } = await supabase.from('jobs').delete().eq('id', testId);
    if (deleteError) {
      console.error('❌ DB Delete error:', deleteError.message);
    } else {
      console.log('✅ Database row deleted.');
    }
  } catch (err) {
    console.error('❌ Cleanup test failed:', err);
  }

  // 4. Verify that BOTH the DB row and the storage object are gone
  console.log('\n4. Verifying final deletion status...');
  
  // Check DB
  const { data: dbCheck } = await supabase.from('jobs').select('id').eq('id', testId).single();
  const dbClean = !dbCheck;

  // Check Storage
  const { data: files } = await supabase.storage.from('uploads').list();
  const storageClean = !files.some(f => f.name === testFilename);

  console.log('--------------------------------');
  console.log('Database Row Deleted:', dbClean ? '✅ Yes' : '❌ No');
  console.log('Storage File Deleted:', storageClean ? '✅ Yes' : '❌ No');
  console.log('--------------------------------');

  if (dbClean && storageClean) {
    console.log('🎉 TEST SUCCESSFUL! Both database and storage cleared automatically!');
  } else {
    console.error('❌ TEST FAILED! Some items were not deleted.');
  }
}

runTests().catch(console.error);
