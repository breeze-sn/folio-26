import { escapeHtml, hasValidState, isConfigured, requestSpotifyToken, spotifyConfig } from "./_shared.js";

export default async function handler(request, response) {
  const config = spotifyConfig();
  if (!isConfigured(config) || !request.query.code || !hasValidState(request.query.state, config.clientSecret)) {
    return response.status(400).send("Spotify connection could not be verified. Please start the authorization again.");
  }

  try {
    const token = await requestSpotifyToken(config, {
      grant_type: "authorization_code",
      code: request.query.code,
      redirect_uri: config.redirectUri,
    });
    const refreshToken = escapeHtml(token.refresh_token);
    return response.status(200).send(`<!doctype html><title>Spotify connected</title><main style="font:16px system-ui;max-width:42rem;margin:4rem auto"><h1>Spotify connected</h1><p>Copy this refresh token into Vercel as <code>SPOTIFY_REFRESH_TOKEN</code>, then redeploy. Treat it like a password and do not share it.</p><textarea readonly style="width:100%;min-height:7rem">${refreshToken}</textarea></main>`);
  } catch (error) {
    console.error("Spotify authorization failed:", error.message);
    return response.status(502).send("Spotify connection failed. Please try again.");
  }
}
