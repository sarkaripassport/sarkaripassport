import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import sharp from 'sharp';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    let buffer = Buffer.from(await file.arrayBuffer());
    let finalContentType = file.type;
    let extension = file.name.substring(file.name.lastIndexOf('.'));
    
    const fileSize = buffer.length;

    // Optimize images
    if (file.type.startsWith('image/')) {
      if (fileSize > 300 * 1024) {
        // Enforce compression to keep size in the 60KB - 300KB range
        buffer = await sharp(buffer)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toBuffer();
        finalContentType = 'image/webp';
        extension = '.webp';
      } else if (fileSize >= 60 * 1024) {
        // Between 60KB and 300KB: Convert to webp with high quality, no resizing
        buffer = await sharp(buffer)
          .webp({ quality: 85 })
          .toBuffer();
        finalContentType = 'image/webp';
        extension = '.webp';
      }
      // Under 60KB: Bypasses compression completely to prevent logo corruption (as-is original)
    }
    
    // Use original file type for content type
    const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const cleanName = originalNameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${cleanName}${extension}`;
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Server missing SUPABASE_SERVICE_ROLE_KEY environment variable." }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: finalContentType,
        cacheControl: '31536000',
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      
      // If the bucket doesn't exist, try to create it
      if (error.message.includes('bucket not found') || error.message.includes('Bucket not found')) {
        await supabaseAdmin.storage.createBucket('uploads', { public: true });
        // Try upload again
        const retry = await supabaseAdmin.storage
          .from('uploads')
          .upload(filename, buffer, {
            contentType: finalContentType,
            cacheControl: '31536000',
            upsert: false
          });
        if (retry.error) {
          return NextResponse.json({ error: "Retry Upload failed: " + retry.error.message }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
      }
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(filename);
      
    // Return the clean public URL (the client will add cache buster for preview)
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
