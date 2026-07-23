const { createClient } = require('@supabase/supabase-js');

// ==========================================
// CONFIGURATION
// ==========================================
// Replace these with your project credentials
const SOURCE_URL = 'https://iqebmesknqvzzfoxosmh.supabase.co';
const SOURCE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZWJtZXNrbnF2enpmb3hvc21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjAyNjcwMywiZXhwIjoyMDk3NjAyNzAzfQ.oWuRrRpNjhU9yiwK6NhOY3rSPhmea9SPgGhTZPwAmW0';

const TARGET_URL = 'https://moxkepugwmwleryhhhsv.supabase.co';
const TARGET_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veGtlcHVnd213bGVyeWhoaHN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDc0OTg5OCwiZXhwIjoyMTAwMzI1ODk4fQ.tRiyktbvQp800qpTIOtglTVn15ITZv_EmYOTGIMbHRE';

// ==========================================
// MIGRATION SCRIPT
// ==========================================
async function runMigration() {
  console.log('🚀 Starting Supabase Project Migration...');
  
  if (SOURCE_SERVICE_KEY.includes('YOUR_OLD') || TARGET_SERVICE_KEY.includes('YOUR_NEW')) {
    console.error('❌ ERROR: Please edit scripts/migrate-supabase.js and paste your actual service keys!');
    process.exit(1);
  }

  // Initialize clients
  const sourceClient = createClient(SOURCE_URL, SOURCE_SERVICE_KEY, {
    auth: { persistSession: false }
  });
  
  const targetClient = createClient(TARGET_URL, TARGET_SERVICE_KEY, {
    auth: { persistSession: false }
  });

  const tables = ['settings', 'categories', 'jobs'];

  // 1. Migrate Database Tables
  for (const table of tables) {
    console.log(`\n📦 Migrating table: [${table}]...`);
    
    // Fetch all rows from source
    const { data: rows, error: fetchError } = await sourceClient
      .from(table)
      .select('*');
      
    if (fetchError) {
      console.error(`❌ Error fetching from source table ${table}:`, fetchError.message);
      continue;
    }

    if (!rows || rows.length === 0) {
      console.log(`ℹ️ Table ${table} is empty. Skipping.`);
      continue;
    }

    console.log(`   Fetched ${rows.length} rows. Uploading to target...`);

    // Insert rows in batches of 100 to target
    const batchSize = 100;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const { error: insertError } = await targetClient
        .from(table)
        .upsert(batch);

      if (insertError) {
        console.error(`❌ Error inserting batch into target table ${table}:`, insertError.message);
        break;
      }
    }
    console.log(`✅ Table [${table}] migration complete.`);
  }

  // 2. Migrate Storage Buckets (uploads)
  const bucketName = 'uploads';
  console.log(`\n📂 Migrating Storage Bucket: [${bucketName}]...`);

  // Ensure target bucket exists
  const { data: buckets, error: bucketError } = await targetClient.storage.listBuckets();
  if (bucketError) {
    console.error('❌ Error listing target buckets:', bucketError.message);
  } else {
    const bucketExists = buckets.some(b => b.name === bucketName);
    if (!bucketExists) {
      console.log(`   Creating bucket '${bucketName}' in target...`);
      await targetClient.storage.createBucket(bucketName, { public: true });
    }
  }

  // List all files in source bucket
  const { data: files, error: listError } = await sourceClient.storage
    .from(bucketName)
    .list('', { limit: 1000 });

  if (listError) {
    console.error(`❌ Error listing files in source storage:`, listError.message);
  } else if (!files || files.length === 0) {
    console.log(`ℹ️ Storage bucket '${bucketName}' is empty. Skipping.`);
  } else {
    console.log(`   Found ${files.length} files. Migrating...`);

    for (const file of files) {
      if (file.name === '.emptyFolderPlaceholder') continue;
      console.log(`   🔄 Transferring: ${file.name}...`);

      // 1. Download from source
      const { data: blob, error: downloadError } = await sourceClient.storage
        .from(bucketName)
        .download(file.name);

      if (downloadError) {
        console.error(`      ❌ Download failed:`, downloadError.message);
        continue;
      }

      // 2. Upload to target
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await targetClient.storage
        .from(bucketName)
        .upload(file.name, buffer, {
          contentType: blob.type || 'image/webp',
          upsert: true
        });

      if (uploadError) {
        console.error(`      ❌ Upload failed:`, uploadError.message);
      } else {
        console.log(`      ✅ Success.`);
      }
    }
  }

  console.log('\n🎉 ALL DONE! Supabase migration finished successfully.');
}

runMigration().catch(err => {
  console.error('❌ Migration failed with error:', err);
});
