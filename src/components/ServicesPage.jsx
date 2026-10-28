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
import Text from "./ui/Text.jsx";
import Page from "./Page.jsx";

// Сторінка «Services» (/services, Figma макет поки не готів). UX за Metalab паттерном —
// Split (D): назви категорій великим текстом ліворуч, праворуч липка панель `fill` з описом і
// послугами; скрол міняє категорію (блок закріплений), клік по назві гортає до неї. Дані — data/servicePages.js.
const n = (i) => String(i + 1).padStart(2, "0");

// lg+: блок закріплений (`.pin-track` / `.pin-stage`), а скрол сторінки перемикає крок (вміст не рухається).
// Нижче lg — звичайний список, крок міняє клік. Клік на lg гортає до відрізка кроку.
function usePinnedStep(count) {
  const [active, setActive] = useState(0);
  const track = useRef(null);

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 64rem)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!lg.matches || !track.current) return;
      const { top, height } = track.current.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -top / (height - window.innerHeight)));
      setActive(Math.min(count - 1, Math.floor(p * count)));
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
  }, [count]);

  const select = (i) => {
    if (window.matchMedia("(min-width: 64rem)").matches && track.current) {
      const { top, height } = track.current.getBoundingClientRect();
      const span = height - window.innerHeight;
      window.scrollTo({ top: window.scrollY + top + ((i + 0.5) / count) * span, behavior: "smooth" });
    } else {
      setActive(i);
    }
  };

  return { active, track, select };
}

function CategoriesSection() {
  const { active, track, select } = usePinnedStep(CATEGORIES.length);
  const cat = CATEGORIES[active];

  return (
    <div ref={track} className="pin-track">
      <div className="pin-stage grid gap-16 lg:grid-cols-2">
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

      <CategoryPanel key={cat.slug} cat={cat} />
      </div>
    </div>
  );
}

