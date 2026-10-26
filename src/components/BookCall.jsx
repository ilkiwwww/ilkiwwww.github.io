import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BUDGET_OPTIONS, DURATION_MIN, SERVICE_OPTIONS, formatTime, isBookable, slotsFor, submitBooking, timezoneLabel } from "../data/booking.js";
import ContactCard from "./ContactCard.jsx";
import Button from "./ui/Button.jsx";
import Calendar from "./ui/Calendar.jsx";
import IconButton from "./ui/IconButton.jsx";
import { ArrowIcon } from "./ui/icons.jsx";
import Text from "./ui/Text.jsx";
import TextField from "./ui/TextField.jsx";

// «Book a call»: попап запису на 30-хвилинний дзвінок. Ліворуч постійна картка з Alina (Sales),
// праворуч кроки: календар і слоти (окремі панелі), далі форма (послуги, бюджет, ім'я, пошта, опис) і «Confirm».
// Відкривається подією з openBookCall() — з будь-якої кнопки «Book a call» / «Start a project».
// Затемнення сторінки (чорний 70%), картка `fill` з прямими кутами. Esc, хрестик, клік по фону
// закривають. Заявка поки нікуди не йде (див. data/booking.js).
const EVENT = "emote:book-call";
export const openBookCall = () => window.dispatchEvent(new Event(EVENT));

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateLabel = (s) => new Date(s.y, s.m, s.d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

function Modal({ onClose }) {
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [day, setDay] = useState(null); // { y, m, d }
  const [slot, setSlot] = useState(null); // Date
  const [hour12, setHour12] = useState(false);
  const [step, setStep] = useState("pick"); // pick | form | done
  const [services, setServices] = useState([]);
  const [budget, setBudget] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", about: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const tz = useMemo(timezoneLabel, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [onClose]);

  const slots = day ? slotsFor(day.y, day.m, day.d) : [];
  const canPrev = view.y > now.getFullYear() || view.m > now.getMonth();
  const shift = (delta) => setView((v) => {
    const d = new Date(v.y, v.m + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const toggleService = (s) => setServices((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function confirm(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!EMAIL.test(form.email.trim())) next.email = "Please enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    await submitBooking({ start: slot.toISOString(), services, budget, ...form });
    setSending(false);
    setStep("done");
  }

  const end = slot && new Date(slot.getTime() + DURATION_MIN * 60 * 1000);

  const PANE = "bg-fill p-5 md:p-6";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true" aria-label="Book a call">
      <div className="modal-fade absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      {/* Картка 960×640 однакова на всіх кроках: ліворуч контакт, праворуч панелі кроку. */}
      <div className="modal-card relative flex max-h-full w-full max-w-240 gap-3 overflow-hidden bg-canvas p-2 md:h-160">
        <ContactCard className="hidden md:flex md:w-78 md:shrink-0" />

        {/* data-lenis-prevent: плавний скрол сторінки не перехоплює колесо всередині вікна. */}
        <div data-lenis-prevent className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto">
          {step === "pick" && (
            <>
              <section className={PANE}>
                <Calendar
                  year={view.y}
                  month={view.m}
                  selected={day}
                  isEnabled={isBookable}
                  onSelect={(d) => {
                    setDay(d);
                    setSlot(null);
                  }}
                  onPrev={() => shift(-1)}
                  onNext={() => shift(1)}
                  canPrev={canPrev}
                />
              </section>
              <section className={`${PANE} flex flex-col gap-6`}>
                {day ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <Text size="quote" as="h3">
                        {new Date(day.y, day.m, day.d).toLocaleDateString("en-US", { weekday: "short" })} <span className="text-secondary">{day.d}</span>
                      </Text>
                      <div className="flex gap-2" role="group" aria-label="Time format">
                        <Button variant="outline" size="sm" active={hour12} onClick={() => setHour12(true)}>
                          12h
                        </Button>
                        <Button variant="outline" size="sm" active={!hour12} onClick={() => setHour12(false)}>
                          24h
                        </Button>
                      </div>
                    </div>
                    <Text size="dense" tone="secondary" uppercase>
                      {tz}
                    </Text>
                    <ul className="flex flex-wrap gap-2">
                      {slots.map((t) => (
                        <li key={t.toISOString()}>
                          <Button
                            variant="outline"
                            size="md"
                            onClick={() => {
                              setSlot(t);
                              setStep("form");
                            }}
                          >
                            {formatTime(t, hour12)}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Text tone="secondary">Select a date to see available times.</Text>
                )}
              </section>
            </>
          )}

          {step === "form" && (
            <form id="book-form" onSubmit={confirm} noValidate className="contents">
            <section className={`${PANE} flex flex-col gap-8`}>
              <div className="flex items-center gap-4">
                <IconButton label="Back" onClick={() => setStep("pick")}>
                  <ArrowIcon className="h-6 w-6 rotate-180" />
                </IconButton>
                <div className="flex flex-col">
                  <Text size="lead" weight="medium">
                    {dateLabel(day)}
                  </Text>
                  <Text tone="secondary">
                    {formatTime(slot, hour12)} – {formatTime(end, hour12)} · {tz}
                  </Text>
                </div>
              </div>
                <div className="flex flex-col gap-3">
                  <Text tone="secondary">Services</Text>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OPTIONS.map((s) => (
                      <Button key={s} variant="outline" size="sm" active={services.includes(s)} aria-pressed={services.includes(s)} onClick={() => toggleService(s)}>
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Text tone="secondary">Budget in US dollars</Text>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((b) => (
                      <Button key={b} variant="outline" size="sm" active={budget === b} aria-pressed={budget === b} onClick={() => setBudget(budget === b ? null : b)}>
                        {b}
                      </Button>
                    ))}
                  </div>
                </div>
            </section>
            <section className={`${PANE} flex flex-col gap-8`}>
                <div className="grid gap-8 md:grid-cols-2 md:gap-6">
                  <TextField label="Name" value={form.name} onChange={set("name")} invalid={!!errors.name} hint={errors.name} autoComplete="name" />
                  <TextField label="Email" type="email" value={form.email} onChange={set("email")} invalid={!!errors.email} hint={errors.email} autoComplete="email" />
                </div>
                <TextField label="Project details (optional)" multiline value={form.about} onChange={set("about")} />
                <div className="flex flex-col gap-4">
                  <Text size="dense" tone="secondary">
                    By submitting, you agree to our Privacy Policy.
                  </Text>
                  <Button variant="light" size="md" className="w-full" type="submit" disabled={sending}>
                    {sending ? "Sending…" : "Confirm"}
                  </Button>
                </div>
            </section>
            </form>
          )}

          {step === "done" && (
            <section className={`${PANE} flex flex-col gap-6`}>
              <Text size="quote">Thank you, {form.name.trim().split(" ")[0]}.</Text>
              <Text size="lead" tone="secondary">
                We will confirm {dateLabel(day)} at {formatTime(slot, hour12)}, {tz}, by email: {form.email.trim()}.
              </Text>
              <div>
                <Button variant="light" size="md" onClick={onClose}>
                  Done
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookCall() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(EVENT, show);
    return () => window.removeEventListener(EVENT, show);
  }, []);
  return open ? createPortal(<Modal onClose={() => setOpen(false)} />, document.body) : null;
}
