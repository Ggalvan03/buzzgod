const tmi = require("tmi.js");
import { getTwitchToken } from "./fetchSupabaseToken"; // Adjust the import path as necessary

export async function sendMessageToTwitch(message: string) {
  const accessToken = await getTwitchToken();

  const client = new tmi.Client({
    identity: {
      username: "buzzgod_bot", // Replace with your bot's username
      password: `oauth:${accessToken}`,
    },
    channels: [process.env.TWITCH_CHANNEL_NAME || "buzzgod_bs"],
  });

  await client.connect();
  await client.say(process.env.TWITCH_CHANNEL_NAME || "buzzgod_bs", message);
  await client.disconnect();
}