const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  try {
    // 1. Get the most recently uploaded image from the bucket
    const { data: files, error } = await supabase.storage.from('uploads').list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error || !files || files.length === 0) {
      console.log("No files found in bucket");
      return;
    }

    const latestFile = files[0];
    console.log("Using latest file:", latestFile.name);

    // 2. Download the file
    const { data: fileData, error: downloadError } = await supabase.storage.from('uploads').download(latestFile.name);
    if (downloadError) throw downloadError;

    const buffer = Buffer.from(await fileData.arrayBuffer());

    // 3. Convert to 256x256 PNG for Next.js favicon (icon.png)
    await sharp(buffer)
      .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile('src/app/icon.png');

    console.log("Successfully created src/app/icon.png");
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
