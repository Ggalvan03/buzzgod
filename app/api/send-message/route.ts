import tmi from 'tmi.js';
import { NextRequest, NextResponse } from 'next/server';
import { getTwitchToken } from '@/lib/fetchSupabaseToken';

export async function POST(req: NextRequest) {
  const accessToken = await getTwitchToken();

  if (!accessToken) {
    return NextResponse.json({ error: 'No Twitch access token available' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const client = new tmi.Client({
      identity: {
        username: 'buzzgod_bot', // replace with your actual bot username
        password: `oauth:${accessToken}`,
      },
      channels: [process.env.TWITCH_CHANNEL_NAME || 'buzzgod_bs'],
    });

    await client.connect();
    await client.say(process.env.TWITCH_CHANNEL_NAME || 'buzzgod_bs', message);
    await client.disconnect();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in send-message API:", error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
