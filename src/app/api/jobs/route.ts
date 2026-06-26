import { NextResponse } from 'next/server';
import { createJob } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Sanitize or auto-generate slug
    if (data.slug) {
      data.slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    } else {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const job = await createJob(data);

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}
