import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('updated_at, created_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ timestamp: new Date().toISOString() });
    }

    return NextResponse.json({ timestamp: data.updated_at || data.created_at });
  } catch (err) {
    return NextResponse.json({ timestamp: new Date().toISOString() });
  }
}
