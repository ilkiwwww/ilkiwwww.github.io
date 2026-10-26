import { HERO_CASES, HERO_QUOTE } from "../data/hero.js";
import Heading from "./ui/Heading.jsx";
import Media from "./ui/Media.jsx";
import Text from "./ui/Text.jsx";
import { Reveal } from "./ui/Motion.jsx";

// Перший екран — за Figma (UI-Design, node 40002452:3, 1440×900): фон — темний
// скляний 3D-об'єкт, по центру заголовок (його лівий край стоїть на 428 при 1440),
// унизу ліворуч цитата клієнта, унизу праворуч назви кейсів (перша — активна).
// Інтро: заголовок, цитата й назви виїжджають знизу з рамки (`Reveal`).
export default function Hero() {
  return (
    <section className="relative h-svh min-h-160 overflow-hidden bg-canvas">
      <Media src="hero-3d.png" placeholder="none" fill alt="" />

      <div className="absolute inset-0 flex items-center px-6 pb-10 md:px-10">
        <Reveal delay={0.3} className="ml-auto w-full max-w-243">
          <Heading level="hero" tone="primary">
            We build
            <br />
            best websites
            <br />
            for your business
          </Heading>
        </Reveal>
      </div>

      <div className="absolute inset-x-6 bottom-10 flex items-end justify-between gap-10 md:inset-x-10">
        <Reveal delay={0.6} className="max-w-83">
          <Text weight="medium">{HERO_QUOTE}</Text>
        </Reveal>
        <Reveal delay={0.7} className="hidden shrink-0 md:block">
          <ul className="flex gap-4" aria-label="Cases">
            {HERO_CASES.map((name, i) => (
              <li key={name}>
                <Text as="span" tone={i === 0 ? "primary" : "secondary"}>
                  {name}
                </Text>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
