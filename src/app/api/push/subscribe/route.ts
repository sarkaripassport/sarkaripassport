import { NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Subscribe the device token to the 'all_jobs' topic
    const response = await adminMessaging.subscribeToTopic([token], 'all_jobs');

    if (response.failureCount > 0) {
      console.error('Failed to subscribe:', response.errors);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed to topic successfully' });
  } catch (error: any) {
    console.error('Error in push/subscribe:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
