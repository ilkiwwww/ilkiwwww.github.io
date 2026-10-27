import { useEffect, useRef, useState } from "react";
import { CATEGORIES, PROCESS, SERVICES_INTRO } from "../data/servicePages.js";
import { openBookCall } from "./BookCall.jsx";
import Button from "./ui/Button.jsx";
import Eyebrow from "./ui/Eyebrow.jsx";
import Heading from "./ui/Heading.jsx";
import Media from "./ui/Media.jsx";
import { InView, Rise } from "./ui/Motion.jsx";
import ScrollHeading from "./ui/ScrollHeading.jsx";
import Section from "./ui/Section.jsx";
import SectionLabel from "./ui/SectionLabel.jsx";
import Text from "./ui/Text.jsx";
import Page from "./Page.jsx";

// Сторінка «Services» (/services, Figma макет поки не готів). UX за Metalab паттерном —
// Split (D): назви категорій великим текстом ліворуч, праворуч липка панель `fill` з описом і
// послугами; скрол міняє категорію (блок закріплений), клік по назві гортає до неї. Дані — data/servicePages.js.
const n = (i) => String(i + 1).padStart(2, "0");

function CategoriesSection() {
  const [active, setActive] = useState(0);
  const track = useRef(null);
  const cat = CATEGORIES[active];

  // lg+: блок закріплений, а скрол сторінки перемикає категорії (вміст не рухається).
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 64rem)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!lg.matches || !track.current) return;
      const { top, height } = track.current.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -top / (height - window.innerHeight)));
      setActive(Math.min(CATEGORIES.length - 1, Math.floor(p * CATEGORIES.length)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Клік по назві: на lg гортає до її відрізка, нижче lg — просто міняє панель.
  const select = (i) => {
    if (window.matchMedia("(min-width: 64rem)").matches && track.current) {
      const { top, height } = track.current.getBoundingClientRect();
      const span = height - window.innerHeight;
      window.scrollTo({ top: window.scrollY + top + ((i + 0.5) / CATEGORIES.length) * span, behavior: "smooth" });
    } else {
      setActive(i);
    }
  };

  return (
    <div ref={track} className="services-track">
      <div className="services-stage grid gap-16 lg:grid-cols-2">
      <div className="flex flex-col" role="tablist" aria-label="Service categories">
        {CATEGORIES.map((c, i) => (
          <InView key={c.slug} className="border-t border-tertiary last:border-b">
            <button
              type="button"
              role="tab"
              id={`svc-${c.slug}`}
              aria-selected={active === i}
              onClick={() => select(i)}
              className="flex w-full items-baseline justify-between gap-6 py-5 text-left outline-offset-4"
            >
              <Heading as="span" level="statement" tone={active === i ? "primary" : "tertiary"} className="transition-colors duration-300">
                {c.name}
              </Heading>
              <Text as="span" size="dense" weight="medium" uppercase tone="secondary">
                {n(i)}
              </Text>
            </button>
          </InView>
        ))}
      </div>

      <aside className="flex flex-col gap-4 self-start bg-fill p-6 lg:h-full lg:self-stretch" aria-live="polite">
        <Media key={cat.slug} src={`/services/categories/${cat.slug}.png`} label={cat.name} alt={cat.name} className="h-50 w-full lg:h-auto lg:min-h-0 lg:flex-1" />
        <Text as="h3" size="quote">
          {cat.title}
        </Text>
        <Text size="lead" tone="secondary">
          {cat.lead}
        </Text>
        <Text size="dense" weight="medium" uppercase tone="secondary">
          {cat.range}
        </Text>
        <ul>
          {cat.items.map(([name, text]) => (
            <li key={name} className="flex flex-col gap-1 border-t border-tertiary py-2">
              <Text size="lead" weight="medium">
                {name}
              </Text>
              <Text size="body" tone="secondary">
                {text}
              </Text>
            </li>
          ))}
        </ul>
        <Button variant="light" size="md" className="self-start" onClick={openBookCall}>
          {cat.cta}
        </Button>
      </aside>
      </div>
    </div>
  );
}

function Process() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <ScrollHeading id="process-title" lines={PROCESS.title} />
        <InView>
          <Rise delay={0.1}>
            <Button variant="outline" size="md" onClick={openBookCall}>
              {PROCESS.cta}
            </Button>
          </Rise>
        </InView>
      </div>
      <ul className="mt-16 border-t border-tertiary">
        {PROCESS.steps.map(([title, text], i) => (
          <li key={title} className="how-row border-b border-tertiary" data-open={open === i || undefined}>
            {/* Невидима обгортка рядка акордеону: вигляд задають лише Text усередині. */}
            <button type="button" onClick={() => setOpen(i)} aria-expanded={open === i} className="flex w-full items-baseline gap-6 py-6 text-left outline-offset-4">
              <Text size="dense" tone="secondary" className="w-8 shrink-0">
                {n(i)}
              </Text>
              <Text size="quote" tone={open === i ? "primary" : "secondary"} className="transition-colors duration-300">
                {title}
              </Text>
            </button>
            <div className="how-body">
              <div>
                <Text size="lead" tone="secondary" className="max-w-160 pb-6 pl-14">
                  {text}
                </Text>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ServicesPage() {
  return (
    <Page>
      <Section rhythm="top" aria-labelledby="services-title">
        <InView className="flex flex-col gap-10">
          <Rise bleed>
            <Heading id="services-title" level="display" as="h1">
              {SERVICES_INTRO.title}
            </Heading>
          </Rise>
        </InView>
        <InView className="mt-10">
          <Rise delay={0.2}>
            <Text size="lead" tone="secondary" className="max-w-160">
              {SERVICES_INTRO.text}
            </Text>
          </Rise>
        </InView>
      </Section>

      <Section aria-label="What we do">
        <CategoriesSection />
      </Section>

      <Section aria-labelledby="process-title">
        <SectionLabel>{PROCESS.label}</SectionLabel>
        <div className="mt-10">
          <Process />
        </div>
      </Section>
    </Page>
  );
}
