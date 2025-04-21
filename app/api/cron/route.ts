import { startYoutubeBotScheduler } from "@/lib/youtubebot";

export async function GET() {
  startYoutubeBotScheduler();
  return new Response("Bot started");
}