// Панель категорії фіксованого розміру (Figma 40002496:11639 / 11603, 672×661): заголовок з описом, список підпослуг,
// кнопка. Наведення на підпослугу ділить область на дві колонки: ліворуч лишається весь список (тому видно, що є ще
// пункти, і по них можна водити далі) з кнопкою внизу, праворуч — опис наведеного пункту й два фото. Курсор пішов зі
// списку — колонка праворуч ховається, список знову на всю ширину (`.svc-*` в index.css).
function CategoryPanel({ cat }) {
  const [hover, setHover] = useState(null);
  const item = hover === null ? null : cat.items[hover];
  return (
    <aside className="flex flex-col gap-8 self-start bg-fill p-8 lg:h-165.25 lg:self-stretch" aria-live="polite">
      <div className="flex flex-col gap-4 lg:h-34">
        <Text as="h3" size="quote">
          {cat.title}
        </Text>
        <Text size="lead" tone="secondary">
          {cat.lead}
        </Text>
      </div>
      <div
        className="svc-split flex min-h-0 flex-1 gap-5 overflow-hidden"
        data-open={item ? "" : undefined}
        onMouseLeave={() => setHover(null)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHover(null)}
      >
        <div className="svc-left flex flex-col justify-between gap-8">
          <ul>
            {cat.items.map(([name], i) => (
              <li
                key={name}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onClick={() => setHover(i)}
                className="cursor-pointer border-t border-tertiary py-3 outline-offset-4"
              >
                <Text size="lead" weight="medium">
                  {name}
                </Text>
              </li>
            ))}
          </ul>
          <Button variant="light" size="md" className="self-start" onClick={openBookCall}>
            {cat.cta}
          </Button>
        </div>
        <div className="svc-right hidden flex-1 flex-col gap-4 bg-canvas p-5 lg:flex">
          {item && (
            <>
              <Text key={item[0]} size="body" tone="secondary" className="svc-fade">
                {item[1]}
              </Text>
              <div className="flex min-h-0 flex-1 gap-3">
                {[0, 1].map((k) => (
                  <div key={k} className="relative flex-1 bg-tertiary">
                    <Media fill placeholder="none" alt="" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

// «How we work» — закріплена секція «лінійка»: шість рівних етапів (без строків), вертикальний плейхед їде за скролом
// і підписаний поточним кроком, кроки — сходинками-смугами, під ними текст відкритого кроку. Скрол міняє крок,
// клік по смузі гортає до нього. Нижче lg — звичайний список на лінії (`.proc-item`), крок міняє клік.
function Process() {
  const { active, track, select } = usePinnedStep(PROCESS.steps.length);
  const [title, text] = PROCESS.steps[active];
  return (
    <div ref={track} className="pin-track">
      <div className="pin-stage flex flex-col" style={{ "--a": active }}>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Heading id="process-title" level="statement">
            {PROCESS.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Heading>
          <Button variant="outline" size="md" className="self-start" onClick={openBookCall}>
            {PROCESS.cta}
          </Button>
        </div>

        <div className="mt-16 hidden lg:block">
          <div className="proc-ruler relative h-14 border-b border-tertiary">
            <div className="grid h-full grid-cols-6 pt-2" aria-hidden="true">
              {PROCESS.steps.map(([name], i) => (
                <Text key={name} as="span" size="dense" weight="medium" uppercase tone="secondary" className="text-center">
                  {n(i)}
                </Text>
              ))}
            </div>
          </div>
          <div className="relative mt-6">
            <div className="proc-play" aria-hidden="true">
              <Text as="span" size="dense" weight="medium" uppercase className="proc-play-label">
                Step {n(active)}
              </Text>
            </div>
            <ol className="flex flex-col gap-2">
              {PROCESS.steps.map(([name], i) => (
                <li key={name} className="proc-bar relative h-10" style={{ "--k": i }} data-on={active === i || undefined} data-past={i < active || undefined}>
                  {/* Невидима обгортка смуги: вигляд задає лише `.proc-bar`. */}
                  <button type="button" onClick={() => select(i)} aria-current={active === i} className="flex size-full items-center px-6 text-left outline-offset-4">
                    <Text as="span" size="body" tone={i <= active ? "primary" : "secondary"} className="whitespace-nowrap">
                      {n(i)} · {name}
                    </Text>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-10 grid grid-cols-[200px_1fr] gap-8 border-t border-tertiary pt-8" aria-live="polite">
            <Heading as="span" level="statement" tone="tertiary">
              {n(active)}
            </Heading>
            <div key={active} className="proc-text">
              <Text size="quote">{title}</Text>
              <Text tone="secondary" className="mt-3 max-w-136">
                {text}
              </Text>
            </div>
          </div>
        </div>

        <ol className="mt-16 flex flex-col lg:hidden">
          {PROCESS.steps.map(([name, body], i) => (
            <li key={name} className="proc-item how-row" data-open={active === i || undefined} data-past={i < active || undefined} data-reached={i <= active || undefined}>
              {/* Невидима обгортка рядка: вигляд задають лише Text усередині. */}
              <button type="button" onClick={() => select(i)} aria-expanded={active === i} className="w-full py-3 text-left outline-offset-4">
                <Text size="quote" tone={active === i ? "primary" : "secondary"} className="transition-colors duration-300">
                  {name}
                </Text>
              </button>
              <div className="how-body">
                <div>
                  <Text size="body" tone="secondary" className="max-w-136 pb-3">
                    {body}
                  </Text>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
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
        {/* Три фото під вступом (Figma 40002496:11327): різна висота, вирівняні за верхом. Поки плейсхолдери. */}
        <InView className="mt-10 flex flex-col gap-3 md:flex-row md:items-start">
          <Media label="Studio" alt="" className="aspect-29/16 w-full md:flex-5" />
          <Media label="Team" alt="" className="aspect-7/10 w-full md:flex-3" />
          <Media label="Work" alt="" className="aspect-4/5 w-full md:flex-4" />
        </InView>
      </Section>

      <Section aria-label="What we do">
        <CategoriesSection />
      </Section>

      <Section aria-labelledby="process-title">
        <Text size="dense" weight="medium" uppercase tone="secondary">
          {PROCESS.label}
        </Text>
        <div className="mt-10">
          <Process />
        </div>
      </Section>
    </Page>
  );
}
