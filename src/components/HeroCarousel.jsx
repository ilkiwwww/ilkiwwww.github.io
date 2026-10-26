import { useEffect, useRef, useState } from "react";
import { CASES as ALL_CASES } from "../data/cases.js";
import Heading from "./ui/Heading.jsx";
import Media from "./ui/Media.jsx";
import Text from "./ui/Text.jsx";
import { Reveal } from "./ui/Motion.jsx";

// Перший екран — за Figma (UI-Design, node 40002209:172, 1440×900).
// Три плоскі картки: попередній · вибраний (421×600) · наступний. Унизу ліворуч —
// послуги, назва й опис вибраного кейсу, унизу праворуч — перелік назв кейсів.
// Перемикання: наведення, фокус чи клік на назві; клік на сусідній картці;
// стрілки ←/→; свайп. Саме перемикається кожні 4s (AUTOPLAY): пауза, поки
// курсор на картках чи назвах, і при prefers-reduced-motion. Фон — як у Hero
// (обкладинка + фон кейсу під 80%). Стилі й криві — .hc-* в index.css.
// У макеті перелік містить шість кейсів — беремо перші шість.
const CASES = ALL_CASES.slice(0, 6);
const N = CASES.length;
const AUTOPLAY = 4000;

const COVER = "hero-cover.png";

function Backgrounds({ active, children }) {
  return (
    <div className="intro-bg absolute inset-0" aria-hidden="true">
      <Media src={COVER} placeholder="none" fill />
      {/* Необов'язкові фони кейсів поверх обкладинки — проявляються при зміні
          кейсу (.case-part, як на metalab). */}
      {CASES.filter((c) => c.background).map((c) => (
        <div
          key={c.slug}
          data-active={active.slug === c.slug || undefined}
          className="case-part absolute inset-0"
        >
          <Media src={c.background} placeholder="none" fill />
        </div>
      ))}
      {/* Лінії (якщо є) лежать під затемненням, як у Figma. */}
      {children}
      <div className="absolute inset-0 bg-black/80" />
    </div>
  );
}

// Лінії — SVG з Figma: вертикаль по центру і діагональ через увесь кадр.
// Є лише на першому кейсі.
// Інтро (`spread` вмикається один раз): обидві виростають складеними у
// вертикаль, потім діагональ повертається на свій кут — «роз'їжджаються».
// Далі кут не змінюється: на іншому кейсі кожна лінія стягується з країв до
// центру фото, на першому — розходиться від центру назад до країв.
function Lines({ spread, visible }) {
  const length = visible ? "scale-y-100" : "scale-y-0";
  const angle = spread ? "-rotate-[122.01deg] delay-600" : "-rotate-180";
  const motion = "ease-intro motion-reduce:transition-none";

  return (
    <div
      className="pointer-events-none absolute inset-0 hidden md:block"
      aria-hidden="true"
    >
      {/* Центр фото на 29.5px вище центру екрана — туди й стягується вертикаль. */}
      <img
        src="hero-line-vertical.svg"
        alt=""
        width="1"
        height="900"
        className={`absolute top-0 left-1/2 h-full origin-[50%_calc(50%-29.5px)] -translate-x-1/2 transition-[scale] duration-600 ${motion} ${length}`}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-1/2 transition-[rotate] duration-700 ${motion} ${angle}`}
      >
        <img
          src="hero-line-diagonal.svg"
          alt=""
          width="1"
          height="1698.12"
          className={`block transition-[scale] duration-600 ${motion} ${length}`}
        />
      </div>
    </div>
  );
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Лінії стартують згорнутими й розгортаються з першого кадру — це і є інтро.
  const [ready, setReady] = useState(false);
  const swipe = useRef(null);
  const active = CASES[index];

  const select = (next) => setIndex(((next % N) + N) % N);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  // Автопрокрутка: після кожної зміни кейсу відлік починається заново.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => select(index + 1), AUTOPLAY);
    return () => clearTimeout(id);
  });

  const hold = { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") select(index + 1);
    if (e.key === "ArrowLeft") select(index - 1);
  };

  // Позиція картки відносно вибраної в межах [-N/2, N/2): 0 — вибрана, ±1 — сусіди.
  const posOf = (i) => {
    let d = (i - index + N) % N;
    if (d > N / 2) d -= N;
    return Math.max(-2, Math.min(2, d));
  };

  return (
    <section
      className="relative h-svh min-h-160 overflow-hidden bg-canvas"
      onKeyDown={onKeyDown}
      onPointerDown={(e) => (swipe.current = e.clientX)}
      onPointerUp={(e) => {
        const dx = e.clientX - (swipe.current ?? e.clientX);
        swipe.current = null;
        if (Math.abs(dx) > 48) select(index + (dx < 0 ? 1 : -1));
      }}
    >
      <h1 className="sr-only">EMOTE — full-cycle UI/UX design agency</h1>
      <Backgrounds active={active}>
        <Lines spread={ready} visible={ready && index === 0} />
      </Backgrounds>

      {/* Сцена на весь екран: Reveal із `fill`, щоб внутрішній шар мав висоту. */}
      <Reveal fill delay={1.2} className="absolute inset-0">
        <div className="hc-stage absolute inset-0" {...hold}>
          {CASES.map((c, i) => {
            const pos = posOf(i);
            return (
              <div key={c.slug} className="hc-card" data-pos={pos}>
                {/* Невидима обгортка: клік по картці вибирає кейс. */}
                <button
                  type="button"
                  className="block h-full w-full cursor-pointer"
                  aria-label={c.name}
                  tabIndex={-1}
                  onClick={() => select(i)}
                >
                  <Media src={c.image} label={c.name} fill />
                </button>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Вибраний кейс: послуги, назва, опис. Усі лежать одне на одному,
          активний проявляється й доїжджає знизу (.case-part, як у Hero). */}
      <div className="absolute inset-x-6 bottom-10 z-10 flex items-end justify-between gap-10 md:inset-x-10">
        <Reveal delay={1.3} className="flex-1">
          <div className="grid">
            {CASES.map((c, i) => (
              <div
                key={c.slug}
                className="case-part from-bottom col-start-1 row-start-1 flex max-w-110 flex-col gap-6 self-end"
                data-active={i === index || undefined}
                aria-hidden={i !== index || undefined}
              >
                <Text size="dense" weight="medium" tone="secondary" uppercase>
                  {c.services}
                </Text>
                <div className="flex flex-col gap-3">
                  <Heading level="statement" tone="primary">
                    {c.name}
                  </Heading>
                  {c.description && <Text tone="secondary">{c.description}</Text>}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={1.4} className="hidden shrink-0 md:block">
          <nav aria-label="Cases" {...hold}>
            <ul className="flex gap-4">
              {CASES.map((c, i) => (
                <li key={c.slug}>
                  {/* Невидима обгортка: вигляд дає Text. */}
                  <button
                    type="button"
                    className="cursor-pointer"
                    aria-current={i === index ? "true" : undefined}
                    onMouseEnter={() => select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                  >
                    <Text as="span" tone={i === index ? "primary" : "secondary"} className="transition-colors duration-300">
                      {c.name}
                    </Text>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </div>

      <p className="sr-only" aria-live="polite">
        {active.name}
      </p>
    </section>
  );
}
