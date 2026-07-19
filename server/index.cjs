const express = require("express");
const path = require("node:path");
const fsSync = require("node:fs");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const { portfolio } = require("./portfolio-data.cjs");

loadEnvFile(path.join(__dirname, "..", ".env"));

const app = express();
const port = Number(process.env.PORT || 5000);
const messagesFile = path.join(__dirname, "messages.json");
const clientDist = path.join(__dirname, "..", "dist");
const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "zector-portfolio-api" });
});

app.get("/api/portfolio", (_req, res) => {
  res.json(portfolio);
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const submission = {
    id: crypto.randomUUID(),
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
    createdAt: new Date().toISOString()
  };

  try {
    if (googleSheetWebhookUrl) {
      await sendToGoogleSheet(submission);
      await saveLocalBackup(submission).catch((error) => {
        console.warn("Contact was sent, but local backup failed", error);
      });

      return res.status(201).json({
        ok: true,
        destination: "google-sheet",
        message: "Message sent successfully. I'll get back to you soon."
      });
    }

    await saveLocalBackup(submission);

    res.status(201).json({
      ok: true,
      destination: "local-file",
      message: "Message sent successfully. I'll get back to you soon."
    });
  } catch (error) {
    console.error("Unable to save contact submission", error);
    res.status(500).json({ error: "Unable to send the message right now." });
  }
});

async function saveLocalBackup(submission) {
  const existing = await fs
    .readFile(messagesFile, "utf8")
    .then((raw) => JSON.parse(raw))
    .catch(() => []);

  existing.push(submission);
  await fs.writeFile(messagesFile, JSON.stringify(existing, null, 2));
}

async function sendToGoogleSheet(submission) {
  const body = new URLSearchParams({
    Name: submission.name,
    Email: submission.email,
    Message: submission.message,
    Timestamp: submission.createdAt
  });

  const response = await fetch(googleSheetWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    throw new Error(`Google Sheet webhook failed with status ${response.status}`);
  }
}

app.use(express.static(clientDist));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(clientDist, "index.html"), (error) => {
    if (error) {
      res
        .status(200)
        .send("API is running. Build the React app with `npm run build` to serve the portfolio here.");
    }
  });
});

app.listen(port, () => {
  console.log(`Portfolio API running at http://localhost:${port}`);
});

function loadEnvFile(filePath) {
  if (!fsSync.existsSync(filePath)) {
    return;
  }

  const lines = fsSync.readFileSync(filePath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}
