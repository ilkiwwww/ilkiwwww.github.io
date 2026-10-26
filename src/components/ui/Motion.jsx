import { useEffect, useRef, useState } from "react";

// Поява при скролі — як на metalab.com. Стилі й криві в index.css.
//
//   <InView>  блок, що чекає на в'юпорт; усе всередині стартує разом
//   <Rise>    виїзд знизу з рамки (текст, цифри); `bleed` — рамка з запасом
//             для гліфів, що виходять за рядок (обрізаний statement); `fill` — на всю висоту батька
//   <Grow>    лінія-розділювач, розтягується зліва направо
//   <Fade>    проявлення — лише великий заголовок
//
// `delay` у секундах, відносно моменту, коли блок зайшов у в'юпорт.

export function InView({ as: Component = "div", early = false, className = "", children, ...props }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Стартує, коли верх блоку піднявся на 15% над низом екрана; `early` — щойно
    // блок показався з-за нижнього краю (перший ряд кейсів на першому екрані).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: early ? "0px" : "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Component ref={ref} data-inview={inView || undefined} className={className} {...props}>
      {children}
    </Component>
  );
}

const delayVar = (delay) => (delay ? { "--delay": `${delay}s` } : undefined);

export function Rise({ delay = 0, bleed = false, fill = false, className = "", children }) {
  return (
    <div className={`rise ${bleed ? "rise-bleed" : ""} ${fill ? "h-full" : ""} ${className}`}>
      <div className={fill ? "h-full" : undefined} style={delayVar(delay)}>{children}</div>
    </div>
  );
}

export function Grow({ delay = 0, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`line-grow h-px bg-tertiary ${className}`}
      style={delayVar(delay)}
    />
  );
}

// Заповнення тексту кольором за скролом: слова по черзі переходять
// із `secondary` у білий, поки блок проходить від 85% до 35% висоти екрана.
// Прив'язано до скролу, тож у зворотний бік текст знову сіріє.
// `lines` — рядки; перенос між ними лише від md (як у макеті), з `breakAlways` —
// на всіх ширинах. `end` — де заповнення закінчується (частка висоти екрана);
// для останньої секції сторінки — вище, бо далі вона не прокрутиться.
export function ScrollFill({ lines, breakAlways = false, end: endAt = 0.35 }) {
  const ref = useRef(null);
  const words = lines.map((line) => line.split(" "));
  const total = words.flat().length;
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(total);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * endAt;
      const progress = Math.min(1, Math.max(0, (start - el.getBoundingClientRect().top) / (start - end)));
      setLit(Math.round(progress * total));
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
  }, [total, endAt]);

  let index = 0;
  return (
    <span ref={ref}>
      {words.map((line, i) => (
        <span key={i}>
          {i > 0 && (
            <>
              {" "}
              <br className={breakAlways ? "" : "hidden md:block"} />
            </>
          )}
          {line.map((word, j) => {
            const on = index++ < lit;
            return (
              <span key={j}>
                {j > 0 && " "}
                <span className={`transition-colors duration-300 ${on ? "text-primary" : "text-secondary"}`}>{word}</span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

// Прокрутка рядка при наведенні батька (`group`): `children` виїжджає вгору
// з рамки, `hover` заходить знизу. Та сама мова, що в `Rise`, лише на ховері.
// На пристроях без ховера видно тільки `children`.
export function Roll({ hover, className = "", children }) {
  const line = "block transition-transform duration-900 ease-reveal group-hover:-translate-y-full motion-reduce:transition-none";
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={line}>{children}</div>
      <div aria-hidden="true" className={`absolute inset-x-0 top-full ${line}`}>
        {hover}
      </div>
    </div>
  );
}

export function Fade({ delay = 0, className = "", children }) {
  return (
    <div className={`fade ${className}`} style={delayVar(delay)}>
      {children}
    </div>
  );
}

// Виїзд знизу при завантаженні сторінки (інтро): вміст у рамці з overflow-hidden,
// тож краї різкі. `delay` — у секундах. Відіграє один раз.
export function Reveal({ delay = 0, fill = false, className = "", children }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`reveal-up ${fill ? "h-full" : ""}`} style={{ "--delay": `${delay}s` }}>
        {children}
      </div>
    </div>
  );
}
