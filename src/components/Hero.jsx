import { useEffect, useRef, useState } from "react";
import { HERO_CASES, HERO_QUOTE } from "../data/hero.js";
import Heading from "./ui/Heading.jsx";
import Button, { controlClasses } from "./ui/Button.jsx";
import { ArrowIcon } from "./ui/icons.jsx";
import Media from "./ui/Media.jsx";
import Text from "./ui/Text.jsx";
import { openBookCall } from "./BookCall.jsx";
import { Reveal, Typewriter } from "./ui/Motion.jsx";

const N = HERO_CASES.length;
const wrap = (i) => ((i % N) + N) % N;
const CARDS_AHEAD = [-3, -2, -1, 0, 1, 2, 3];

// Перший екран — за Figma (UI-Design, node 40002454:47, 1440×900): чорний фон і дві тонкі лінії `tertiary`
// (горизонтальна й діагональна), ліворуч заголовок, праворуч цитата клієнта з «Book a call»,
// унизу праворуч назви кейсів (усі сірі, при наведенні білішають), ліворуч стрілка на /work.
// Інтро: лінії розходяться від центру → друкується заголовок (`Typewriter`) → цитата й назви виїжджають
// знизу з рамки (`Reveal`).
//
// Другий стан (Figma node 40002480:184, від md): наведення на назву кейсу внизу міняє вигляд екрана —
// заголовок і цитата йдуть, з'являється карусель обкладинок (активний кейс великий, з боків «наступні»),
// унизу ліворуч назва й опис кейсу, назви кейсів лишаються на місці, стрілка ліворуч ховається. Наведення на іншу назву прокручує
// карусель до неї; клік по сусідній картці ставить її в центр, а ← → і горизонтальний скрол тачпада гортають кейси. Відкритий стан
// тримається, поки не натиснуто лого (Home).
export default function Hero() {
  const [open, setOpen] = useState(false);
  // `pos` — віртуальна позиція каруселі (росте без меж, щоб прокрутка йшла по колу), активний кейс — wrap(pos).
  const [pos, setPos] = useState(0);
  const active = wrap(pos);

  // Скрол показує наведення: щойно Hero прокручено на чверть, відкривається перший кейс. Далі кейси лишаються
  // відкритими (і при скролі вгору, і коли курсор пішов) — повертає на дефолтний Hero лише клік по лого (Home).
  const track = useRef(null);
  const past = useRef(false);
  useEffect(() => {
    const onScroll = () => {
      const el = track.current;
      if (!el || window.innerWidth < 768) return;
      const p = -el.getBoundingClientRect().top / (el.offsetHeight - window.innerHeight);
      if (!past.current && p > 0.25) {
        past.current = true;
        if (!openRef.current) show(0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Коли кейси відкриті: стрілки ← → і горизонтальний скрол тачпада гортають їх на один крок.
  // Один жест тачпада — один крок: поки йдуть події (інерція), наступний крок заблоковано.
  const zone = useRef(null);
  const openRef = useRef(false);
  openRef.current = open;
  useEffect(() => {
    const step = (dir) => setPos((p) => Math.round(p) + dir);
    const onKey = (e) => {
      if (!openRef.current || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else return;
      e.preventDefault();
    };
    let locked = false;
    let quiet = 0;
    const onWheel = (e) => {
      if (!openRef.current || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      clearTimeout(quiet);
      quiet = setTimeout(() => (locked = false), 150);
      if (locked || Math.abs(e.deltaX) < 8) return;
      locked = true;
      step(e.deltaX > 0 ? 1 : -1);
    };
    const el = zone.current;
    window.addEventListener("keydown", onKey);
    el?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("wheel", onWheel);
      clearTimeout(quiet);
    };
  }, []);

  const show = (i) => {
    setOpen(true);
    // До найближчої копії кейсу в колі: діапазон −N/2…N/2 кроків.
    setPos((p) => {
      let d = wrap(i - wrap(p));
      if (d > N / 2) d -= N;
      return p + d;
    });
  };

  return (
    <div ref={track} className="hero-scroll">
    <section data-open={open || undefined} className="hero-stage h-svh min-h-160 overflow-hidden bg-black">
      {/* Лінії — як у Figma: діагональ під 30° через центр, горизонталь на 150 нижче центру. */}
      <svg className="pointer-events-none absolute inset-0 size-full text-tertiary" aria-hidden="true">
        <svg x="50%" y="50%" overflow="visible">
          <line className="intro-line-diag" x1="0" y1="0" x2="-2000" y2="-1150" pathLength="1" stroke="currentColor" />
          <line className="intro-line-diag" x1="0" y1="0" x2="2000" y2="1150" pathLength="1" stroke="currentColor" />
        </svg>
      </svg>
      <div className="intro-line-x pointer-events-none absolute inset-x-0 top-1/2 mt-38 h-px bg-tertiary" aria-hidden="true" />

      {/* Заголовок і цитата стоять від центру: рамка 1240. У другому стані йдуть (.hero-lead). */}
      <div className="hero-lead pointer-events-none absolute inset-0 flex items-center justify-center px-6 pt-20 md:px-10">
        <div className="flex w-full max-w-310 flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <Heading level="hero" tone="primary">
            <Typewriter lines={["We build", "best websites", "for your business"]} delay={1.0} />
          </Heading>
          <Reveal delay={2.2} className="mt-10 max-w-86 shrink-0 lg:mr-7">
            <Text weight="medium">{HERO_QUOTE}</Text>
            <Button variant="light" size="md" className="pointer-events-auto mt-8" onClick={openBookCall}>
              Book a call
            </Button>
          </Reveal>
        </div>
      </div>

      {/* Мобільний: другого стану немає, внизу лише назви кейсів посиланнями (від md їх замінює зона нижче). */}
      <Reveal delay={2.5} className="absolute inset-x-0 bottom-12 px-6 md:hidden">
        <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Cases">
          {HERO_CASES.map((item, i) => (
            <li key={item.name}>
              <Text as="a" href={`/work/${item.slug}`} tone={i === 0 ? "primary" : "secondary"}>
                {item.name}
              </Text>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Нижня зона: у другому стані ловить курсор (вихід — повернення), у першому пропускає. */}
      <div ref={zone} className="hero-zone absolute inset-x-0 top-38 bottom-0 hidden md:block">
        <div className="hero-cards absolute inset-x-0 top-0 mx-auto max-w-280">
          <div className="hero-track relative h-full">
            {CARDS_AHEAD.map((off) => {
              const v = Math.round(pos) + off;
              const item = HERO_CASES[wrap(v)];
              return (
                <div key={v} className="hero-card group absolute inset-y-0" style={{ "--d": v - pos }}>
                  <Media src={item.image} alt={item.name} fill />
                  {/* Сусідні кейси затемнені (Figma: чорний 70%); вибраний — світлий. */}
                  <div aria-hidden="true" className="hero-shade pointer-events-none absolute inset-0" />
                  {Math.abs(off) === 1 && (
                    <button
                      type="button"
                      onClick={() => show(wrap(v))}
                      aria-label={`${off < 0 ? "Previous" : "Next"} case: ${item.name}`}
                      className="hero-side absolute inset-0 flex cursor-pointer items-center justify-center outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <span aria-hidden="true" className={`${controlClasses("light", "sm")} opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100`}>
                        {off < 0 ? "←" : "→"}
                      </span>
                    </button>
                  )}
                  {off === 0 && (
                    <a href={`/work/${item.slug}`} aria-label={`${item.name}: see detail`} className="group absolute inset-0 flex items-center justify-center outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">
                      <span aria-hidden="true" className={`${controlClasses("light", "md")} opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100`}>
                        See detail →
                      </span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="hero-detail absolute bottom-12 left-10 max-w-110">
          <div className="relative">
            {HERO_CASES.map((item, i) => (
              <div key={item.name} data-active={i === active || undefined} className={`case-part from-bottom ${i === 0 ? "" : "absolute inset-x-0 top-0"}`}>
                <Heading as="p" level="statement" tone="primary">{item.name}</Heading>
                <Text tone="secondary" className="mt-4">{item.text}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* Стрілка ліворуч внизу — як у Figma (node 40002479:153); у другому стані її місце займає опис кейсу. */}
        <Reveal delay={2.5} className="hero-arrow absolute bottom-12 left-25">
          <a href="/work" aria-label="All works" className="pointer-events-auto block text-primary">
            <ArrowIcon className="h-6 w-6" />
          </a>
        </Reveal>

        <div className="absolute right-10 bottom-12">
          <Reveal delay={2.5}>
            <ul className="flex gap-6" aria-label="Cases">
              {HERO_CASES.map((item, i) => (
                <li key={item.name} className="pointer-events-auto">
                  <Text
                    as="button"
                    type="button"
                    tone="secondary"
                    className="hero-case"
                    data-active={open && i === active ? "" : undefined}
                    onMouseEnter={() => show(i)}
                    onFocus={() => show(i)}
                    onClick={() => show(i)}
                  >
                    {item.name}
                  </Text>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
    </div>
  );
}
