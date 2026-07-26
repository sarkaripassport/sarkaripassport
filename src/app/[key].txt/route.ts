import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    const resolvedParams = await params;
    const keyParam = resolvedParams.key;
    const cleanKey = keyParam.replace('.txt', '');

    const settings = await getSettings();
    const configuredKey = settings.indexing?.indexnow_key;

    if (configuredKey && cleanKey === configuredKey) {
      return new Response(configuredKey, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (err) {
    console.error("IndexNow Verification Route Error:", err);
  }

  return new Response('Not Found', { status: 404 });
}
