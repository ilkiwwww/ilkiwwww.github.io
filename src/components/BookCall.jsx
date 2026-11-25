import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BOOKING_EMBED_URL, BOOKING_URL } from "../data/booking.js";
import ContactCard from "./ContactCard.jsx";
import Button from "./ui/Button.jsx";
import Text from "./ui/Text.jsx";

// «Book a call»: попап запису на 30-хвилинний дзвінок. Ліворуч постійна картка з Alina (Sales),
// праворуч вбудована сторінка запису Google Calendar (слоти, вибір часу, підтвердження й лист
// робить Google; бронювання зберігаються в календарі агенції). Посилання — BOOKING_URL у data/booking.js.
// Відкривається подією з openBookCall() — з будь-якої кнопки «Book a call» / «Start a project».
// Затемнення сторінки (чорний 70%), картка `canvas` з прямими кутами. Esc і клік по фону закривають.
const EVENT = "emote:book-call";
export const openBookCall = () => window.dispatchEvent(new Event(EVENT));

function Modal({ onClose }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true" aria-label="Book a call">
      <div className="modal-fade absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      {/* Картка 960×640: ліворуч контакт, праворуч сторінка запису Google. */}
      <div className="modal-card relative flex h-full max-h-160 w-full max-w-240 gap-3 overflow-hidden bg-canvas p-2">
        <ContactCard className="hidden md:flex md:w-78 md:shrink-0" />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          <iframe src={BOOKING_EMBED_URL} title="Book a call" className="min-h-0 w-full flex-1 bg-primary" />
          <div className="flex items-center justify-between gap-4 bg-fill px-4 py-3">
            <Text size="dense" tone="secondary">
              Not loading?
            </Text>
            <Button variant="outline" size="sm" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              Open in a new tab
            </Button>
          </div>
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
