import { NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebaseAdmin';
import { checkApiAdminAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const authError = await checkApiAdminAuth();
    if (authError) return authError;

    const { title, body, url } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const message = {
      notification: {
        title,
        body: body || '',
      },
      data: {
        url: url || '/',
      },
      topic: 'all_jobs',
    };

    // Send a message to devices subscribed to the provided topic.
    const response = await adminMessaging.send(message);

    return NextResponse.json({ success: true, messageId: response });
  } catch (error: any) {
    console.error('Error in push/broadcast:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
