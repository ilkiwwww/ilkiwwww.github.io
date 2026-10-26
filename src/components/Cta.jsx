import { lazy, Suspense, useRef } from "react";
import { openBookCall } from "./BookCall.jsx";
import Button from "./ui/Button.jsx";
import ScrollHeading from "./ui/ScrollHeading.jsx";
import Section from "./ui/Section.jsx";
import Text from "./ui/Text.jsx";

// Футер (Figma, node 40002187:279): внизу сцени ліворуч legal, праворуч
// соцмережі.
const SOCIALS = [
  ["Instagram", "https://www.instagram.com/emoteagency_/"],
  ["Linkedin", "https://www.linkedin.com/company/ui-emote/posts/?feedView=all"],
  ["Dribbble", "https://dribbble.com/emoteagency"],
];

// Фінальний CTA — за Figma (node 40002134:181, 1440×709).
// Позаду — велике темне скляне 3D-лого «ö» (glass/CtaScene.jsx), поверх нього
// великий заголовок «Let's make it work.» (`display`) і «Book a call».
// Заголовок заповнюється з сірого в білий за скролом, як інші заголовки.
// 3D (three.js) вантажиться ліниво, окремим чанком; без WebGL лишається
// просто заголовок на чорному. Текстовий шар пропускає курсор до лого
// (pointer-events-none), клікабельна лише кнопка.
const CtaScene = lazy(() => import("./glass/CtaScene.jsx"));

const hasWebGL = (() => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
})();

// Футер: legal ліворуч, соцмережі праворуч. У сцені CTA лежить внизу (absolute), без CTA — звичайним рядком.
function Footer({ className = "" }) {
  return (
    <footer className={`flex items-end justify-between gap-6 ${className}`}>
      <Text size="dense" weight="medium" tone="secondary" uppercase>
        © 2016-2026 THE
        <br />
        Emote Agency Privacy Policy
      </Text>
      <ul className="flex items-center gap-6">
        {SOCIALS.map(([name, href]) => (
          <li key={name}>
            <Text as="a" href={href} target="_blank" rel="noopener noreferrer" size="lead" weight="medium" tone="primary" className="transition-colors hover:text-secondary">
              {name}
            </Text>
          </li>
        ))}
      </ul>
    </footer>
  );
}

// `footerOnly` — сторінка без CTA (Contact): лише футер на чорному.
export default function Cta({ footerOnly = false }) {
  const stage = useRef(null);

  if (footerOnly) {
    return (
      <Section rhythm="none" className="py-8">
        <Footer />
      </Section>
    );
  }

  return (
    <Section id="contact" rhythm="none" aria-labelledby="cta-title">
      {/* Сцена на всю ширину секції (за межі gutters) */}
      <div ref={stage} className="relative -mx-6 h-140 overflow-hidden md:-mx-10 md:h-177">
        {hasWebGL && (
          <Suspense fallback={null}>
            <div className="absolute inset-0" aria-hidden="true">
              <CtaScene containerRef={stage} />
            </div>
          </Suspense>
        )}
        <div className="cta-fade pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 text-center">
          <ScrollHeading id="cta-title" level="display" lines={["Let’s make", "it work."]} breakAlways end={0.6} />
          <Button variant="light" size="md" className="pointer-events-auto" onClick={openBookCall}>
            Book a call
          </Button>
        </div>

        <Footer className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-8" />
      </div>
    </Section>
  );
}
