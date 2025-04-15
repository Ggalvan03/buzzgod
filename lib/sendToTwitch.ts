const tmi = require("tmi.js");

// You can move this to a more persistent store later
let accessToken = "";

export function setTwitchAccessToken(token: string) {
  accessToken = token;
}

export async function sendMessageToTwitch(message: string) {
  if (!accessToken) {
    throw new Error("No Twitch access token available");
  }

  const client = new tmi.Client({
    identity: {
      username: "buzzgod_bot", // Replace with your bot username
      password: `oauth:${accessToken}`, // Access token from Twitch
    },
    channels: [process.env.TWITCH_CHANNEL_NAME || "buzzgod_bs"],
  });

  await client.connect();
  await client.say(process.env.TWITCH_CHANNEL_NAME || "buzzgod_bs", message);
  await client.disconnect();
}