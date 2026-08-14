import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const REGION = process.env.MAILCHIMP_API_REGION;

    // Diagnostic check for local development
    if (!API_KEY || !AUDIENCE_ID || !REGION) {
      console.error('❌ Mailchimp variables missing in .env.local');
      return NextResponse.json({ error: 'Configuration missing' }, { status: 500 });
    }

    const url = `https://${REGION}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    // Use Basic auth header which is broadly compatible with Mailchimp
    const basicAuth = `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: basicAuth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    });

    const responseData = await response.json();

    // Handle case where user is already on the list
    if (responseData.title === 'Member Exists') {
      return NextResponse.json({ message: "You're already on the list! ✨" }, { status: 200 });
    }

    if (!response.ok) {
      console.error('Mailchimp API Error:', response.status, responseData);
      // Provide a bit more detail to the client for debugging (non-sensitive)
      return NextResponse.json({ error: 'Mailchimp rejection', detail: responseData }, { status: 400 });
    }

    return NextResponse.json({ message: "You're on the list! 🎉" }, { status: 201 });
  } catch (err) {
    console.error('Network/Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}