import { useState } from "react";

// Колодязь під зображення. Без `src` (або якщо файл не завантажився)
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
  const shape = `${fill ? "absolute inset-0" : "relative"} overflow-hidden ${round ? "rounded-full" : ""} ${className}`;

  if (src && !failed && next) {
    return (
      <div className={shape}>
        <img src={src} alt={alt} onError={() => setFailed(true)} className={`h-full w-full object-cover ${HOVERS[hover]}`} />
        <img
          src={next}
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
        <img src={src} alt={alt} onError={() => setFailed(true)} className={`h-full w-full object-cover ${HOVERS[hover]}`} />
      </div>
    );
  }

  return (
    <div className={`${shape} flex items-center justify-center ${PLACEHOLDERS[placeholder]}`} aria-hidden="true">
      {label && <span className="text-12 leading-4 font-semibold uppercase tracking-widest text-secondary">{label}</span>}
    </div>
  );
}
