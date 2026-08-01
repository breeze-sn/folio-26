import { isConfigured, requestSpotifyToken, spotifyConfig } from "./_shared.js";

function mapTrack(item) {
  return item && {
    title: item.name,
    artist: item.artists?.map((artist) => artist.name).join(", ") || item.show?.name || "Spotify",
    url: item.external_urls?.spotify,
    albumArt: item.album?.images?.[0]?.url || item.show?.images?.[0]?.url || "",
  };
}

async function fetchMostRecentTrack(accessToken) {
  const recentResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!recentResponse.ok) return null;

  const recentPlayback = await recentResponse.json();
  return mapTrack(recentPlayback.items?.[0]?.track);
}

export default async function handler(_, response) {
  const config = spotifyConfig();
  const baseResponse = { fallbackUrl: config.fallbackUrl };
  if (!isConfigured(config, true)) return response.status(200).json({ ...baseResponse, connected: false, isPlaying: false });

  try {
    const token = await requestSpotifyToken(config, {
      grant_type: "refresh_token",
      refresh_token: config.refreshToken,
    });
    const spotifyResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    if (spotifyResponse.status === 204) {
      const track = await fetchMostRecentTrack(token.access_token);
      return response.status(200).json({
        ...baseResponse,
        connected: true,
        isPlaying: false,
        track,
      });
    }

    if (!spotifyResponse.ok) throw new Error(`Spotify playback request failed with status ${spotifyResponse.status}`);

    const playback = await spotifyResponse.json();
    return response.status(200).json({
      ...baseResponse,
      connected: true,
      isPlaying: Boolean(playback.is_playing),
      track: mapTrack(playback.item),
    });
  } catch (error) {
    console.error("Spotify playback lookup failed:", error.message);
    return response.status(200).json({ ...baseResponse, connected: false, isPlaying: false });
  }
}
