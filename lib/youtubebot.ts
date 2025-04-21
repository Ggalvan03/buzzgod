import tmi from "tmi.js";
import fetch from "node-fetch";
import { getTwitchToken } from "./fetchSupabaseToken"; // Adjust the import path as necessary

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL_NAME!;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;

export async function startYoutubeBotScheduler() {
  console.log("[YouTubeBot] Conectado al chat de Twitch.");

  const sendYoutubeMessage = async () => {
    console.log("[YouTubeBot] Verificando si el streamer está en vivo...");
    const isLive = await checkIfStreamerIsLive();
    console.log("[YouTubeBot] ¿Está en vivo?:", isLive);
    if (!isLive) return;

    const videoLink = await getRandomYoutubeVideo();
    const messages = [
      `🎥 ¡No te pierdas este video!: ${videoLink}`,
      `🔥 Dale play al contenido de Buzz: ${videoLink}`,
      `🐊 ¡Nuevo video en el canal!: ${videoLink}`,
      `📺 Mira este video mientras jugamos: ${videoLink}`,
    ];

    const random = Math.floor(Math.random() * messages.length);
    console.log("[YouTubeBot] Enviando mensaje al chat:", messages[random]);

    const accessToken = await getTwitchToken();
    const client = new tmi.Client({
      identity: {
        username: "buzzgod_bot",
        password: `oauth:${accessToken}`,
      },
      channels: [TWITCH_CHANNEL],
    });

    await client.connect();
    await client.say(TWITCH_CHANNEL, messages[random]);
    await client.disconnect();
  };

  // Primer mensaje (si está en vivo)
  await sendYoutubeMessage();

  // Cada 20 minutos
  setInterval(sendYoutubeMessage, 30 * 60 * 1000);
}

async function checkIfStreamerIsLive(): Promise<boolean> {
  const accessToken = await getTwitchToken();

  const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${TWITCH_CHANNEL}`, {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  const data = (await res.json()) as { data: any[] };
  console.log("[YouTubeBot] Respuesta de la API de Twitch:", data);
  return data.data && data.data.length > 0;
}

async function getRandomYoutubeVideo(): Promise<string> {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&type=video&maxResults=25&order=date`;
  const res = await fetch(url);
  const data = (await res.json()) as { items: { id: { videoId: string } }[] };
  const items = data.items;

  if (!items || items.length === 0) return "https://www.youtube.com/@Buzzgod_bs/videos";

  const random = Math.floor(Math.random() * items.length);
  const videoId = items[random].id.videoId;
  console.log("[YouTubeBot] Video seleccionado:", videoId);
  return `https://www.youtube.com/watch?v=${videoId}`;
}