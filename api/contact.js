import { Resend } from "resend";

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function contactHandler(request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");

  if (request.method !== "POST") {
    return response.status(405).json({ ok: false, message: "Use POST to send a contact message." });
  }

  const missing = ["RESEND_API_KEY", "FROM_EMAIL"].filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Contact email is not configured. Missing: ${missing.join(", ")}`);
    return response.status(503).json({ ok: false, message: "The contact form is not configured yet." });
  }

  const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
  const email = typeof request.body?.email === "string" ? request.body.email.trim() : "";
  const message = typeof request.body?.message === "string" ? request.body.message.trim() : "";
  const source = typeof request.body?.source === "string" ? request.body.source.trim().slice(0, 100) : "portfolio-contact";

  if (!name || !email || !message || name.length > 120 || email.length > 254 || message.length > 10000) {
    return response.status(400).json({ ok: false, message: "Please check the form fields and try again." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ ok: false, message: "Please enter a valid email address." });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: "nagekarsimran@outlook.com",
      subject: `New portfolio contact from ${name}`,
      replyTo: email,
      text: [`Name: ${name}`, `Email: ${email}`, `Message: ${message}`, `Source: ${source}`].join("\n"),
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p><p><strong>Source:</strong> ${escapeHtml(source)}</p>`,
    });

    if (error) {
      console.error("Resend rejected a contact message:", error.message);
      return response.status(502).json({ ok: false, message: "Resend could not deliver your message. Please try again or use email directly." });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Unable to send contact message:", error);
    return response.status(500).json({ ok: false, message: "Unable to send your message right now. Please try again or use email directly." });
  }
}
