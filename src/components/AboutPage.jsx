import { ABOUT_INTRO, BELIEFS, NUMBERS, TEAM } from "../data/about.js";
import { Fact } from "./Facts.jsx";
import Eyebrow from "./ui/Eyebrow.jsx";
import Heading from "./ui/Heading.jsx";
import Media from "./ui/Media.jsx";
import { Grow, InView, Rise } from "./ui/Motion.jsx";
import ScrollHeading from "./ui/ScrollHeading.jsx";
import Section from "./ui/Section.jsx";
import SectionLabel from "./ui/SectionLabel.jsx";
import Text from "./ui/Text.jsx";
import Page from "./Page.jsx";
import Showreel from "./Showreel.jsx";

// Сторінка «About» (/about). UX — з прототипу emote-306ec.web.app/about:
// вступ із великим заголовком і фото, цифри агенції, команда
// (на hover фото — жартівливий рядок), внизу — той самий CTA з футером.
// Дані — data/about.js. Заголовки секцій заповнюються білим за скролом (ScrollFill).
// Розкладка команди на lg (4 колонки): число — індекс у TEAM, null — порожня клітинка,
// "title" — заголовок секції, "text" — підпис. До lg порожні клітинки ховаються, фото йдуть у 2 колонки.
// Відступ згори, на якому «липне» кожна картка принципів (крок 112 = висота згорнутої шапки).
const BELIEF_TOPS = ["lg:top-24", "lg:top-52", "lg:top-80", "lg:top-108"];

const TEAM_LAYOUT = [0, "title", 1, 2, null, 3, null, 4, 5, 6, "text", null, null, null, 7, 8, null, 9, null, null];

function TeamCard({ member }) {
  return (
    <article className="group flex flex-col gap-4">
      <div className="relative">
        <Media src={`/team/${member.slug}.png`} label={member.name} alt={member.name} className="aspect-3/4 w-full" />
        {/* Hover: жартівливий рядок накриває фото (якщо він є). */}
        {member.note && (
          <div className="absolute inset-0 flex items-end bg-fill p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Text size="lead">{member.note}</Text>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Text size="lead" weight="medium">
          {member.name}
        </Text>
        <Text size="dense" tone="secondary">
          {member.role}
        </Text>
      </div>
    </article>
  );
}

export default function AboutPage() {
  return (
    <Page>
      <Section rhythm="top" aria-labelledby="about-title">
        <InView className="flex flex-col gap-10">
          <Rise bleed>
            <Heading id="about-title" level="display" as="h1">
              A small studio that ships like a bigger one
            </Heading>
          </Rise>
        </InView>
        {/* Другий рядок: підпис ліворуч, великий абзац — з середини екрана (референс). */}
        <InView className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-0">
          <Rise delay={0.2}>
            <Eyebrow>Who we are</Eyebrow>
          </Rise>
          <Rise delay={0.3}>
            <Text size="quote">{ABOUT_INTRO}</Text>
          </Rise>
        </InView>
        {/* Три фото команди в ряд: різна висота, вирівняні зверху (Figma). */}
        <InView className="mt-16 grid items-start gap-3 md:grid-cols-3">
          <Rise delay={0.2}>
            <Media alt="The EMOTE team" className="aspect-2/3 w-full" />
          </Rise>
          <Rise delay={0.3}>
            <Media alt="The EMOTE team at work" className="aspect-13/14 w-full" />
          </Rise>
          <Rise delay={0.4}>
            <Media alt="The EMOTE studio" className="aspect-4/5 w-full" />
          </Rise>
        </InView>
        <InView className="mt-16 flex flex-col gap-10">
          <Grow />
          <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {NUMBERS.map((n, i) => (
              <Fact key={n.label} {...n} delay={0.15 + i * 0.1} />
            ))}
          </div>
        </InView>
      </Section>

      <Showreel />

      <Section aria-labelledby="beliefs-title">
        <InView>
          <ScrollHeading id="beliefs-title" lines={["Four things we", "don't compromise on."]} />
        </InView>
        {/* Від lg картки «липнуть» і наїжджають одна на одну при скролі: кожна зупиняється нижче попередньої. */}
        <div className="mt-10">
          {BELIEFS.map((b, i) => (
            <InView key={b.slug} className={`group flex flex-col gap-6 bg-black pb-6 lg:sticky ${i < BELIEFS.length - 1 ? "lg:min-h-120" : ""} ${BELIEF_TOPS[i]}`}>
              <Grow delay={0.1 * i} />
              <div className="grid gap-6 lg:grid-cols-3">
                <Rise delay={0.1}>
                  <Media src={`/beliefs/${b.slug}.png`} label={b.title} alt={b.title} hover="zoom" className="aspect-4/3 w-full" />
                </Rise>
                <div className="flex flex-col gap-4">
                  <Rise delay={0.15}>
                    <Text size="dense" tone="secondary">
                      {String(i + 1).padStart(2, "0")}
                    </Text>
                  </Rise>
                  <Rise bleed delay={0.2}>
                    <Heading level="statement" as="h3">
                      {b.title}
                    </Heading>
                  </Rise>
                </div>
                <Rise delay={0.25}>
                  <Text size="lead" tone="secondary">
                    {b.text}
                  </Text>
                </Rise>
              </div>
            </InView>
          ))}
        </div>
      </Section>

      <Section aria-labelledby="team-title">
        <SectionLabel>Our team</SectionLabel>
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {TEAM_LAYOUT.map((cell, i) =>
            cell === null ? (
              <div key={`gap-${i}`} className="hidden lg:block" aria-hidden="true" />
            ) : cell === "title" ? (
              <InView key="title" className="order-first col-span-2 mb-10 flex items-end lg:order-none lg:col-span-1 lg:mb-0 lg:pb-16">
                <ScrollHeading id="team-title" level="cell" lines={["Meet", "our team"]} />
              </InView>
            ) : cell === "text" ? (
              <InView key="text" className="col-span-2 flex items-center justify-center text-balance text-center lg:col-span-1">
                <Rise>
                  <Text size="quote">
                    Real people,
                    <br />
                    real craft.
                  </Text>
                </Rise>
              </InView>
            ) : (
              <InView key={TEAM[cell].slug}>
                <Rise delay={(i % 4) * 0.1}>
                  <TeamCard member={TEAM[cell]} />
                </Rise>
              </InView>
            ),
          )}
        </div>
      </Section>
    </Page>
  );
}
