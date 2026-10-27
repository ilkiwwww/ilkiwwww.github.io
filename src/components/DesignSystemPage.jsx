import Button from "./ui/Button.jsx";
import Eyebrow from "./ui/Eyebrow.jsx";
import Heading from "./ui/Heading.jsx";
import IconButton from "./ui/IconButton.jsx";
import { ArrowIcon } from "./ui/icons.jsx";
import Section from "./ui/Section.jsx";
import Select from "./ui/Select.jsx";
import Text from "./ui/Text.jsx";

// Довідник дизайн-системи (/design-system): усе зібрано з тих самих примітивів
// і токенів, що й сайт, тож завжди збігається з тим, що є в коді.
const COLORS = [
  { group: "Кольори", token: "primary", value: "#FFFFFF", role: "основний текст, світла кнопка", swatch: "bg-primary" },
  { group: "Кольори", token: "secondary", value: "#999999", role: "другорядний текст", swatch: "bg-secondary" },
  { group: "Кольори", token: "tertiary", value: "#242424", role: "усі лінії й контури", swatch: "bg-tertiary" },
  { group: "Фони", token: "black", value: "#000000", role: "фон секцій; текст на білій кнопці", swatch: "bg-black" },
  { group: "Фони", token: "canvas", value: "#0D0D0F", role: "фон сторінки", swatch: "bg-canvas" },
  { group: "Фони", token: "fill", value: "#141414", role: "заливка: картки, плейсхолдери, hover рядка", swatch: "bg-fill" },
];

const HEADINGS = [
  ["display", "h1 Work і кейсу, фінальний CTA", "Instrument Sans Medium 56 → 140"],
  ["statement", "Теза секції, цифри, назва кейсу в Hero", "Instrument Sans Medium 40 → 64"],
];

const TEXTS = [
  ["quote", "Цитата у відгуку", "Inter 20 → 28"],
  ["lead", "Вступне речення, назви рядків (Medium)", "Inter 16 → 20"],
  ["body", "Звичайний текст", "Inter 16 / 24"],
  ["dense", "Підписи, legal (Medium + uppercase)", "Inter 12 / 16"],
];

const RADII = [
  ["radius-control", "9999px — усі кнопки, таби, чіпи", "rounded-control"],
];

function Block({ title, children }) {
  return (
    <section className="flex flex-col gap-8 border-t border-tertiary pt-10">
      <Eyebrow>{title}</Eyebrow>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main>
      <Section rhythm="top">
        <div className="flex flex-col gap-16">
          <Heading level="statement" tone="primary">
            Design system
          </Heading>

          <Block title="Кольори">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {COLORS.map((c) => (
                <div key={c.token} className="flex flex-col gap-3">
                  <div className={`h-24 w-full border border-tertiary ${c.swatch}`} />
                  <div className="flex flex-col gap-1">
                    <Text size="body" tone="primary" weight="medium">
                      {c.token}
                    </Text>
                    <Text size="dense" tone="secondary">
                      {c.value}
                    </Text>
                    <Text size="dense" tone="secondary">
                      {c.role}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Шрифти">
            <div className="flex flex-col gap-4">
              <Text size="lead" tone="primary">
                Instrument Sans — заголовки (<span className="font-display">Aa Bb Cc 0123</span>) · Inter — все інше (Aa Bb Cc 0123)
              </Text>
            </div>
          </Block>

          <Block title="Заголовки — Heading">
            <div className="flex flex-col gap-12">
              {HEADINGS.map(([level, use, spec]) => (
                <div key={level} className="flex flex-col gap-3">
                  <Text size="dense" tone="secondary">
                    level="{level}" · {use} · {spec}
                  </Text>
                  <Heading level={level} as="p" tone="primary">
                    Let’s make it work
                  </Heading>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Текст — Text">
            <div className="flex flex-col gap-8">
              {TEXTS.map(([size, use, spec]) => (
                <div key={size} className="flex flex-col gap-2">
                  <Text size="dense" tone="secondary">
                    size="{size}" · {use} · {spec}
                  </Text>
                  <Text size={size} tone="primary">
                    Design that works as hard as your product does.
                  </Text>
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <Text size="dense" tone="secondary">
                  Eyebrow 16 · uppercase
                </Text>
                <Eyebrow>Eyebrow label</Eyebrow>
              </div>
            </div>
          </Block>

          <Block title="Кнопки — Button, IconButton, Select">
            <div className="flex flex-col gap-6">
              {["light", "outline"].map((v) => (
                <div key={v} className="flex flex-wrap items-center gap-4">
                  <Text size="dense" tone="secondary" className="w-36">
                    {v}
                  </Text>
                  <Button variant={v} size="sm">
                    sm · 36
                  </Button>
                  <Button variant={v} size="md">
                    md · 48
                  </Button>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-4">
                <Text size="dense" tone="secondary" className="w-36">
                  IconButton
                </Text>
                <IconButton label="Приклад">
                  <ArrowIcon />
                </IconButton>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Text size="dense" tone="secondary" className="w-36">
                  Select
                </Text>
                <Select label="Приклад">
                  <option className="bg-fill">Industry</option>
                </Select>
              </div>
            </div>
          </Block>

          <Block title="Скруглення">
            <div className="flex flex-wrap gap-8">
              {RADII.map(([name, note, cls]) => (
                <div key={name} className="flex flex-col gap-3">
                  <div className={`h-24 w-48 border border-primary ${cls}`} />
                  <Text size="dense" tone="secondary">
                    {name} · {note}
                  </Text>
                </div>
              ))}
            </div>
          </Block>
        </div>
      </Section>
    </main>
  );
}
