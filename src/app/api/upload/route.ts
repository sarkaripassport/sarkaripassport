import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const finalContentType = file.type;
    const extension = file.name.substring(file.name.lastIndexOf('.'));
    
    // Generate clean filename
    const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const cleanName = originalNameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${cleanName}${extension}`;
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Server missing SUPABASE_SERVICE_ROLE_KEY environment variable." }, { status: 500 });
    }

    const { error } = await supabaseAdmin.storage
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
      
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
