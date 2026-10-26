import { useEffect, useRef } from "react";
import Heading from "./ui/Heading.jsx";
import Media from "./ui/Media.jsx";

// Шоуріл зі скролом: секція закріплюється на екрані (.reel-*, index.css), а скрол веде анімацію
// (всього ~60% висоти екрана). Спершу великий заголовок над вужчою карткою; скролимо — одним
// рухом заголовок зменшується, а картка паралельно розтягується на всю ширину, піднімається
// й накриває його (прогрес --a: 0 → 1, згладжений). Значення пишеться в CSS-змінну на
// `.reel-stage`. При prefers-reduced-motion — заголовок і картка один під одним.
export default function Showreel() {
  const track = useRef(null);
  const stage = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const ease = (v) => v * v * (3 - 2 * v); // smoothstep: плавний старт і фініш
    const update = () => {
      frame = 0;
      const r = track.current.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - window.innerHeight));
      // Один рух: заголовок зменшується, картка одночасно росте й піднімається та накриває його.
      stage.current.style.setProperty("--a", ease(p));
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
  }, []);

  return (
    <section ref={track} aria-labelledby="showreel-title" className="reel-track bg-black">
      <div ref={stage} className="reel-stage">
        <div className="reel-title px-6 md:px-10">
          <Heading id="showreel-title" level="display" as="h2">
            Seen in motion
          </Heading>
        </div>
        <div className="reel-card">
          <Media label="Showreel" alt="EMOTE showreel" fill />
        </div>
      </div>
    </section>
  );
}
