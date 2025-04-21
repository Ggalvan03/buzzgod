import { NextRequest } from "next/server";
import { startYoutubeBotScheduler } from "@/lib/youtubebot";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
    console.warn("[YouTubeBot] Cron job unauthorized");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await startYoutubeBotScheduler();
    console.log("[YouTubeBot] Bot started successfully.");
    return new Response("Bot started successfully");
  } catch (error) {
    console.error("[YouTubeBot] Error starting bot:", error);
    return new Response("Failed to start bot", { status: 500 });
  }
}