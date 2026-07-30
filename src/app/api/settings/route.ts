import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { checkApiAdminAuth } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = await checkApiAdminAuth();
    if (authError) return authError;

    const data = await request.json();
    await saveSettings(data);
    revalidatePath('/', 'layout'); // Invalidate all cached pages
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
