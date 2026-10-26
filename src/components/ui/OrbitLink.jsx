import { useEffect, useId, useRef } from "react";
import { ArrowIcon } from "./icons.jsx";

// Кругле посилання «All works» у сітці робіт: стрілка ↗ у центрі, навколо —
// кільце з тексту, що повільно обертається. При наведенні (чи фокусі) кільце
// плавно прискорюється, прибрав курсор — сповільнюється назад.
// Місце під коло ≈250 — з макету; саме кільце менше (текст 20px на радіусі 82),
// як у референсі дизайнерки. При prefers-reduced-motion кільце не крутиться.
const SPEED = 360 / 20; // град/с — повний оберт за 20s
const HOVER_SPEED = SPEED * 4;
const RADIUS = 82; // лінія тексту; літери стоять назовні від неї
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function OrbitLink({ href, label, className = "" }) {
  const ring = useRef(null);
  const textRef = useRef(null);
  const hover = useRef(false);
  const pathId = useId();
  const text = `${label} - `.repeat(3).toUpperCase();

  // Текст має рівно замкнути кільце. SVG textLength браузери підтримують
  // по-різному (Safari його ігнорує), тож міряємо довжину після завантаження
  // шрифту й розтягуємо трекінг на різницю.
  useEffect(() => {
    const t = textRef.current;
    if (!t) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      t.style.letterSpacing = "0px";
      const gap = (CIRCUMFERENCE - t.getComputedTextLength()) / text.length;
      t.style.letterSpacing = `${gap}px`;
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  useEffect(() => {
    const el = ring.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let angle = 0;
    let speed = SPEED;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // Швидкість доганяє ціль плавно — без ривка при наведенні.
      speed += ((hover.current ? HOVER_SPEED : SPEED) - speed) * Math.min(1, dt * 4);
      angle = (angle + speed * dt) % 360;
      el.style.transform = `rotate(${angle}deg)`;
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
      onFocus={() => (hover.current = true)}
      onBlur={() => (hover.current = false)}
      className={`group relative flex size-63 shrink-0 items-center justify-center rounded-full text-primary outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary ${className}`}
    >
      <svg
        ref={ring}
        viewBox="0 0 250 250"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          <path id={pathId} d={`M125,125 m-${RADIUS},0 a${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`} />
        </defs>
        <text ref={textRef} className="fill-current text-20">
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <ArrowIcon className="size-10 -rotate-45" />
    </a>
  );
}
