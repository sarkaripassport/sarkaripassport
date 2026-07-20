import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    // For simplicity, we'll check the standard auth header that the admin panel sends
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { url, type = 'URL_UPDATED' } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      console.warn("Google Indexing API credentials missing.");
      return NextResponse.json({ error: 'Google credentials not configured' }, { status: 500 });
    }

    // Handle escaped newlines in environment variables
    privateKey = privateKey.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    await jwtClient.authorize();

    const indexing = google.indexing('v3');
    const response = await indexing.urlNotifications.publish({
      auth: jwtClient,
      requestBody: {
        url: url,
        type: type, // URL_UPDATED or URL_DELETED
      },
    });

    console.log(`Successfully pinged Google Indexing API for ${url}`, response.data);
    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('Indexing API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit URL to Indexing API' }, { status: 500 });
  }
}
