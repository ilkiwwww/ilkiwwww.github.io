import { controlClasses } from "./ui/Button.jsx";
import Media from "./ui/Media.jsx";
import { Roll } from "./ui/Motion.jsx";
import Text from "./ui/Text.jsx";

// Картка кейсу — одна на весь сайт (мозаїка на головній і на /work, сусідні
// кейси на сторінці кейсу). Фото (повільно збільшується на hover), рядок
// «галузь · послуги», назва, що на hover прокручується в «See detail →».
// `shape` — класи розміру фото (задає батько), `badge` — необов'язкова біла
// мітка на самому фото, що з'являється на hover («← Previous», «Next →»).
export default function WorkCard({ work, shape, badge }) {
  const { slug, name, industry, services, image, next } = work;
  return (
    <a
      href={`/work/${slug}`}
      aria-label={badge ? `${badge.replace(/[←→]/g, "").trim()} case: ${name}` : name}
      className="group flex flex-col gap-4 outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="relative">
        <Media src={image} next={next} alt={name} hover="zoom" className={shape} />
        {badge && (
          <span
            aria-hidden="true"
            className={`${controlClasses("light", "sm")} pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="work-caption flex flex-col gap-1">
        <Text size="dense" tone="secondary">
          {[industry, ...services].join(" · ")}
        </Text>
        <Roll
          hover={
            <Text size="lead" as="span">
              See detail →
            </Text>
          }
        >
          <Text size="lead">{name}</Text>
        </Roll>
      </div>
    </a>
  );
}
