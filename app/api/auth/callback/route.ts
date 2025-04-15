import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getTwitchToken() {
  const { data, error } = await supabase
    .from('twitch_tokens')
    .select('*')
    .eq('id', 1)
    .single();

  console.log("[Supabase] Token fetch result:", { data, error });

  if (error || !data) {
    throw new Error('Could not fetch token from Supabase');
  }

  const tokenExpiresAt = new Date(data.timestamp);
  tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + data.expires_in);
  const now = new Date();

  if (now >= tokenExpiresAt) {
    const refreshParams = new URLSearchParams();
    refreshParams.append('grant_type', 'refresh_token');
    refreshParams.append('refresh_token', data.refresh_token);
    refreshParams.append('client_id', process.env.TWITCH_CLIENT_ID!);
    refreshParams.append('client_secret', process.env.TWITCH_CLIENT_SECRET!);

    const res = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: refreshParams.toString(),
    });

    const tokenData = await res.json();

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/save-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!tokenData.access_token) throw new Error('Failed to refresh token');

    const updateRes = await supabase
      .from('twitch_tokens')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        timestamp: new Date().toISOString(),
      })
      .eq('id', 1);

    if (updateRes.error) throw new Error('Failed to update token in Supabase');
    
    console.log("[Supabase] Token refreshed:", tokenData);
    
    return tokenData.access_token;
  }

  return data.access_token;
}
