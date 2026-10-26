import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Курсор-лого «ö» — «Loose dots» + «Eyes». SVG з Figma (node 40002079:385,
// public/brand/emote-mark.svg), розібране на кільце й дві крапки.
// Кільце йде за мишею; крапки-очі висять на пружинах (відстають і
// збираються назад у лого), дивляться в бік руху й кліпають.
//
//   спокій           лого
//   посилання,       кільце трохи менше, очі мружаться й один раз підстрибують
//   кнопка
//   data-cursor=     головний CTA (Button light/primary): очі радісно
//   "cta"            підстрибують
//
// Картки кейсів курсор не підписує: їхній hover — як у «Latest & Greatest»
// (назва прокручується в «View case →», сусіди тьмяніють).
// Колір — білий з тонким чорним контуром (видно і на чорному, і на білій кнопці); без mix-blend-mode.
// Лише миша й без prefers-reduced-motion; інакше — системний курсор.
// Стилі `.cursor-*` і `.has-cursor` — в index.css.
const RING =
  "M25.7267 14.8778C22.8154 12.0803 19.2713 10.6815 15.0626 10.6815C10.8539 10.6815 7.30979 12.0803 4.36689 14.8778C1.45563 17.6753 0 21.0769 0 25.146C0 29.2151 1.48727 32.6485 4.36689 35.446C7.30979 38.2435 10.8539 39.6105 15.0626 39.6105C19.2713 39.6105 22.8154 38.2435 25.7267 35.446C28.6379 32.6485 30.1252 29.2151 30.1252 25.146C30.1252 21.0769 28.6379 17.6436 25.7267 14.8778ZM23.9862 26.0043C23.7331 28.5158 22.6888 30.5503 20.8218 31.9809C18.9548 33.4114 16.7397 34.0155 14.2082 33.7611C11.6767 33.5068 9.61981 32.4895 8.06925 30.7093C6.55033 28.8655 5.88581 26.7355 6.13896 24.2241C6.39211 21.7127 7.43637 19.7417 9.30337 18.2794C11.1704 16.7852 13.3855 16.1812 15.917 16.4355C18.4485 16.6898 20.5054 17.7389 22.056 19.551C23.6065 21.363 24.2394 23.4929 23.9862 26.0043Z";
const DOT_1 =
  "M15.0311 1.04907C14.3033 0.349691 13.4489 0 12.4047 0C11.3604 0 10.4744 0.349691 9.74656 1.04907C9.01874 1.74846 8.67065 2.575 8.67065 3.59228C8.67065 4.60957 9.05039 5.43611 9.74656 6.13549C10.4744 6.83487 11.3604 7.15277 12.4047 7.15277C13.4489 7.15277 14.335 6.80308 15.0311 6.13549C15.7589 5.43611 16.107 4.60957 16.107 3.59228C16.107 2.575 15.7589 1.74846 15.0311 1.04907Z";
const DOT_2 =
  "M27.1506 2.95642C26.4228 2.25704 25.5684 1.90735 24.5241 1.90735C23.4799 1.90735 22.5938 2.25704 21.866 2.95642C21.1382 3.6558 20.7901 4.48235 20.7901 5.49963C20.7901 6.51691 21.1698 7.34346 21.866 8.04284C22.5938 8.74222 23.4799 9.06012 24.5241 9.06012C25.5684 9.06012 26.4544 8.71043 27.1506 8.04284C27.8784 7.34346 28.2265 6.51691 28.2265 5.49963C28.2265 4.48235 27.8784 3.6558 27.1506 2.95642Z";

// Центри крапок відносно центру кільця (15.06, 25.15) у координатах лого.
const OFFSET_1 = [-2.67, -21.57];
const OFFSET_2 = [9.45, -19.67];

// Масштаб кільця в кожному стані.
const SCALE = { idle: 1, link: 0.85, cta: 1.15 };

// Наскільки крапки відстають (0 — тримаються лого, 1 — бовтаються).
// 0.6 — як у превʼю, що обрала дизайнерка.
const LOOSE = 0.6;

const INTERACTIVE = "a, button, [role='button'], [tabindex]:not([tabindex='-1']), input, select, textarea, label";

function stateOf(target) {
  if (target.closest?.("[data-cursor='cta']")) return { mode: "cta" };
  if (target.closest?.(INTERACTIVE)) return { mode: "link" };
  return { mode: "idle" };
}

const spring = (s, tx, ty, k, d) => {
  s.vx = (s.vx + (tx - s.x) * k) * d;
  s.vy = (s.vy + (ty - s.y) * k) * d;
  s.x += s.vx;
  s.y += s.vy;
};

// Остання позиція миші живе поза компонентом: Cursor стоїть у кожній сторінці (`Page`)
// і перемонтується при переході, а курсор не повинен зникати чи вилітати з кута.
const last = { x: -100, y: -100, seen: false };

export default function Cursor() {
  const root = useRef(null);
  const ring = useRef(null);
  const dot1 = useRef(null);
  const dot2 = useRef(null);

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    document.documentElement.classList.add("has-cursor");

    let mouse = { x: last.x, y: last.y };
    let state = { mode: "idle" };
    const pos = { x: last.x, y: last.y, vx: 0, vy: 0 };
    const eye1 = { x: last.x, y: last.y, vx: 0, vy: 0 };
    const eye2 = { x: last.x, y: last.y, vx: 0, vy: 0 };
    let prev = { x: last.x, y: last.y };
    let look = { x: 0, y: 0 };
    let scale = SCALE.idle;
    let hop = 0;
    let blink = 1500;
    let recheck = 150;
    let lastTime = performance.now();
    let frame = 0;
    let dirty = false;
    if (last.seen) root.current.style.opacity = 1;

    const setState = (next) => {
      if (next.mode === state.mode) return;
      state = next;
      if (state.mode === "link") hop = 0.001;
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mouse = { x: e.clientX, y: e.clientY };
      last.x = mouse.x;
      last.y = mouse.y;
      last.seen = true;
      root.current.style.opacity = 1;
      setState(stateOf(e.target));
    };
    const onLeave = () => {
      root.current.style.opacity = 0;
    };

    let acc = 0;

    // Один крок фізики — 1/60 s; так рух однаковий на 60 і 120 Гц.
    const step = (lift) => {
      spring(pos, mouse.x, mouse.y, 0.35, 0.55);
      const dx = pos.x - prev.x;
      const dy = pos.y - prev.y;
      prev = { x: pos.x, y: pos.y };
      const speed = Math.hypot(dx, dy);
      // Погляд — у бік руху; після зупинки повільно повертається в центр.
      if (speed > 0.6) {
        look.x += (dx / speed - look.x) * 0.25;
        look.y += (dy / speed - look.y) * 0.25;
      } else {
        look.x *= 0.985;
        look.y *= 0.985;
      }
      scale += (SCALE[state.mode] - scale) * 0.15;

      const reach = 4.5 * Math.min(1, Math.hypot(look.x, look.y));
      const ex = look.x * reach;
      const ey = look.y * reach;
      spring(eye1, pos.x + OFFSET_1[0] * scale + ex, pos.y + OFFSET_1[1] * scale + ey + lift, 0.35 - 0.29 * LOOSE, 0.55 + 0.2 * LOOSE);
      spring(eye2, pos.x + OFFSET_2[0] * scale + ex, pos.y + OFFSET_2[1] * scale + ey + lift * 0.9, 0.35 - 0.31 * LOOSE, 0.55 + 0.2 * LOOSE);
    };

    const tick = (now) => {
      // Після паузи (фонова вкладка, просідання кадрів) доганяємо до 0.25s,
      // а не стрибаємо.
      const dt = Math.min(250, now - lastTime);
      lastTime = now;

      // Підскок: на CTA — безперервно, на посиланні — один раз.
      let lift = 0;
      if (state.mode === "cta") {
        hop += dt / 320;
        lift = -Math.abs(Math.sin(hop * Math.PI)) * 8;
      } else if (state.mode === "link" && hop > 0 && hop < 1) {
        hop = Math.min(1, hop + dt / 300);
        lift = -Math.sin(hop * Math.PI) * 6;
      }

      for (acc += dt; acc >= 1000 / 60; acc -= 1000 / 60) step(lift);

      // Попап закрився, а миша стоїть: стан під курсором міняється без руху — перевіряємо раз на ~150 мс.
      // Також одразу після скролу, кліку чи змін у DOM (відкрився/закрився попап).
      recheck -= dt;
      if (recheck < 0 || dirty) {
        recheck = 150;
        dirty = false;
        const under = last.seen ? document.elementFromPoint(mouse.x, mouse.y) : null;
        if (under) setState(stateOf(under));
      }

      blink -= dt;
      let lid = 1;
      if (blink < 0 && blink > -110) lid = 0.12;
      if (blink < -110) blink = 1600 + Math.random() * 2800;
      const squint = state.mode === "link" ? 0.6 : 1;

      ring.current.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
      dot1.current.style.transform = `translate(${eye1.x}px, ${eye1.y}px) scale(1, ${lid * squint})`;
      dot2.current.style.transform = `translate(${eye2.x}px, ${eye2.y}px) scale(1, ${lid * squint})`;
      frame = requestAnimationFrame(tick);
    };

    const markDirty = () => {
      dirty = true;
    };
    // Курсор повертається з іншого вікна/вкладки: стан і видимість відновлюються.
    const onVisible = () => {
      lastTime = performance.now();
      acc = 0;
      dirty = true;
    };
    const mo = new MutationObserver(markDirty);
    mo.observe(document.body, { childList: true });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", markDirty, { passive: true });
    window.addEventListener("scroll", markDirty, { passive: true });
    document.addEventListener("visibilitychange", onVisible);
    // Ховаємо лише коли миша справді вийшла з вікна (relatedTarget порожній), а не при зміні елемента під нею.
    const onOut = (e) => {
      if (!e.relatedTarget) onLeave();
    };
    document.addEventListener("mouseout", onOut);
    frame = requestAnimationFrame(tick);
    return () => {
      mo.disconnect();
      window.removeEventListener("pointerdown", markDirty);
      window.removeEventListener("scroll", markDirty);
      document.removeEventListener("visibilitychange", onVisible);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  // У body, а не в <main>: щоб курсор завжди лежав над попапами (портали) і
  // не залежав від stacking context сторінки.
  return createPortal(
    <>
    <div ref={root} aria-hidden="true" className="cursor">
      <div ref={ring} className="cursor-part cursor-ring">
        <svg viewBox="0 10.68 30.13 28.93" width="30.13" height="28.93">
          <path d={RING} fill="currentColor" />
        </svg>
      </div>
      <div ref={dot1} className="cursor-part cursor-dot">
        <svg viewBox="8.67 0 7.44 7.16" width="7.44" height="7.16">
          <path d={DOT_1} fill="currentColor" />
        </svg>
      </div>
      <div ref={dot2} className="cursor-part cursor-dot">
        <svg viewBox="20.79 1.91 7.44 7.15" width="7.44" height="7.15">
          <path d={DOT_2} fill="currentColor" />
        </svg>
      </div>
    </div>
    </>,
    document.body,
  );
}
