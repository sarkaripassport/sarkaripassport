import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const filename = pathname.split('/').pop() || '';
    const cleanKey = filename.replace('.txt', '');

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
