import { NextResponse } from 'next/server';
import { trackPageView } from '@/lib/analytics';

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    
    await trackPageView(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}