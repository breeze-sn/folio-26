import { createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "form_gym_session";
const sessionDuration = 30 * 24 * 60 * 60;

function signature(expiresAt, accessCode) {
  return createHmac("sha256", accessCode).update(`form-gym:${expiresAt}`).digest("base64url");
}

function cookies(request) {
  return Object.fromEntries((request.headers.cookie || "").split(";").map((item) => {
    const separator = item.indexOf("=");
    return separator < 0 ? ["", ""] : [item.slice(0, separator).trim(), item.slice(separator + 1).trim()];
  }).filter(([name]) => name));
}

export function isGymAuthorized(request) {
  const accessCode = process.env.GYM_ACCESS_CODE;
  if (!accessCode) return false;
  const token = cookies(request)[cookieName];
  const [expiresAt, suppliedSignature] = (token || "").split(".");
  if (!/^\d+$/.test(expiresAt || "") || Number(expiresAt) <= Math.floor(Date.now() / 1000) || !suppliedSignature) return false;
  const expected = Buffer.from(signature(expiresAt, accessCode));
  const supplied = Buffer.from(suppliedSignature);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

function setSessionCookie(request, response, value, maxAge) {
  const secure = process.env.VERCEL || request.headers["x-forwarded-proto"] === "https" || request.secure;
  response.setHeader("Set-Cookie", `${cookieName}=${value}; HttpOnly; SameSite=Strict; Path=/api/; Max-Age=${maxAge}${secure ? "; Secure" : ""}`);
}

export default async function gymAuthHandler(request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
  const accessCode = process.env.GYM_ACCESS_CODE;

  if (request.method === "GET") {
    if (!accessCode) return response.status(503).json({ authenticated: false, error: "Gym access is not configured on the server yet." });
    return response.status(isGymAuthorized(request) ? 200 : 401).json({ authenticated: isGymAuthorized(request) });
  }

  if (request.method !== "POST") return response.status(405).json({ error: "Use POST to unlock or lock the gym page." });
  if (!accessCode) return response.status(503).json({ error: "Gym access is not configured on the server yet." });

  const now = Date.now();
  const ip = request.headers["x-forwarded-for"]?.split(",")[0]?.trim() || request.socket?.remoteAddress || "unknown";
  const attempts = (gymAuthHandler.attempts?.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (attempts.length >= 5) return response.status(429).json({ error: "Too many attempts. Please wait a few minutes and try again." });

  if (request.body?.action === "logout") {
    setSessionCookie(request, response, "", 0);
    return response.status(200).json({ authenticated: false });
  }

  attempts.push(now);
  if (!gymAuthHandler.attempts) gymAuthHandler.attempts = new Map();
  gymAuthHandler.attempts.set(ip, attempts);

  const supplied = Buffer.from(String(request.body?.code || ""));
  const expected = Buffer.from(accessCode);
  const correct = supplied.length === expected.length && timingSafeEqual(supplied, expected);
  if (!correct) return response.status(401).json({ error: "That code didn’t match. Try again." });

  const expiresAt = Math.floor(Date.now() / 1000) + sessionDuration;
  setSessionCookie(request, response, `${expiresAt}.${signature(String(expiresAt), accessCode)}`, sessionDuration);
  return response.status(200).json({ authenticated: true });
}
