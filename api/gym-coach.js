const requestTimesByIp = new Map();

function cleanProgress(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.days)) return null;
  return {
    weekStarting: typeof value.weekStarting === "string" ? value.weekStarting.slice(0, 10) : "unknown",
    days: value.days.slice(0, 7).map((day) => ({
      day: String(day.day || "").slice(0, 12),
      complete: Boolean(day.complete),
      completedExercises: Array.isArray(day.completedExercises)
        ? day.completedExercises.slice(0, 8).map((exercise) => String(exercise).slice(0, 80))
        : [],
      totalExercises: Math.max(0, Math.min(8, Number(day.totalExercises) || 0)),
    })),
  };
}

function getOutputText(data) {
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .filter((item) => item.type === "output_text")
    .map((item) => item.text)
    .join("\n");
}

export default async function gymCoachHandler(request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
  if (request.method !== "POST") return response.status(405).json({ error: "Use POST to request a progress review." });
  if (!process.env.OPENAI_API_KEY) return response.status(503).json({ error: "The gym coach is not configured yet. Add OPENAI_API_KEY to the server environment." });

  const now = Date.now();
  const ip = request.headers["x-forwarded-for"]?.split(",")[0]?.trim() || request.socket?.remoteAddress || "unknown";
  const recentRequests = (requestTimesByIp.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (recentRequests.length >= 5) return response.status(429).json({ error: "Please wait a few minutes before requesting another review." });
  recentRequests.push(now);
  requestTimesByIp.set(ip, recentRequests);

  const progress = cleanProgress(request.body?.progress);
  if (!progress) return response.status(400).json({ error: "Workout progress is missing or invalid." });

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        store: false,
        max_output_tokens: 650,
        input: [
          {
            role: "system",
            content: "You are FORM's supportive general fitness progress coach. Review only the supplied workout completion data. This is a fixed personal plan: do not change its listed exercises or sets, and suggest at most one optional addition to the person's tracking or recovery habits, not extra hard exercises. The data contains check-offs only, not weights, effort, soreness, or prior weeks; say so when relevant and never infer strength gains or missed sessions from incomplete data. Give gentle, practical, non-medical suggestions. Never diagnose, prescribe, or change asthma care. Return only valid JSON with keys: headline (string), observations (array of at most 2 short strings), nextSteps (array of at most 3 short strings), addNext (one short optional suggestion). Keep the tone calm, encouraging, and specific."
          },
          {
            role: "user",
            content: `Review this week's workout check-offs and suggest a useful next step.\n${JSON.stringify(progress)}`,
          },
        ],
        text: { format: { type: "json_object" } },
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error("Gym coach request failed:", upstream.status, data.error?.message || "OpenAI API error");
      return response.status(upstream.status === 429 ? 503 : 502).json({ error: "The coach could not review this progress right now. Please try again shortly." });
    }

    const text = getOutputText(data);
    const review = JSON.parse(text);
    return response.status(200).json({
      headline: String(review.headline || "A steady week, one session at a time.").slice(0, 180),
      observations: Array.isArray(review.observations) ? review.observations.slice(0, 2).map((item) => String(item).slice(0, 240)) : [],
      nextSteps: Array.isArray(review.nextSteps) ? review.nextSteps.slice(0, 3).map((item) => String(item).slice(0, 240)) : [],
      addNext: String(review.addNext || "Consider noting your working weights next time.").slice(0, 240),
    });
  } catch (error) {
    console.error("Gym coach request failed:", error.message);
    return response.status(502).json({ error: "The coach could not review this progress right now. Please try again shortly." });
  }
}
