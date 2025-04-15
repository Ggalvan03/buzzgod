import axios from 'axios';

const CLIENT_ID = 'YOUR_TWITCH_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_TWITCH_CLIENT_SECRET';

async function getAccessToken() {
  const response = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
  );
  return response.data.access_token;
}

export async function getTwitchVideos(username = 'buzzgod_bs') {
  const accessToken = await getAccessToken();
  
  // First get user ID
  const userResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
    headers: {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const userId = userResponse.data.data[0].id;
  
  // Get videos
  const videosResponse = await axios.get(
    `https://api.twitch.tv/helix/videos?user_id=${userId}&first=20`,
    {
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  return videosResponse.data.data;
}