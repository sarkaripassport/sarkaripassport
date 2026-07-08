const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setup() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  
  if (!buckets.find(b => b.name === 'uploads')) {
    console.log('Creating uploads bucket...');
    const { error: createError } = await supabase.storage.createBucket('uploads', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
      fileSizeLimit: 5242880 // 5MB
    });
    if (createError) console.error('Error creating bucket:', createError);
    else console.log('Bucket created successfully.');
  } else {
    console.log('Bucket already exists.');
  }
}

setup();
