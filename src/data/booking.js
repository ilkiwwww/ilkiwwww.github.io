// «Book a call» (BookCall.jsx): слоти, доступність і відправка заявки.
// Слоти задані за часом агенції (Київ) і показуються в часовому поясі відвідувача.
// ЗАГЛУШКА: `submitBooking()` нікуди не відправляє заявку. Щоб підключити, замінити тіло
// на запит до серверної функції (пошта / календар / Firestore) — інтерфейс не зміниться.
export const AGENCY_TZ = "Europe/Kyiv";
export const SLOT_TIMES = ["11:00", "13:00", "13:30", "14:00"];
export const DURATION_MIN = 30;
// Контактна особа в попапі (ContactCard.jsx). Пошта, LinkedIn і пункти — заглушки.
export const SALES = {
  name: "Alina Mashtalier",
  role: "Sales Manager",
  photo: "/team/alina-mashtalier.png",
  email: "hello@emote.agency",
  linkedin: "#",
  perks: ["We reply within 12 hours", "We sign an NDA if you ask", "Your first call is free"],
};
export const SERVICE_OPTIONS = ["Design", "Branding", "Illustration", "Motion", "Development"];
export const BUDGET_OPTIONS = ["under 10K", "10K—50K", "over 50K"];

// Різниця «час у поясі tz» мінус UTC для моменту `date`, у мс.
function tzOffsetMs(date, tz) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second) - date.getTime();
}

// Момент часу «рік-місяць-день hh:mm за Києвом».
function agencyInstant(y, m, d, hh, mm) {
  const guess = new Date(Date.UTC(y, m, d, hh, mm));
  return new Date(guess.getTime() - tzOffsetMs(guess, AGENCY_TZ));
}

// Слоти дня: лише майбутні (з запасом у годину). Повертає Date[] (моменти початку).
export function slotsFor(y, m, d) {
  const dow = new Date(Date.UTC(y, m, d)).getUTCDay();
  if (dow === 0 || dow === 6) return [];
  const min = Date.now() + 60 * 60 * 1000;
  return SLOT_TIMES.map((t) => agencyInstant(y, m, d, +t.slice(0, 2), +t.slice(3))).filter((i) => i.getTime() > min);
}

export const isBookable = (y, m, d) => slotsFor(y, m, d).length > 0;

export function formatTime(date, hour12) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12 }).format(date);
}

// «Kyiv (GMT+3)» — часовий пояс відвідувача.
export function timezoneLabel() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || AGENCY_TZ;
  const offset = new Intl.DateTimeFormat("en", { timeZoneName: "shortOffset" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value ?? "";
  const city = tz.split("/").pop().replace(/_/g, " ").replace("Kiev", "Kyiv");
  return `${city} (${offset})`;
}

// Форма на сторінці /contact (ContactPage.jsx). Також заглушка: нікуди не відправляє.
export function submitInquiry(inquiry) {
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true, inquiry }), 700));
}

export function submitBooking(booking) {
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true, booking }), 700));
}
