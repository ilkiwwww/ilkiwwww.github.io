import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { WORKS } from "../data/works.js";
import { openBookCall } from "./BookCall.jsx";
import Button from "./ui/Button.jsx";
import Eyebrow from "./ui/Eyebrow.jsx";
import Heading from "./ui/Heading.jsx";
import IconButton from "./ui/IconButton.jsx";
import { ChevronDownIcon, CloseIcon, PlusIcon } from "./ui/icons.jsx";
import Media from "./ui/Media.jsx";
import { Curtain, InView, Rise } from "./ui/Motion.jsx";
import Section from "./ui/Section.jsx";
import Text from "./ui/Text.jsx";
import ScrollHeading from "./ui/ScrollHeading.jsx";
import SectionLabel from "./ui/SectionLabel.jsx";
import Page from "./Page.jsx";
import WorkCard from "./WorkCard.jsx";

// Сторінка кейсу (/work/<slug>). UX — з прототипу emote-306ec.web.app/work/ledger-loop:
// заголовок «Назва. Опис», галузь · послуги, ліворуч фото й цитата, праворуч
// липкий акордеон «The story» (challenge / approach / results), нижче галерея
// й сусідні кейси; закінчує той самий CTA з футером. Усе в темній темі сайту.
// Історія й цитата — з `data/works.js` (`story`, `quote`), інакше заглушки.
const FALLBACK_STORY = {
  challenge: "The team was working around an outdated product — we set out to make the core flow simple and fast.",
  approach: "We started with research and interviews, then moved through UX, UI and a design system built to scale.",
  results: ["Faster core flow", "Fewer support requests", "Adopted across the team"],
};
const FALLBACK_QUOTE = "Working with EMOTE felt like having an in-house team — fast, careful and clear at every step.";

// Розділи історії. Дані кейсу (`chapters`, `stats`) — у data/works.js; без них — три
// розділи-заглушки з плейсхолдерами. `layout`: wide — широке фото й абзац праворуч; pair — два високих
// кадри (правий нижче); offset — мале й велике поруч. `media` — [{ src, label }].
const FALLBACK_CHAPTERS = [
  { label: "The vision", layout: "wide" },
  { label: "Sweating the details", layout: "pair" },
  { label: "Old meets new", layout: "offset" },
];

// Цифри блоку «Results» — заглушки, поки в кейсі немає своїх (`stats` у data/works.js).
const FALLBACK_STATS = [
  { value: "4 days", label: "faster from booking to first visit" },
  { value: "60%", label: "fewer support requests" },
  { value: "12K", label: "patients in the first quarter" },
];

const STORY_STEPS = [
  { id: "challenge", label: "The challenge" },
  { id: "approach", label: "The approach" },
  { id: "results", label: "Results" },
];

