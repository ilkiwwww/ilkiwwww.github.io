import { useState } from "react";
import { SALES } from "../data/booking.js";
import Button from "./ui/Button.jsx";
import { CheckIcon, LinkedinIcon, MailIcon } from "./ui/icons.jsx";
import Media from "./ui/Media.jsx";
import Text from "./ui/Text.jsx";

// Контактна особа поруч із формою «Book a call»: фото, ім'я й роль, що ми обіцяємо
// (галочки), пошта для проєктів (клік копіює) і LinkedIn. Дані — SALES у data/booking.js.
// `outlined` — без заливки, лише контур `tertiary` (сторінка Contact: поруч із карткою форми).
export default function ContactCard({ outlined = false, className = "" }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(SALES.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${SALES.email}`;
    }
  }
  return (
    <aside className={`flex flex-col gap-8 p-6 ${outlined ? "border border-tertiary" : "bg-fill"} ${className}`}>
      <div className="flex flex-col gap-4">
        <Media round src={SALES.photo} label={SALES.name} alt={SALES.name} className="h-20 w-20 shrink-0" />
        <div className="flex flex-col">
          <Text size="quote">{SALES.name}</Text>
          <Text tone="secondary">{SALES.role}</Text>
        </div>
      </div>
      <ul className="flex flex-col gap-4">
        {SALES.perks.map((p) => (
          <li key={p} className="flex items-start gap-3">
            <CheckIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <Text>{p}</Text>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-3">
        <Button variant="outline" size="md" className="w-full" onClick={copy}>
          <MailIcon />
          {copied ? "Copied" : SALES.email}
        </Button>
        <Button href={SALES.linkedin} variant="outline" size="md" className="w-full">
          <LinkedinIcon />
          Alina on LinkedIn
        </Button>
      </div>
    </aside>
  );
}
