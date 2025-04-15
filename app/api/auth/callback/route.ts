import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.TWITCH_CLIENT_ID!);
  params.append("client_secret", process.env.TWITCH_CLIENT_SECRET!);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", process.env.TWITCH_REDIRECT_URI!);

  const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const tokenData = await tokenRes.json();
  console.log("Twitch token response:", tokenData);

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/save-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      timestamp: new Date().toISOString()
    })
  });
  return NextResponse.redirect("http://localhost:3000/");
}
