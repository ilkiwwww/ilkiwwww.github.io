import { useEffect, useRef, useState } from "react";

// Колодязь під зображення (або відео). Без `src` (або якщо файл не завантажився)
// показує плейсхолдер того ж розміру — макет не стрибає, а картинку можна
// просто покласти в public/ під очікуваним ім'ям.
// Заливка плейсхолдера: `raised` — видима плашка (картка), `none` — порожньо
// (повноекранний фон, де плашка лише заважає).
const PLACEHOLDERS = {
  raised: "bg-fill",
  none: "",
};

// Реакція на наведення батька (`group`): `zoom` — картинка повільно
// збільшується в рамці, рамка стоїть. Якщо є `next`, друге фото плавно
// проявляється поверх першого (картки робіт), і обидва так само збільшуються.
const HOVERS = {
  none: "",
  zoom: "transition-transform duration-1200 ease-reveal group-hover:scale-105 motion-reduce:transition-none",
};

export default function Media({ src, next, alt = "", label, fill = false, round = false, placeholder = "raised", hover = "none", className = "" }) {
  const [failed, setFailed] = useState(false);
  const video = useRef(null);
  const isVideo = !!src && /\.(mp4|webm)$/i.test(src);

  // Відео стартує саме й завжди: React не ставить `muted` до автоплею (Safari), тож вимикаємо звук і граємо вручну —
  // одразу, коли файл готовий, коли відео з'являється в екрані (IntersectionObserver), коли вкладка знову видима,
  // і якщо браузер його поставив на паузу, поки воно на екрані. Якщо автоплей заблоковано (економія заряду) —
  // стартуємо на перший жест користувача.
  useEffect(() => {
    const v = video.current;
    if (!isVideo || !v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    let visible = false;
    const play = () => {
      if (v.paused && !v.ended) v.play().catch(() => {});
    };
    const onPause = () => {
      if (visible && document.visibilityState === "visible") setTimeout(play, 150);
    };
    const onVisibility = () => document.visibilityState === "visible" && play();
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    const gestures = ["pointerdown", "keydown", "touchstart", "click"];
    const gesture = () => {
      play();
      gestures.forEach((e) => window.removeEventListener(e, gesture));
    };
    gestures.forEach((e) => window.addEventListener(e, gesture, { passive: true }));
    const media = ["loadeddata", "canplay", "suspend", "stalled"];
    media.forEach((e) => v.addEventListener(e, play));
    v.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);
    play();
    return () => {
      io.disconnect();
      media.forEach((e) => v.removeEventListener(e, play));
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
      gestures.forEach((e) => window.removeEventListener(e, gesture));
    };
  }, [isVideo, src, failed]);
  const shape = `${fill ? "absolute inset-0" : "relative"} overflow-hidden ${round ? "rounded-full" : ""} ${className}`;

  // Відео (mp4/webm): без звуку, по колу, як гіф. Помилка завантаження — плейсхолдер.
  if (src && !failed && isVideo) {
    return (
      <div className={shape}>
        <video ref={video} src={src} preload="auto" aria-label={alt || undefined} aria-hidden={alt ? undefined : true} autoPlay muted loop playsInline onError={() => setFailed(true)} className="h-full w-full object-cover" />
      </div>
    );
  }

  if (src && !failed && next) {
    return (
      <div className={shape}>
        <img src={src} alt={alt} decoding="async" onError={() => setFailed(true)} className={`h-full w-full object-cover ${HOVERS[hover]}`} />
        <img
          src={next}
          decoding="async"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,scale] duration-800 ease-case group-hover:opacity-100 ${hover === "zoom" ? "group-hover:scale-105" : ""} motion-reduce:transition-none`}
        />
      </div>
    );
  }

  if (src && !failed) {
    return (
      <div className={shape}>
        <img src={src} alt={alt} decoding="async" onError={() => setFailed(true)} className={`h-full w-full object-cover ${HOVERS[hover]}`} />
      </div>
    );
  }

  return (
    <div className={`${shape} flex items-center justify-center ${PLACEHOLDERS[placeholder]}`} aria-hidden="true">
      {label && <span className="text-12 leading-4 font-semibold uppercase tracking-widest text-secondary">{label}</span>}
    </div>
  );
}
