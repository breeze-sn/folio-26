import { createHmac, timingSafeEqual } from "crypto";

export function spotifyConfig() {
  return {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    connectToken: process.env.SPOTIFY_CONNECT_TOKEN,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
    fallbackUrl: process.env.SPOTIFY_FALLBACK_URL || "",
  };
}

export function isConfigured(config, requireRefreshToken = false) {
  return Boolean(
    config.clientId &&
      config.clientSecret &&
      config.redirectUri &&
      config.connectToken &&
      (!requireRefreshToken || config.refreshToken)
  );
}

export function createState(connectToken) {
  const timestamp = Date.now().toString();
  const signature = createHmac("sha256", connectToken).update(timestamp).digest("hex");
  return `${timestamp}.${signature}`;
}

export function hasValidState(state, connectToken) {
  const [timestamp, signature] = String(state || "").split(".");
  if (!/^\d+$/.test(timestamp) || !/^[a-f0-9]{64}$/.test(signature)) return false;
  if (Date.now() - Number(timestamp) > 10 * 60 * 1000) return false;
  const expected = createHmac("sha256", connectToken).update(timestamp).digest("hex");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function requestSpotifyToken(config, params) {
  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
  });
  const payload = await tokenResponse.json();
  if (!tokenResponse.ok) throw new Error(payload.error_description || payload.error || "Spotify token request failed");
  return payload;
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
