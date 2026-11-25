// Google Calendar як бекенд для попапа «Book a call». Дизайн лишається нашим:
// календар і слоти малює фронтенд, а ці функції лише віддають вільні слоти й створюють подію
// (з Google Meet та запрошенням гостю) у календарі агенції.
// Доступ — OAuth refresh token власниці календаря, лише тут як секрети (див. scripts/google-token.mjs):
//   firebase functions:secrets:set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const CLIENT_ID = defineSecret("GOOGLE_CLIENT_ID");
const CLIENT_SECRET = defineSecret("GOOGLE_CLIENT_SECRET");
const REFRESH_TOKEN = defineSecret("GOOGLE_REFRESH_TOKEN");
const SECRETS = [CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN];

// Правила слотів — ті самі, що й статичні в src/data/booking.js: будні, час за Києвом.
const AGENCY_TZ = "Europe/Kyiv";
const SLOT_TIMES = ["11:00", "13:00", "13:30", "14:00"];
const DURATION_MIN = 30;
const MIN_NOTICE_MS = 60 * 60 * 1000; // не раніше ніж за годину
const MAX_RANGE_DAYS = 62;
const ALLOWED_ORIGINS = new Set(["http://localhost:5173", "https://emoteagency.web.app"]);

const CAL = "https://www.googleapis.com/calendar/v3";
let tokenCache = { value: null, until: 0 };

async function accessToken() {
  if (tokenCache.value && Date.now() < tokenCache.until) return tokenCache.value;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID.value(),
      client_secret: CLIENT_SECRET.value(),
      refresh_token: REFRESH_TOKEN.value(),
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Google token ${res.status}: ${await res.text()}`);
  const data = await res.json();
  tokenCache = { value: data.access_token, until: Date.now() + (data.expires_in - 60) * 1000 };
  return tokenCache.value;
}

async function google(path, { method = "GET", body, params } = {}) {
  const url = new URL(CAL + path);
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw Object.assign(new Error(`Google ${res.status} ${path}: ${text}`), { status: res.status });
  return text ? JSON.parse(text) : {};
}

// «Час у поясі tz» мінус UTC для моменту `date`, у мс.
function tzOffsetMs(date, tz) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second) - date.getTime();
}

function agencyInstant(y, m, d, hh, mm) {
  const guess = new Date(Date.UTC(y, m, d, hh, mm));
  return new Date(guess.getTime() - tzOffsetMs(guess, AGENCY_TZ));
}

// Усі слоти за правилами в проміжку [from, to) — без урахування зайнятості.
function candidateSlots(from, to) {
  const out = [];
  const day = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() - 1));
  for (; day.getTime() <= to.getTime(); day.setUTCDate(day.getUTCDate() + 1)) {
    const dow = day.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    for (const t of SLOT_TIMES) {
      const start = agencyInstant(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), +t.slice(0, 2), +t.slice(3));
      if (start >= from && start < to && start.getTime() > Date.now() + MIN_NOTICE_MS) out.push(start);
    }
  }
  return out;
}

async function busyIntervals(from, to) {
  const data = await google("/freeBusy", {
    method: "POST",
    body: { timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{ id: "primary" }] },
  });
  return (data.calendars?.primary?.busy ?? []).map((b) => [new Date(b.start).getTime(), new Date(b.end).getTime()]);
}

const isFree = (start, busy) => {
  const s = start.getTime();
  const e = s + DURATION_MIN * 60 * 1000;
  return !busy.some(([bs, be]) => s < be && e > bs);
};

function cors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.has(origin)) res.set("Access-Control-Allow-Origin", origin);
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Vary", "Origin");
}

// GET ?start=<ISO>&end=<ISO> → { slots: [ISO, …] }
export const bookingSlots = onRequest({ secrets: SECRETS }, async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return void res.status(204).send("");
  try {
    const from = new Date(String(req.query.start));
    let to = new Date(String(req.query.end));
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return void res.status(400).json({ error: "Invalid range." });
    to = new Date(Math.min(to.getTime(), from.getTime() + MAX_RANGE_DAYS * 864e5));
    const slots = candidateSlots(from, to);
    if (!slots.length) return void res.json({ slots: [], durationMinutes: DURATION_MIN });
    const busy = await busyIntervals(from, to);
    res.json({ slots: slots.filter((s) => isFree(s, busy)).map((s) => s.toISOString()), durationMinutes: DURATION_MIN });
  } catch (err) {
    console.error("bookingSlots", err);
    res.status(502).json({ error: "Could not load availability." });
  }
});

// POST { start, name, email, timezone, services, budget, about } → { ok: true }
export const bookingCreate = onRequest({ secrets: SECRETS }, async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return void res.status(204).send("");
  if (req.method !== "POST") return void res.status(405).json({ error: "POST only" });
  try {
    const { start, name, email, services = [], budget, about = "" } = req.body ?? {};
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime()) || !String(name ?? "").trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? ""))) {
      return void res.status(400).json({ error: "Invalid data." });
    }
    // Бронювати можна лише слот за нашими правилами й лише якщо він ще вільний.
    const end = new Date(startDate.getTime() + DURATION_MIN * 60 * 1000);
    const allowed = candidateSlots(startDate, end).some((s) => s.getTime() === startDate.getTime());
    if (!allowed) return void res.status(409).json({ error: "This time is not available." });
    const busy = await busyIntervals(startDate, end);
    if (!isFree(startDate, busy)) return void res.status(409).json({ error: "This time was just taken." });

    const cleanName = String(name).trim().slice(0, 120);
    const details = [services.length && `Services: ${services.join(", ")}`, budget && `Budget: ${budget}`, about && `Details: ${String(about).slice(0, 2000)}`].filter(Boolean).join("\n");
    await google("/calendars/primary/events", {
      method: "POST",
      params: { conferenceDataVersion: "1", sendUpdates: "all" },
      body: {
        summary: `Intro call: ${cleanName}`,
        description: details,
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: end.toISOString() },
        attendees: [{ email: String(email).trim(), displayName: cleanName }],
        conferenceData: { createRequest: { requestId: `emote-${startDate.getTime()}-${Math.random().toString(36).slice(2, 8)}`, conferenceSolutionKey: { type: "hangoutsMeet" } } },
      },
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("bookingCreate", err);
    res.status(502).json({ error: "Could not book this time." });
  }
});
