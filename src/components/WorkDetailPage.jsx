import { useState } from "react";
import { WORKS } from "../data/works.js";
import { openBookCall } from "./BookCall.jsx";
import Button from "./ui/Button.jsx";
import Eyebrow from "./ui/Eyebrow.jsx";
import Heading from "./ui/Heading.jsx";
import IconButton from "./ui/IconButton.jsx";
import { CloseIcon, PlusIcon } from "./ui/icons.jsx";
import Media from "./ui/Media.jsx";
import { InView, Rise } from "./ui/Motion.jsx";
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

function StoryAccordion({ story, onClose }) {
  // Кожен пункт відкривається й закривається сам по собі (можна відкрити всі три).
  const [open, setOpen] = useState(() => new Set(["challenge"]));
  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
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
              {isOpen ? <CloseIcon /> : <PlusIcon />}
            </button>
            {isOpen && (
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
            )}
          </div>
        );
      })}
    </div>
  );
}

// `head` — підпис розділу (eyebrow із лінією); перший розділ іде без нього (як у макеті).
function Chapter({ chapter, head }) {
  const { label, layout = "wide", text } = chapter;
  const shot = (i, className) => <Media src={chapter.media?.[i]?.src} label={chapter.media?.[i]?.label ?? `${label} ${i + 1}`} className={className} />;
  return (
    <InView className="flex flex-col gap-10">
      {head && <SectionLabel>{label}</SectionLabel>}
      {layout === "wide" && (
        <div className="grid gap-3 md:grid-cols-2">
          <Rise className="md:col-span-2">{shot(0, "aspect-3/2 w-full")}</Rise>
          {text && (
            <Rise delay={0.1} className="md:col-start-2">
              <Text tone="secondary">{text}</Text>
            </Rise>
          )}
        </div>
      )}
      {layout === "pair" && (
        <div className="grid grid-cols-2 items-start gap-3">
          <div className="flex flex-col gap-6">
            <Rise>{shot(0, "aspect-4/5 w-full")}</Rise>
            {text && (
              <Rise delay={0.1}>
                <Text tone="secondary">{text}</Text>
              </Rise>
            )}
          </div>
          <Rise delay={0.1} className="pt-10 md:pt-20">
            {shot(1, "aspect-4/5 w-full")}
          </Rise>
        </div>
      )}
      {layout === "offset" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 items-start gap-3">
            <Rise className="col-span-1">{shot(0, "aspect-3/4 w-full")}</Rise>
            <Rise delay={0.1} className="col-span-2">
              {shot(1, "aspect-5/4 w-full")}
            </Rise>
          </div>
          {text && (
            <Rise delay={0.1}>
              <Text tone="secondary">{text}</Text>
            </Rise>
          )}
        </div>
      )}
    </InView>
  );
}

export default function WorkDetailPage({ slug }) {
  // «The story» можна закрити (×) — галерея займає всю ширину, а відкрити знову — кнопкою на фото.
  const [storyOpen, setStoryOpen] = useState(true);
  const index = WORKS.findIndex((w) => w.slug === slug);
  const work = WORKS[index];

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

        <div className="story-layout mt-16" data-closed={!storyOpen || undefined}>
          <div className="relative flex min-w-0 flex-col gap-30">
            {/* Закрита панель: кнопка «The story +» висить над розділами й їде за скролом (sticky). */}
            {!storyOpen && (
              <div className="pointer-events-none absolute inset-y-0 right-6 z-10">
                <Button variant="light" size="sm" className="pointer-events-auto sticky top-28 mt-6" onClick={() => setStoryOpen(true)}>
                  The story
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
            {chapters.map((chapter, i) => (
              <Chapter key={chapter.label} chapter={chapter} head={i > 0} />
            ))}
          </div>

          {/* Панель завжди в DOM: при закритті колонка плавно стискається (.story-layout), а вміст згасає. */}
          <aside className="story-aside lg:sticky lg:top-28 lg:self-start" inert={!storyOpen}>
            <div className="story-aside-inner lg:pl-16">
              <InView className="flex flex-col gap-8">
                <Rise>
                  <StoryAccordion story={story} onClose={() => setStoryOpen(false)} />
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

        <InView className="mt-30 grid gap-12 lg:grid-cols-5">
            <div className="flex flex-col gap-10 lg:col-span-3">
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
            <Rise delay={0.1} className="lg:col-span-2">
              <Media src={work.statsImage} label="Results" className="aspect-4/5 w-full" />
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
