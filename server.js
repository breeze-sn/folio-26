import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import spotifyNowPlayingHandler from "./api/spotify/now-playing.js";
import gymCoachHandler from "./api/gym-coach.js";
import gymAuthHandler from "./api/_gym-auth.js";
import contactHandler from "./api/contact.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_, response) => {
  response.json({ ok: true });
});

app.get("/api/spotify/now-playing", spotifyNowPlayingHandler);
app.all("/api/contact", contactHandler);
app.all("/contact", contactHandler);
app.post("/api/gym-coach", gymCoachHandler);
app.all("/api/gym-auth", gymAuthHandler);


app.use(express.static(path.join(__dirname, "dist")));

app.use((_, response) => {
  response.sendFile(path.join(__dirname, "dist", "index.html"));
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function start() {
  console.log("Starting server...");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}

start();
