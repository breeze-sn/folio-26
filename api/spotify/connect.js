import { createState, isConfigured, spotifyConfig } from "./_shared.js";

export default function handler(request, response) {
  const config = spotifyConfig();
  if (!isConfigured(config)) {
    return response.status(503).send(
      "Spotify is not configured. Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REDIRECT_URI in Vercel, then redeploy."
    );
  }

  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.search = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.redirectUri,
    scope: "user-read-currently-playing user-read-playback-state",
    state: createState(config.clientSecret),
    show_dialog: "true",
  }).toString();
  return response.redirect(authorizeUrl.toString());
}
