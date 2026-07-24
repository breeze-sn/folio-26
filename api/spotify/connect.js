import { createState, isConfigured, spotifyConfig } from "./_shared.js";

export default function handler(request, response) {
  const config = spotifyConfig();
  if (!isConfigured(config) || request.query.token !== config.connectToken) {
    return response.status(404).end();
  }

  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.search = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.redirectUri,
    scope: "user-read-currently-playing user-read-playback-state",
    state: createState(config.connectToken),
    show_dialog: "true",
  }).toString();
  return response.redirect(authorizeUrl.toString());
}
