import { isConfigured, requestSpotifyToken, spotifyConfig } from "./_shared.js";

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
    if (spotifyResponse.status === 204) return response.status(200).json({ ...baseResponse, connected: true, isPlaying: false });
    if (!spotifyResponse.ok) throw new Error(`Spotify playback request failed with status ${spotifyResponse.status}`);

    const playback = await spotifyResponse.json();
    const item = playback.item;
    return response.status(200).json({
      ...baseResponse,
      connected: true,
      isPlaying: Boolean(playback.is_playing),
      track: item && {
        title: item.name,
        artist: item.artists?.map((artist) => artist.name).join(", ") || item.show?.name || "Spotify",
        url: item.external_urls?.spotify,
      },
    });
  } catch (error) {
    console.error("Spotify playback lookup failed:", error.message);
    return response.status(200).json({ ...baseResponse, connected: false, isPlaying: false });
  }
}
