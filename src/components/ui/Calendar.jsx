import IconButton from "./IconButton.jsx";
import { ArrowIcon } from "./icons.jsx";
import Text from "./Text.jsx";

// Календар місяця для «Book a call»: заголовок із місяцем (рік сірим), стрілки, дні тижня
// й сітка днів (з понеділка). День — доступний (контур), вибраний (білий), недоступний
// (сірий, без контуру). Єдине місце з клікабельними клітинками дат.
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CELL = "flex h-12 w-full items-center justify-center rounded-control border text-16 leading-6 outline-offset-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary";
const LOOK = {
  available: "cursor-pointer border-tertiary text-primary hover:border-primary",
  selected: "cursor-pointer border-primary bg-primary text-black",
  off: "cursor-not-allowed border-transparent text-secondary",
};

export default function Calendar({ year, month, selected, isEnabled, onSelect, onPrev, onNext, canPrev }) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // порожніх клітинок до першого числа (пн = 0)
  const days = new Date(year, month + 1, 0).getDate();
  const monthName = first.toLocaleString("en-US", { month: "long" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Text size="quote" as="h3">
          {monthName} <span className="text-secondary">{year}</span>
        </Text>
        <div className="flex gap-2">
          <IconButton label="Previous month" onClick={onPrev} disabled={!canPrev}>
            <ArrowIcon className="h-6 w-6 rotate-180" />
          </IconButton>
          <IconButton label="Next month" onClick={onNext}>
            <ArrowIcon className="h-6 w-6" />
          </IconButton>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((w) => (
          <Text key={w} as="span" size="dense" tone="secondary" uppercase className="pb-2 text-center">
            {w}
          </Text>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`lead-${i}`} aria-hidden="true" />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1;
          const enabled = isEnabled(year, month, d);
          const isSel = selected && selected.y === year && selected.m === month && selected.d === d;
          return (
            <button
              key={d}
              type="button"
              disabled={!enabled}
              aria-pressed={isSel || undefined}
              onClick={() => onSelect({ y: year, m: month, d })}
              className={`${CELL} ${isSel ? LOOK.selected : enabled ? LOOK.available : LOOK.off}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
