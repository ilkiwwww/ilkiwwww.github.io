import { useState } from "react";
import { BUDGET_OPTIONS, SERVICE_OPTIONS, submitInquiry } from "../data/booking.js";
import { openBookCall } from "./BookCall.jsx";
import ContactCard from "./ContactCard.jsx";
import Button from "./ui/Button.jsx";
import { InView, Rise } from "./ui/Motion.jsx";
import Section from "./ui/Section.jsx";
import Text from "./ui/Text.jsx";
import TextField from "./ui/TextField.jsx";
import Page from "./Page.jsx";

// Сторінка «Contact» (/contact, Figma node 40002379:273): без видимого заголовка; ліворуч контактна особа (та сама
// `ContactCard`, що в попапі «Book a call»), праворуч форма запиту — послуги й бюджет чіпами, назва компанії, пошта, опис.
// Заявка поки нікуди не йде (`submitInquiry()` у data/booking.js — заглушка). Без фінального CTA — лише футер (`Page cta={false}`).
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Chips({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Button key={o} variant="outline" size="sm" active={selected.includes(o)} aria-pressed={selected.includes(o)} onClick={() => onToggle(o)}>
          {o}
        </Button>
      ))}
    </div>
  );
}

export default function ContactPage() {
  const [services, setServices] = useState([]);
  const [budget, setBudget] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", about: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const toggleService = (s) => setServices((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!EMAIL.test(form.email.trim())) next.email = "Please enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    await submitInquiry({ services, budget: budget ? [budget] : [], ...form });
    setSending(false);
    setDone(true);
  }

  return (
    <Page cta={false}>
      <Section rhythm="compact" aria-labelledby="contact-title">
        <h1 id="contact-title" className="sr-only">
          Contact
        </h1>
        {/* Figma: узка колонка контакту (1/3) і форма (2/3) по центру, між ними 12. */}
        <div className="mx-auto grid max-w-254 gap-3 lg:grid-cols-3">
          <InView>
            <Rise fill>
              <ContactCard outlined className="flex h-full" />
            </Rise>
          </InView>

          <InView className="lg:col-span-2">
            <Rise delay={0.1} fill>
              {done ? (
                <div className="flex h-full flex-col gap-6 bg-fill p-6 md:p-8">
                  <Text size="quote">Thank you, {form.name.trim().split(" ")[0]}.</Text>
                  <Text size="lead" tone="secondary">
                    We got your message and will reply to {form.email.trim()} within 12 hours.
                  </Text>
                  <div>
                    <Button variant="outline" size="md" onClick={openBookCall}>
                      Book a call instead
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="flex h-full flex-col gap-8 bg-fill p-6 md:p-8">
                  <div className="flex flex-col gap-3">
                    <Text tone="secondary">Services</Text>
                    <Chips options={SERVICE_OPTIONS} selected={services} onToggle={toggleService} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Text tone="secondary">Budget in US dollars</Text>
                    <Chips options={BUDGET_OPTIONS} selected={budget ? [budget] : []} onToggle={(b) => setBudget(budget === b ? null : b)} />
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 md:gap-6">
                    <TextField label="Company name" value={form.name} onChange={set("name")} invalid={!!errors.name} hint={errors.name} autoComplete="name" />
                    <TextField label="Email" type="email" value={form.email} onChange={set("email")} invalid={!!errors.email} hint={errors.email} autoComplete="email" />
                  </div>
                  <TextField label="Project details (optional)" multiline value={form.about} onChange={set("about")} />
                  <Button variant="light" size="md" className="w-full" type="submit" disabled={sending}>
                    {sending ? "Sending…" : "Send message"}
                  </Button>
                </form>
              )}
            </Rise>
          </InView>
        </div>
      </Section>
    </Page>
  );
}
