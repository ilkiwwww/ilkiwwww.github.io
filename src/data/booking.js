// «Book a call» (BookCall.jsx): сторінка запису Google Calendar агенції, вбудована в попап.
// Слоти, підтвердження й листи веде Google; бронювання лежать у календарі агенції.
export const BOOKING_URL = "https://calendar.app.google/wD39f5fyMaEnfnNj9";
export const BOOKING_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1zUCottpArnjx1xwhxOzmR4cJM6stDYeBsycO79sgn6Ka9X0KJNBxnrhl8dQOWSmg4x4cBYPih?gv=true";
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

// Форма на сторінці /contact (ContactPage.jsx): заявка пишеться в Firestore (колекція project_leads, див. firestore.rules).
// Firebase підвантажується лише при відправці, щоб не обтяжувати решту сайту.
export async function submitInquiry({ services, budget, name, email, about }) {
  const { saveLead } = await import("../lib/leads.js");
  const lead = { email: email.trim(), name: name.trim(), services, source: "contact" };
  if (budget[0]) lead.budget = budget[0];
  if (about.trim()) lead.message = about.trim();
  await saveLead(lead);
}
