import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { Resend } from "resend";

const { Pool } = pg;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is required.");
}

if (!process.env.FROM_EMAIL) {
  throw new Error("FROM_EMAIL is required.");
}

if (!process.env.TO_EMAIL) {
  throw new Error("TO_EMAIL is required.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const resend = new Resend(process.env.RESEND_API_KEY);

async function ensureContactSubmissionsTable() {
  try {
    console.log("Creating table if not exists...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        source TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("Table created or already exists");
  } catch (error) {
    console.error("Error ensuring table exists:", error.message);
    throw error;
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_, response) => {
  response.json({ ok: true });
});

app.post("/contact", async (request, response) => {
  try {
    const { name, email, message, source = "portfolio-contact" } = request.body;

    if (!name || !email || !message) {
      return response.status(400).json({ ok: false, message: "Missing required fields." });
    }

    await pool.query(
      `
        INSERT INTO contact_submissions (name, email, message, source)
        VALUES ($1, $2, $3, $4)
      `,
      [name.trim(), email.trim(), message.trim(), source.trim()]
    );

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `New portfolio contact from ${name}`,
      replyTo: email,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Message: ${message}`,
        `Source: ${source}`,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        <p><strong>Source:</strong> ${escapeHtml(source)}</p>
      `,
    });

    return response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ ok: false, message: "Unable to send message." });
  }
});

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

async function start() {
  try {
    console.log("Starting server...");
    await ensureContactSubmissionsTable();
    console.log("Table check complete");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during startup:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

start();