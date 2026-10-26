import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "../data/testimonials.js";
import IconButton from "./ui/IconButton.jsx";
import Media from "./ui/Media.jsx";
import { InView, Rise } from "./ui/Motion.jsx";
import ScrollHeading from "./ui/ScrollHeading.jsx";
import Section from "./ui/Section.jsx";
import Text from "./ui/Text.jsx";
import { ArrowIcon } from "./ui/icons.jsx";

// П'ята секція «What clients say» — за Figma (UI-Design, node 40002122:9926).
// Угорі заголовок (`statement`, заповнюється білим за скролом) і стрілки
// праворуч (32px, тонка лінія 1/24 — легша за стрілки в контролах).
// Нижче — слайд: ліворуч картинка проєкту 457×469, праворуч картка без
// обводки з заливкою `fill`, відступи 32, з цитатою;
// під лінією `line` (відступ 28) — автор (фото 48, ім'я, посада)
// і логотип клієнта. Пропорції колонок — з макету (457 · 811, gap 12).
// Стрілки гортають по колу; зміна — як у Hero: картинка відкривається
// шторкою, цитата й автор проявляються й доїжджають знизу (.case-*).
// Самі гортаються кожні 6s (AUTOPLAY), лише поки секція на екрані; ручне
// гортання починає відлік заново. Паузи на наведенні й фокусі немає: після
// кліку стрілка лишається у фокусі, і слайдер виглядав зламаним.
// При prefers-reduced-motion — без автогортання.
// Нижче lg — картинка над карткою; нижче md стрілки під заголовком.
const N = TESTIMONIALS.length;
const AUTOPLAY = 6000;

function Slide({ item, active }) {
  return (
    <div data-active={active || undefined} aria-hidden={!active || undefined} className="col-start-1 row-start-1 flex flex-col gap-3 lg:flex-row">
      <div className="case-wipe wipe-left aspect-457/469 lg:aspect-auto lg:h-117 lg:min-w-0 lg:basis-0 lg:grow-457">
        <Media src={item.image} alt="" label="Project" className="h-full w-full" />
      </div>

      {/* Обгортка без відступів: інакше padding картки зсуває пропорцію 457 · 811. */}
      <div className="lg:h-117 lg:min-w-0 lg:basis-0 lg:grow-811">
        <figure className="flex h-full flex-col justify-between gap-10 bg-fill p-6 md:p-8">
          <blockquote className="case-part from-bottom lg:max-w-150">
            <Text size="quote" tone="primary">
              “{item.quote}”
            </Text>
          </blockquote>

          <figcaption className="case-part from-bottom flex flex-col gap-6 border-t border-tertiary pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <Media src={item.avatar} alt="" className="h-12 w-12 shrink-0" />
              <div className="flex flex-col gap-1">
                <Text size="lead" tone="primary">
                  {item.name}
                </Text>
                <Text tone="secondary">{item.role}</Text>
              </div>
            </div>
            <Media src={item.logo} alt="" label="Logo" className="h-12 w-38 shrink-0" />
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const section = useRef(null);
  const go = (step) => setIndex((i) => (i + step + N) % N);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    io.observe(section.current);
    return () => io.disconnect();
  }, []);

  // Після кожної зміни (своєї чи ручної) відлік починається заново.
  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(1), AUTOPLAY);
    return () => clearTimeout(id);
  }, [index, visible]);

  return (
    <Section ref={section} id="reviews" aria-labelledby="testimonials-title">
      <InView className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        {/* Заголовок заповнюється білим за скролом, слово за словом (як у Facts). */}
        <ScrollHeading id="testimonials-title" lines={["What clients say", "once we’ve shipped."]} />
        <Rise delay={0.1} className="shrink-0">
          <div className="flex gap-2">
            <IconButton label="Previous testimonial" onClick={() => go(-1)}>
              <ArrowIcon className="h-8 w-8 rotate-180" />
            </IconButton>
            <IconButton label="Next testimonial" onClick={() => go(1)}>
              <ArrowIcon />
            </IconButton>
          </div>
        </Rise>
      </InView>

      <InView className="mt-10">
        <Rise delay={0.15}>
          <div className="grid">
            {TESTIMONIALS.map((t, i) => (
              <Slide key={t.slug} item={t} active={i === index} />
            ))}
          </div>
        </Rise>
      </InView>
    </Section>
  );
}
