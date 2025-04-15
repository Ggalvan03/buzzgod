"use client";

export default function LoginPage() {
  const loginWithTwitch = () => {
    const clientId = "93xjk0i7ed2zq8okttge7rtbq30c8h";
    const redirectUri = process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback";
    const scopes = "chat:read chat:edit";
    const twitchAuthUrl =
      `https://id.twitch.tv/oauth2/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes)}`;

    window.location.href = twitchAuthUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e0e10] text-white">
      <h1 className="text-2xl mb-4">Login with Twitch</h1>
      <button
        onClick={loginWithTwitch}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Connect Bot Account
      </button>
    </div>
  );
}