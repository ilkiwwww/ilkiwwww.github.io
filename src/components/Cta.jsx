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
// Великий заголовок «Let's make it work.» (`display`) і «Book a call» на чорному.
// Заголовок заповнюється з сірого в білий за скролом, як інші заголовки.

// Футер: legal ліворуч, соцмережі праворуч. У сцені CTA лежить внизу (absolute), без CTA — звичайним рядком.
function Footer({ className = "" }) {
  return (
    <footer className={`flex flex-col-reverse items-center gap-8 text-center md:flex-row md:items-end md:justify-between md:gap-6 md:text-left ${className}`}>
      <Text size="dense" weight="medium" tone="secondary" uppercase>
        © 2019-2026 THE
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
  if (footerOnly) {
    return (
      <Section rhythm="footer">
        <Footer />
      </Section>
    );
  }

  return (
    <Section id="contact" rhythm="none" aria-labelledby="cta-title">
      {/* Сцена на всю ширину секції (за межі gutters) */}
      <div className="relative -mx-6 flex min-h-svh flex-col overflow-hidden pb-8 md:-mx-10 md:block md:h-177 md:min-h-0 md:pb-0">

        <div className="pointer-events-none flex flex-1 flex-col items-center justify-center gap-10 px-6 text-center md:absolute md:inset-0 md:flex-none">
          <ScrollHeading id="cta-title" level="display" lines={["Let’s make", "it work."]} breakAlways end={0.6} />
          <div className="hidden md:block">
            <Button variant="light" size="md" className="pointer-events-auto" onClick={openBookCall}>
              Book a call
            </Button>
          </div>
        </div>

        <Footer className="px-6 md:absolute md:inset-x-10 md:bottom-8 md:px-0" />
      </div>
    </Section>
  );
}
