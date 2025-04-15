import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { access_token, refresh_token, expires_in, timestamp } = await req.json();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/twitch_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: 1,
        access_token,
        refresh_token,
        expires_in,
        timestamp
      })
    });

    if (!res.ok) {
      console.error(await res.text());
      return NextResponse.json({ error: 'Failed to save token to Supabase' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving token:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
