import { NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebaseAdmin';

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

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