function StoryAccordion({ story, onClose, layoutRef }) {
  // Кожен пункт відкривається й закривається сам по собі (можна відкрити всі три).
  const [open, setOpen] = useState(() => new Set(["challenge"]));
  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  // Від lg пункти відкриваються самі, поки скролимо розділи кейсу: спершу The challenge, у середині розділів
  // The approach (попередній закривається), наприкінці Results. Прогрес рахуємо від кінця вступу зі скролом до низу колонки.
  // Клік по пункту працює як раніше, але наступна зміна кроку знову відкриває лише поточний.
  const step = useRef(0);
  useEffect(() => {
    const layout = layoutRef?.current;
    if (!layout) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerWidth < 1024) return;
      const col = layout.firstElementChild;
      const intro = col.querySelector(".intro-block");
      const colRect = col.getBoundingClientRect();
      const introH = intro ? intro.offsetHeight : 0;
      const start = colRect.top + window.scrollY + introH * 0.85;
      const end = colRect.bottom + window.scrollY - window.innerHeight;
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
      const next = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
      if (next !== step.current) {
        step.current = next;
        setOpen(new Set([STORY_STEPS[next].id]));
      }
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
  }, [layoutRef]);
  return (
    <div className="border-t border-tertiary">
      <div className="flex items-center justify-between py-3">
        <Eyebrow>The story</Eyebrow>
        {/* -mr-3: кнопка 48 ширша за іконку 24, тож зсув ставить × на ту саму вертикаль, що й «+/×» пунктів. */}
        <IconButton label="Close the story" className="-mr-3" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      {STORY_STEPS.map(({ id, label }) => {
        const isOpen = open.has(id);
        const body = story[id];
        return (
          <div key={id} className="border-t border-tertiary">
            {/* Невидима обгортка рядка акордеону. */}
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(id)}
              className="flex w-full cursor-pointer items-center justify-between py-6 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Text size="lead" weight="medium" as="span">
                {label}
              </Text>
              <ChevronDownIcon weight={1} className={`h-6 w-6 shrink-0 transition-transform duration-500 ease-case motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="acc-body" data-open={isOpen || undefined} inert={!isOpen}>
              <div>
                <div className="pb-6">
                  {Array.isArray(body) ? (
                    <ul className="flex flex-col gap-2">
                      {body.map((r) => (
                        <li key={r}>
                          <Text size="body" tone="secondary">
                            {r}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Text size="body" tone="secondary">
                      {body}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Один блок медіа в розділі: `wide` — 4:3 на всю ширину колонки; `pair` — два 4:5, правий нижче на 80;
// `offset` — вузьке 7:9 (5/16 ширини) і широке 5:4 (разом ростуть пропорційно, коли панель закрита), `reverse` міняє їх місцями. `media` — [{ src, label }].
function Block({ block, label, skipMedia = false, text }) {
  const { layout = "wide", reverse = false } = block;
  const shot = (i, className) => <Media src={block.media?.[i]?.src} label={block.media?.[i]?.label ?? `${label ?? "Image"} ${i + 1}`} className={className} />;
  if (layout === "wide") return skipMedia ? null : <Curtain>{shot(0, "aspect-4/3 w-full")}</Curtain>;
  if (layout === "pair") {
    return (
      <div className="grid grid-cols-2 items-start gap-3">
        <div className="flex flex-col gap-6">
          <Curtain>{shot(0, "aspect-4/5 w-full")}</Curtain>
          {text && (
            <Rise delay={0.1}>
              <Text tone="secondary">{text}</Text>
            </Rise>
          )}
        </div>
        <div className="pt-10 md:pt-20">
          <Curtain delay={0.15}>{shot(1, "aspect-4/5 w-full")}</Curtain>
        </div>
      </div>
    );
  }
  return (
    <div className={`flex items-start gap-3 ${reverse ? "flex-row-reverse" : ""}`}>
      <Curtain className="w-5/16 shrink-0">{shot(0, "aspect-7/9 w-full")}</Curtain>
      <Curtain delay={0.15} className="min-w-0 flex-1">
        {shot(1, "aspect-5/4 w-full")}
      </Curtain>
    </div>
  );
}

// Розділ історії: підпис (eyebrow; із лінією, а з `title` — над заголовком statement), блоки медіа
// (перший + `more` через 12) і абзац внизу (`textAt="start"` — під лівою половиною, інакше під правою). Тексти мають
// фіксовану ширину (абзац 452, рядок `pull` 684, заголовок 904), тож при закритій панелі не розтягуються й лишаються в тих самих рядках.
// `layout: "statement"` — лише рядок `pull` без медіа. Перший розділ іде без підпису (як у макеті);
// `skipMedia` — перше медіа вже показує вступ зі скролом (useIntroScroll), лишається абзац.
function Chapter({ chapter, head, skipMedia = false }) {
  const { label, title, layout = "wide", text, textAt, more = [], joined = false } = chapter;
  const joinedClass = joined ? "-mt-14" : "";
  const titleLines = title ? title.split("\n") : [];
  const heading = title && (
    <div className="flex flex-col gap-6">
      <Rise>
        <Eyebrow>{label}</Eyebrow>
      </Rise>
      <Rise delay={0.1} bleed className="max-w-226">
        <Heading level="statement" as="h2">
          {titleLines.map((line, i) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </Heading>
      </Rise>
    </div>
  );
  if (layout === "head") return <InView>{heading}</InView>;
  if (layout === "statement") {
    return (
      <InView className={`flex flex-col gap-16 ${joinedClass}`}>
        {text && (
          <div className="md:pl-28">
            <Rise bleed className="max-w-171">
              <Heading level="pull" as="p">
                {text}
              </Heading>
            </Rise>
          </div>
        )}
        {more.length > 0 && (
          <div className="flex flex-col gap-3">
            {more.map((block, i) => (
              <Block key={i} block={block} label={label} />
            ))}
          </div>
        )}
      </InView>
    );
  }
  const inColumn = layout === "pair" && more.length === 0;
  return (
    <InView className={`flex flex-col ${title ? "gap-16" : "gap-10"} ${joinedClass}`}>
      {head && label && !title && <SectionLabel>{label}</SectionLabel>}
      {head && heading}
      <div className="flex flex-col gap-8">
        {!(skipMedia && layout === "wide" && more.length === 0) && (
          <div className="flex flex-col gap-3">
            <Block block={chapter} label={label} skipMedia={skipMedia} text={inColumn ? text : undefined} />
            {more.map((block, i) => (
              <Block key={i} block={block} label={label} />
            ))}
          </div>
        )}
        {text && !inColumn && (
          <Rise delay={0.1} className={textAt === "start" ? "max-w-113" : "grid md:grid-cols-2"}>
            <Text tone="secondary" className={textAt === "start" ? undefined : "max-w-113 md:col-start-2"}>
              {text}
            </Text>
          </Rise>
        )}
      </div>
    </InView>
  );
}

// Вступ зі скролом (від lg, без reduced motion): відео кейсу спершу на всю ширину під назвою, при скролі
// росте на весь екран, а далі стискається в колонку першого розділу, і справа виїжджає панель історії.
// Прогрес пишемо в CSS-змінні на `.story-layout` (--f: ріст на екран, --s: стиснення в колонку), стилі — `.intro-*`.
function useIntroScroll(enabled, layoutRef, blockRef, storyOpen) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const layout = layoutRef.current;
    const block = blockRef.current;
    if (!layout || !block) return;
    let frame = 0;
    let timer = 0;
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const ease = (v) => v * v * (3 - 2 * v);
    const update = () => {
      frame = 0;
      const r = block.getBoundingClientRect();
      const vh = window.innerHeight;
      const run = r.height - block.firstElementChild.offsetHeight;
      const set = (k, v) => layout.style.setProperty(k, v);
      set("--cx", `${r.left}px`);
      set("--lw", `${layout.clientWidth}px`);
      set("--vw", `${document.documentElement.clientWidth}px`);
      set("--h2", `${block.clientWidth * 0.75}px`);
      const f = ease(clamp((vh * 0.6 - r.top) / (vh * 0.6)));
      const s = ease(clamp((-r.top - 0.2 * run) / (0.6 * run)));
      set("--f", f);
      set("--s", s);
      // Панель видна лише правіше від краю відео (після зміни змінних геометрія вже оновлена).
      const aside = layout.querySelector(".story-aside");
      const video = block.querySelector(".intro-video");
      if (aside && video) {
        const a = aside.getBoundingClientRect();
        set("--cut", `${Math.min(a.width, Math.max(0, video.getBoundingClientRect().right - a.left))}px`);
      }
      layout.toggleAttribute("data-intro-done", s > 0.6);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    // Колонка змінює ширину разом із панеллю (0.8s) — перемірюємо після переходу.
    timer = window.setTimeout(update, 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, storyOpen, layoutRef, blockRef]);
}

// Вхід на сторінку кейсу: відео спершу на весь екран (поверх шапки), потім плавно «сідає» на своє місце під назвою.
// FLIP: міряємо справжнє місце, ставимо відео fixed на весь екран, за мить анімуємо до виміряного й знімаємо inline-стилі.
// Перший скрол, дотик чи клавіша пропускає анімацію (відео одразу на місці).
function useIntroEntry(enabled, blockRef) {
  const done = useRef(false);
  useLayoutEffect(() => {
    if (!enabled || done.current) return;
    done.current = true;
    const block = blockRef.current;
    const video = block?.querySelector(".intro-video");
    if (!video || window.scrollY > 10) return;
    const el = video.querySelector("video");
    const finish = () => {
      clearTimeout(t1);
      clearTimeout(t2);
      video.style.cssText = "";
      ["wheel", "touchstart", "keydown"].forEach((e) => window.removeEventListener(e, finish));
    };
    const fixed = "position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:50;transition:none;";
    video.style.cssText = fixed;
    let t2 = 0;
    const go = () => {
      const stage = block.querySelector(".intro-stage");
      // Місце, де відео стоїть за замовчуванням: верх сцени, ширина сітки, висота за 4:3 колонки.
      const sr = stage.getBoundingClientRect();
      const layout = block.closest(".story-layout");
      const w = layout.clientWidth;
      const h = block.clientWidth * 0.75;
      video.style.cssText = `${fixed}transition:left 1.4s var(--ease-reveal),top 1.4s var(--ease-reveal),width 1.4s var(--ease-reveal),height 1.4s var(--ease-reveal);`;
      void video.offsetWidth;
      video.style.left = `${sr.left}px`;
      video.style.top = `${sr.top}px`;
      video.style.width = `${w}px`;
      video.style.height = `${h}px`;
      t2 = setTimeout(finish, 1500);
    };
    // Чекаємо, поки відео заграє (але не довше 1.2s), і тримаємо його на весь екран ще мить.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      t1 = setTimeout(go, 600);
    };
    let t1 = setTimeout(start, 1200);
    if (el) {
      if (el.readyState >= 3) start();
      else el.addEventListener("canplay", start, { once: true });
    }
    ["wheel", "touchstart", "keydown"].forEach((e) => window.addEventListener(e, finish, { passive: true, once: true }));
    return () => finish();
  }, [enabled, blockRef]);
}

export default function WorkDetailPage({ slug }) {
  // «The story» можна закрити (×) — галерея займає всю ширину, а відкрити знову — кнопкою на фото.
  const [storyOpen, setStoryOpen] = useState(true);
  const [wide, setWide] = useState(false);
  const layoutRef = useRef(null);
  const blockRef = useRef(null);
  useEffect(() => {
    const q = window.matchMedia("(min-width: 64rem) and (prefers-reduced-motion: no-preference)");
    const sync = () => setWide(q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);
  const index = WORKS.findIndex((w) => w.slug === slug);
  const work = WORKS[index];
  const introMedia = work?.chapters?.[0]?.layout === "wide" ? work.chapters[0].media?.[0] : undefined;
  const intro = wide && !!introMedia?.src;
  useIntroScroll(intro, layoutRef, blockRef, storyOpen);
  useIntroEntry(intro, blockRef);

  if (!work) {
    return (
      <Page>
        <Section rhythm="top">
          <Heading level="statement" tone="primary">
            Case not found.
          </Heading>
          <Button href="/work" variant="outline" size="md" className="mt-10">
            All work
          </Button>
        </Section>
      </Page>
    );
  }

  const prev = WORKS[(index - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(index + 1) % WORKS.length];
  const story = { ...FALLBACK_STORY, challenge: work.description, ...work.story };
  const chapters = work.chapters ?? FALLBACK_CHAPTERS;

  return (
    <Page>
      <Section rhythm="top" aria-labelledby="case-title">
        <InView className="flex flex-col items-start gap-8">
          <Rise bleed>
            <Heading id="case-title" level="display" as="h1">
              {work.name}
            </Heading>
          </Rise>
          <Rise delay={0.2}>
            <Eyebrow>{[work.industry, ...work.services].join(" · ")}</Eyebrow>
          </Rise>
        </InView>

        <div ref={layoutRef} className="story-layout mt-16" data-closed={!storyOpen || undefined} data-intro={intro || undefined}>
          <div className="relative flex min-w-0 flex-col gap-30">
            {/* Вступ зі скролом: відео кейсу на всю ширину → на весь екран → у колонку (див. useIntroScroll). */}
            {intro && (
              <div ref={blockRef} className="intro-block" data-text={chapters[0].text ? "" : undefined}>
                <div className="intro-stage">
                  <div className="intro-video">
                    <Media src={introMedia.src} alt={work.name} fill />
                  </div>
                </div>
              </div>
            )}
            {/* Закрита панель: кнопка «The story +» висить над розділами й їде за скролом (sticky). */}
            {!storyOpen && (
              <div className="pointer-events-none absolute inset-y-0 right-6 z-10">
                <Button variant="light" size="sm" className="pointer-events-auto sticky top-28 z-20 mt-6" onClick={() => setStoryOpen(true)}>
                  The story
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
            {chapters.map((chapter, i) => intro && i === 0 && !chapter.text ? null : (
              <Chapter key={chapter.label} chapter={chapter} head={i > 0} skipMedia={intro && i === 0} />
            ))}
          </div>

          {/* Панель завжди в DOM: при закритті колонка плавно стискається (.story-layout), а вміст згасає. */}
          <aside className="story-aside lg:sticky lg:top-28 lg:self-start" inert={!storyOpen}>
            <div className="story-aside-inner lg:pl-16">
              <InView className="flex flex-col gap-8">
                <Rise>
                  <StoryAccordion story={story} layoutRef={layoutRef} onClose={() => setStoryOpen(false)} />
                </Rise>
                <Rise delay={0.1} bleed>
                  <Button variant="light" size="md" className="w-full" onClick={openBookCall}>
                    Start a project
                  </Button>
                </Rise>
              </InView>
            </div>
          </aside>
        </div>

        <InView className="mt-30 flex flex-col gap-12 lg:flex-row lg:gap-20">
            <div className="flex min-w-0 flex-1 flex-col gap-10">
              <div className="flex flex-col gap-10">
                <SectionLabel>Results</SectionLabel>
                <ScrollHeading lines={["Shipping work", "that moves numbers."]} />
              </div>
              <div className="flex flex-col">
                {(work.stats ?? FALLBACK_STATS).map((stat, i) => (
                  <Rise key={stat.label} delay={i * 0.1}>
                    <div className="flex items-center justify-between gap-6 border-t border-tertiary py-6">
                      <Text size="lead" tone="secondary">
                        {stat.label}
                      </Text>
                      <Heading level="statement" as="p">
                        {stat.value}
                      </Heading>
                    </div>
                  </Rise>
                ))}
              </div>
            </div>
            <Rise delay={0.1} className="lg:w-140 lg:shrink-0">
              <Media src={work.statsImage} label="Results" className="aspect-7/9 w-full" />
            </Rise>
          </InView>

        <InView className="mt-30 flex flex-col gap-8">
          <Rise>
            <Heading level="statement" as="blockquote" className="max-w-240">
              “{work.quote ?? FALLBACK_QUOTE}”
            </Heading>
          </Rise>
          <Rise delay={0.1}>
            <Text size="dense" weight="medium" uppercase tone="secondary">
              {work.quoteBy ?? "Client name"} · {work.name}
            </Text>
          </Rise>
        </InView>

        <InView className="mt-20 grid gap-16 border-t border-tertiary pt-16 md:grid-cols-2 md:gap-3">
          <Rise>
            <WorkCard work={prev} badge="← Previous" shape="aspect-16/10 w-full" />
          </Rise>
          <Rise delay={0.1}>
            <WorkCard work={next} badge="Next →" shape="aspect-16/10 w-full" />
          </Rise>
        </InView>
      </Section>

    </Page>
  );
}
